from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers



from .models import globalDictModel


class globalDictModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = globalDictModel
        fields = "__all__"


class globalDictModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = globalDictModel
        fields = '__all__'

   

    def validate(self, attrs):

        dictMark = attrs.get('dictMark') 
        dictName = attrs.get('dictName')


        if dictMark and dictName :
            obj_queryset = globalDictModel.objects.filter(dictMark=dictMark, dictName=dictName)


            # 注释编号:django-vue3-admin-serializers344917
            # 功能说明:限制修改字典标记为dictMark的对象

            if self.request.data.get('id'):  #如果有ID说明是进来编辑修改对象的情况下
                old_obj_queryset = globalDictModel.objects.filter(id=self.request.data.get('id'))  #去查询原来数据里面对就ID的对象出来

                if old_obj_queryset.get().dictMark.dictName == 'dictMark':
                        if dictMark != old_obj_queryset.get().dictMark  or dictName != old_obj_queryset.get().dictName:

                            raise serializers.ValidationError("为防止错误出现，对于标记为dictMark的对象禁用修改字典标记与字典名称")
                        
            # 注释编号:django-vue3-admin-serializers344917
                        

            # 注释编号:django-vue3-admin-serializers435117
            # 功能说明:配置dictMark与dictName的联合唯一
                        
            if obj_queryset.exists():  

                if self.request.data.get('id'):  #如果有ID说明是进来编辑修改对象的情况下
                    if self.request.data.get('id') == obj_queryset.get().id:
                        # 如果传过来的id等于数据查到相同对象的id，那么说明就是当前的旧对象做修改，而且与自己起了冲突
                        pass
                    else:
                        #如果两个id不相等，说明是直正的两条对象冲突了
                        raise serializers.ValidationError("当前字典标记及字典名称组合已经存在,请检查或修改为其它")
                else:
                    #新建对象时，就是没有id的，也要进行检验
                    raise serializers.ValidationError("当前字典标记及字典名称组合已经存在,请检查或修改为其它")
            
            # 注释编号:django-vue3-admin-serializers435117
                    
        return attrs