from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers


from .models import TelephoneTypeModel

class TelephoneTypeModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = TelephoneTypeModel
        fields = "__all__"

class TelephoneTypeModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = TelephoneTypeModel
        fields = '__all__'



from .models import lineAccessModel

class lineAccessModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = lineAccessModel
        fields = "__all__"

class lineAccessModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = lineAccessModel
        fields = '__all__'


       
from .models import TelephoneModel
class TelephoneModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = TelephoneModel
        fields = "__all__"

class TelephoneModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = TelephoneModel
        fields = '__all__'



from .models import TelAccessTypeModel
class TelAccessTypeModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = TelAccessTypeModel
        fields = "__all__"

class TelAccessTypeModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = TelAccessTypeModel
        fields = '__all__'




from .models import SubTelephoneModel
class SubTelephoneModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = SubTelephoneModel
        fields = "__all__"

class SubTelephoneModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = SubTelephoneModel
        fields = '__all__'



    def validate(self, attrs):
        accesstype = attrs.get('accesstype')
        accessInfo = attrs.get('accessInfo')
        url = attrs.get('url')
        port_direction = attrs.get('port_direction')
        device_port = attrs.get('device_port')

        
        # 检查是否已经有相同的组合存在
        #对子表accesstype、accessInfo、url、port_direction、device_port组合做联合校验
        if accesstype and accessInfo and url and port_direction and device_port:

            #这里拿到查询结果，这里肯定只能拿到一个对象
            obj_queryset = SubTelephoneModel.objects.filter(accesstype=accesstype, accessInfo=accessInfo, url=url, port_direction=port_direction, device_port=device_port)
            if obj_queryset.exists():
                if self.request.data.get('id'):

                    if self.request.data['id'] == obj_queryset.get().id:
                        # 如果传过来的id等于数据查到相同对象的id，那么说明就是当前的旧对象做修改，而且与自己起了冲突
                        pass
                    else:
                        #如果两个id不相等，说明是直正的两条对象冲突了
                        raise serializers.ValidationError("相应的接入类型对应的接口方向及端口的组合出现重复，请修改成其它组合")
                else:
                    #新建对象时，就是没有id的，也要进行检验
                    raise serializers.ValidationError("相应的接入类型对应的接口方向及端口的组合出现重复，请修改成其它组合")

        return attrs