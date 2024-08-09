
class use_status_and_used_by_action():
    def updata(opObj, curObj, self, field_id, field):
        """
        1、要操作的obj类opObj
        2、当前视图对应的obj类curObj
        3、当前对象的实例self
        4、含有ID的字段名称field_id
        5、字段名field
        """
        if self.request.data.get("id"):
            oldObject = curObj.objects.all().get(id=self.request.data.get("id"))
            oldNum = getattr(oldObject, field_id)
            newNum = self.request.data.get(field)
            if oldNum != newNum:
                #这里要先判断两个值不相等，接下来的代码才有意义
                if oldNum or newNum:
                    if oldNum:
                        # 这里newNum就会出现有值跟没有值的情况，要作判断
                        if newNum:
                            #有值的情况处理，即要把原来的旧的序列号同步设置为未使用状态
                            obj = opObj.objects.get(id=oldNum)

                            #这里use_status的值1代表"在用"，2代表"未用"
                            obj.use_status = 2

                            obj.used_by = None
                            # 把旧序列号的使用状态设置为未使用状态
                            obj.save()

                            #接下来配置新序列号的使用状态为使用
                            obj = opObj.objects.get(id=newNum)

                            #这里use_status的值1代表"在用"，2代表"未用"
                            obj.use_status = 1

                            obj.used_by = oldObject
                            obj.save()

                        else:
                        # newNum无值的情况，即是取消了序列号的引用
                            # 把旧序列号的使用状态设置为未使用状态便可
                            obj = opObj.objects.get(id=oldNum)

                            #这里use_status的值1代表"在用"，2代表"未用"
                            obj.use_status = 2

                            # 清空使用者的引用
                            obj.used_by = None
                            obj.save()
                    else:
                        #oldNum没有值的情况下，那么newNum肯定是有值的才能进到这个循环的，直接对newNum有值的情况进行处理便可。
                            #直接配置新序列号的使用状态为使用
                            obj = opObj.objects.get(id=newNum)

                            #这里use_status的值1代表"在用"，2代表"未用"
                            obj.use_status = 1

                            # 把当前当前编辑的对象传给外键便好
                            obj.used_by = oldObject
                            obj.save()

    def destroy(opObj, curObj, self, field_id):
        """
        "未用"、要操作的obj类opObj
        2、当前视图对应的obj类curObj
        3、当前对象的实例self
        4、含有ID的字段名称field_id
        """
        try:
            oldNum = getattr(curObj.objects.all().get(id=self.request.data.get("id")), field_id)
            obj = opObj.objects.get(id=oldNum)

            #这里use_status的值1代表"在用"，2代表"未用"
            obj.use_status = 2

            obj.used_by = None
            obj.save()
        except:
            pass



    def  add(instance, opObj, field_id):
        """
        "未用"、当前instance
        2、要操作对应的model对象opObj
        3、含有ID的字段名称field_id
        """
        id = getattr(instance, field_id)
        newobj = opObj.objects.get(id=id)

        #这里use_status的值1代表"在用"，2代表"未用"
        newobj.use_status = 1

        # license_obj.save() 这里放在后面跟别的操作一起保存，不单独进行保存
        # 功能说明: 这里同步有序列号时，对序列那边也要添加一个使用者的信息操作
        newobj.used_by = instance #把外健对象直接给到外键便可
        newobj.save() #保存对象