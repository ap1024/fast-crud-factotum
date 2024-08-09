from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers


from .models import LineTagtypeModel, LineTagModel, lineAccessTypeModel, SubLineTagModel

class LineTagtypeModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = LineTagtypeModel
        fields = "__all__"

class LineTagtypeModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = LineTagtypeModel
        fields = '__all__'


class LineTagModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = LineTagModel
        fields = "__all__"

class LineTagModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = LineTagModel
        fields = '__all__'



class lineAccessTypeModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = lineAccessTypeModel
        fields = "__all__"

class lineAccessTypeModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = lineAccessTypeModel
        fields = '__all__'



class SubLineTagModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = SubLineTagModel
        fields = "__all__"

class SubLineTagModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = SubLineTagModel
        fields = '__all__'


    def validate(self, attrs):
        lineaccesstype = attrs.get('lineaccesstype')
        device_ownership = attrs.get('device_ownership')
        device_ownership_url = attrs.get('device_ownership_url')
        port_direction = attrs.get('port_direction')
        device_port = attrs.get('device_port')

        
        # 检查是否已经有相同的组合存在
        #注释编号: django-vue3-admin-serializers593615:对子表设备类型、设备归属、URL、端口方向及端口组合做联合校验
        if lineaccesstype and device_ownership and device_ownership_url and port_direction and device_port:

            #这里拿到查询结果，这里肯定只能拿到一个对象
            obj_queryset = SubLineTagModel.objects.filter(lineaccesstype=lineaccesstype, device_ownership=device_ownership, device_ownership_url=device_ownership_url, port_direction=port_direction, device_port=device_port)
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





from it_mis.tables.ItResourceTables.models import ItResource

class ItResourceViewSetSubSerializer(CustomModelSerializer):
    """
    序列化器
    """
    # it_use = serializers.PrimaryKeyRelatedField(source='it_use.use',queryset = ItResource.objects.all()) # 不建议在这里配置序列化字段，会导致外部编辑页面更新出错

    class Meta:
        model = ItResource
        fields = "__all__"



class ItResourceViewSetSubUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = ItResource
        fields = '__all__'



from .models import LineAreaModel

class LineAreaModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = LineAreaModel
        fields = "__all__"

class LineAreaModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = LineAreaModel
        fields = '__all__'



from .models import NetworkFrameModel

class NetworkFrameModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = NetworkFrameModel
        fields = "__all__"

class NetworkFrameModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = NetworkFrameModel
        fields = '__all__'