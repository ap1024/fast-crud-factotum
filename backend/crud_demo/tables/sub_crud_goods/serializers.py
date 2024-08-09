from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers


from .models import goodsModel1, goodsToOtherModel1, goodsportModel1, goodstypeModel1

class goodsModel1Serializer(CustomModelSerializer):
    """
    序列化器
    """

#这里是进行了序列化模型及所有的字段
    class Meta:
        model = goodsModel1
        fields = "__all__"

#这里是创建/更新时的列化器
class goodsModel1CreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """


    class Meta:
        model = goodsModel1
        fields = '__all__'



class goodsToOtherModel1Serializer(CustomModelSerializer):
    """
    序列化器
    """

#这里是进行了序列化模型及所有的字段
    class Meta:
        model = goodsToOtherModel1
        fields = "__all__"

#这里是创建/更新时的列化器
class goodsToOtherModel1CreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """


    class Meta:
        model = goodsToOtherModel1
        fields = '__all__'

        #注释编号: django-vue3-admin_serializers542711:这里做一个联合唯一的配置
        validators = [
            serializers.UniqueTogetherValidator(
                queryset=goodsToOtherModel1.objects.all(),
                fields=('goodstype', 'goodsport'),
                message="商品类型及端口出现组合相同的情况，请修改成其它组合"
            )
        ]




class goodsportModel1Serializer(CustomModelSerializer):
    """
    序列化器
    """

#这里是进行了序列化模型及所有的字段
    class Meta:
        model = goodsportModel1
        fields = "__all__"

#这里是创建/更新时的列化器
class goodsportModel1CreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """


    class Meta:
        model = goodsportModel1
        fields = '__all__'



class goodstypeModel1Serializer(CustomModelSerializer):
    """
    序列化器
    """

#这里是进行了序列化模型及所有的字段
    class Meta:
        model = goodstypeModel1
        fields = "__all__"

#这里是创建/更新时的列化器
class goodstypeModel1CreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """


    class Meta:
        model = goodstypeModel1
        fields = '__all__'