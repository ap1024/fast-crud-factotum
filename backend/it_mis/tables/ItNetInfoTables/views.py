
from dvadmin.utils.viewset import CustomModelViewSet

from .models import ItNetType
from .serializers import ItNetInfoSerializer, ItNetTypeCreateUpdateSerializer

class ItNetTypeViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
   
    queryset = ItNetType.objects.all()
    serializer_class = ItNetInfoSerializer
    create_serializer_class = ItNetTypeCreateUpdateSerializer
    update_serializer_class = ItNetTypeCreateUpdateSerializer



from .models import NetSpeed
from .serializers import NetSpeedSerializer, NetSpeedCreateUpdateSerializer

class NetSpeedViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
   
    queryset = NetSpeed.objects.all()
    serializer_class = NetSpeedSerializer
    create_serializer_class = NetSpeedCreateUpdateSerializer
    update_serializer_class = NetSpeedCreateUpdateSerializer


from .models import ItNetInfo
from .serializers import ItNetInfoSerializer, ItNetInfoCreateUpdateSerializer
from .modelFilter import ItNetInfoFilter

class ItNetInfoViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
   
    queryset = ItNetInfo.objects.all()
    serializer_class = ItNetInfoSerializer
    create_serializer_class = ItNetInfoCreateUpdateSerializer
    update_serializer_class = ItNetInfoCreateUpdateSerializer
    filter_class = ItNetInfoFilter




class ItNetInfoViewSetStatus(CustomModelViewSet):

    """
    list:查询时只返加状态为未使用的对象及加上自己当前的对象

    """
    queryset = ItNetInfo.objects.all()


    def get_queryset(self, **kwargs):
        # 拿到前端传回后端的PK值，即是ID
        pk = self.kwargs['pk']
        # 将当前ID的class查出来
        additional_object = ItNetInfo.objects.filter(id=pk)
        # 将所有未使用状态的对象查出来，这里use_status的值1代表"在用"，2代表"未用"
        filtered_queryset = ItNetInfo.objects.filter(use_status=2)
        # 拼接两个对象内容，然后返回给前端
        self.queryset = filtered_queryset.union(additional_object)

        return super().get_queryset()

    serializer_class = ItNetInfoSerializer




from .models import DevicePortModel
from .serializers import DevicePortModelSerializer, DevicePortModelCreateUpdateSerializer

class DevicePortModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
   
    queryset = DevicePortModel.objects.all()
    serializer_class = DevicePortModelSerializer
    create_serializer_class = DevicePortModelCreateUpdateSerializer
    update_serializer_class = DevicePortModelCreateUpdateSerializer


    #注释编号: django-vue3-admin_views091411:自定义排序处理,不建议把排序写在model里面
    def get_queryset(self):  
        queryset = super().get_queryset() 
        #这里拿到request传过来的参数,我们主要是判断是否有ordering的key在里面嘛,有的话直接使用ordering排序,没有的话就给个None,接下来就是使用默认排序
        ordering = self.request.query_params.get('ordering', None)  
        if ordering:  
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('title', '-create_datetime')
        return queryset





from .models import ItNetInfoSubModel
from .serializers import ItNetInfoSubModelSerializer, ItNetInfoSubModelCreateUpdateSerializer

from it_mis.tables.ItResourceTables.models import ItResource


class ItNetInfoSubModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
   
    queryset = ItNetInfoSubModel.objects.all()
    serializer_class = ItNetInfoSubModelSerializer
    create_serializer_class = ItNetInfoSubModelCreateUpdateSerializer
    update_serializer_class = ItNetInfoSubModelCreateUpdateSerializer

    def get_queryset(self):

        # 注释编号:django-vue3-admin_views454814
        # 功能说明:这里是进行了排序的处理
        queryset = super().get_queryset() 
        ordering = self.request.query_params.get('ordering', None)  
        if ordering:  
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('create_datetime')
        
        # 注释编号:django-vue3-admin_views454814


        if self.action == "update":       #注释编号: django-vue3-admin_views320417:这是匹配到更新数据时,要进行使用状态,端口,使用者同步至光纤网络那边表
            
            if self.request.data.get("itnetinfo"):
                ItResource_obj = ItResource.objects.all().get(id=self.request.data.get("used_by")) 
                if self.request.data.get("device_port"):
                    DevicePortModel_obj = DevicePortModel.objects.all().get(id=self.request.data.get("device_port"))
                else:
                    DevicePortModel_obj = None
                
                if self.request.data.get("description"):
                    new_description = self.request.data.get("description")
                else:
                    new_description = None

                oldObject = ItNetInfoSubModel.objects.all().get(id=self.request.data.get("id")) 
                oldNum = getattr(oldObject, "itnetinfo_id")
                newNum = self.request.data.get("itnetinfo")
                opObj = ItNetInfo
                if oldNum != newNum:
                    #这里要先判断两个值不相等，接下来的代码才有意义
                    #有值的情况处理，即要把原来的旧的序列号同步设置为未使用状态
                    obj = opObj.objects.get(id=oldNum)
                    obj.use_status = "未用"
                    obj.used_by_port = None
                    obj.used_by = None
                    obj.other_description = None
                    # 把旧序列号的使用状态设置为未使用状态
                    obj.save()

                    #接下来配置新序列号的使用状态为使用
                    obj = opObj.objects.get(id=newNum)
                    obj.use_status = "在用"
                    obj.used_by = ItResource_obj
                    obj.used_by_port = DevicePortModel_obj
                    obj.other_description =  new_description  #这里等于当前传进来的description值
                    obj.save()

                else:
                    #那怕是相同的对象，也有可能是修改了其它的值，比如注释，或者商口之类的，反正不理了，全部值给重新赋值给那个对象肯定就是对的。
                    obj = opObj.objects.get(id=newNum)
                    obj.use_status = "在用"
                    obj.used_by = ItResource_obj
                    obj.used_by_port = DevicePortModel_obj
                    obj.other_description =  new_description
                    obj.save()
                

        elif self.action == "destroy": #注释编号: django-vue3-admin_views280517:这是匹配到删除时操作时,同步至光纤网络那边表对使用状态,端口,使用者进行清理
            opObj = ItNetInfo
            oldObject = ItNetInfoSubModel.objects.all().get(id=self.request.data.get("id")) 

            if oldObject.itnetinfo:   # 因为itnetinfo不是必须字段，所以这里要做个判断一下。
                oldNum = getattr(oldObject, "itnetinfo_id")
                obj = opObj.objects.get(id=oldNum)
                obj.use_status = "未用"
                obj.used_by_port = None
                obj.used_by = None
                obj.other_description = None
                obj.save()
          
        return super().get_queryset()
    

# 注释编号:django-vue3-admin_views375016
# 功能说明:单独引入一个views对一对一字段的处理
class ItNetInfoSubModelStatuViewSet(CustomModelViewSet):
    """
    针对网络子表中一对一字段进行过滤拼接
    """
    queryset = ItNetInfo.objects.all()

    def get_queryset(self, **kwargs):
        # 拿到前端传回后端的PK值，即是ID
        pk = self.kwargs['pk']
        # 将当前ID的class查出来
        additional_object = ItNetInfo.objects.filter(used_by=pk)

        # 将所有未使用状态的对象查出来，#这里use_status的值1代表"在用"，2代表"未用"
        filtered_queryset = ItNetInfo.objects.filter(use_status=2)

        # 拼接两个对象内容，然后返回给前端
        self.queryset = filtered_queryset.union(additional_object)

        return super().get_queryset()

    serializer_class = ItNetInfoSerializer









# 注释编号:django-vue3-admin_views375016