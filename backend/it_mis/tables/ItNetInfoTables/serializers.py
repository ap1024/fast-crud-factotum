
from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers



from .models import ItNetType
class ItNetTypeSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = ItNetType
        fields = "__all__"

class ItNetTypeCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = ItNetType
        fields = '__all__'


from .models import  NetSpeed
class NetSpeedSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model =  NetSpeed
        fields = "__all__"

class NetSpeedCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model =  NetSpeed
        fields = '__all__'

from .models import ItNetInfo
class ItNetInfoSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = ItNetInfo
        fields = "__all__"

class ItNetInfoCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = ItNetInfo
        fields = '__all__'



from .models import DevicePortModel
class DevicePortModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = DevicePortModel
        fields = "__all__"

class DevicePortModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = DevicePortModel
        fields = '__all__'


from .models import ItNetInfoSubModel
class ItNetInfoSubModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = ItNetInfoSubModel
        fields = "__all__"



class ItNetInfoSubModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = ItNetInfoSubModel
        fields = '__all__'


    #注释编号: django-vue3-admin_serializers405714:这里就直接使用validators进行配置了两个字段的联合唯一了
    def validate(self, attrs):
        itnetinfo = attrs.get('itnetinfo')
        device_port = attrs.get('device_port')

        # 检查是否已经有相同的组合存在

        if itnetinfo and device_port :
            obj_queryset = ItNetInfoSubModel.objects.filter(itnetinfo=itnetinfo, device_port=device_port)
            if obj_queryset.exists():  #注释编号: django-vue3-admin-serializers255716:判断对象是否存在,存在如下代码的操作才有意义

                if self.request.data.get('id'):  #注释编号: django-vue3-admin-serializers525616:判断是否传进来ID,即是判断是新增对象还是编辑对象

                    if self.request.data['id'] == obj_queryset.get().id:
                        # 如果传过来的id等于数据查到相同对象的id，那么说明就是当前的旧对象做修改，而且与自己起了冲突
                        pass
                    else:
                        #如果两个id不相等，说明是直正的两条对象冲突了
                        raise serializers.ValidationError("商品类型及端口出现组合相同的情况，请修改成其它组合")
                else:
                    #新建对象时，就是没有id的，也要进行检验
                    raise serializers.ValidationError("商品类型及端口出现组合相同的情况，请修改成其它组合")
                    
        return attrs


    
    def create(self, validated_data):
        if self.request:
            #注释编号: django-vue3-admin_serializers340717:新增对象对于光纤网络的特殊处理
            
            if 'itnetinfo' in validated_data:
                itnetinfo_id = validated_data['itnetinfo'].id
                obj = ItNetInfo.objects.get(id=itnetinfo_id)
                obj.use_status = "在用"
                if 'device_port' in validated_data:
                    obj.used_by_port = validated_data['device_port']

                obj.used_by = validated_data['used_by']

                #因为description不是必填的,所以这里要做个判断
                if 'description' in validated_data:  
                    obj.other_description = validated_data['description']  
                else:  
                    obj.other_description = None

                obj.save()

        return super().create(validated_data)


