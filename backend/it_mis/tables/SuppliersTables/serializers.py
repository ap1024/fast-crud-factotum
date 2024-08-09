from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers


from .models import SuppliersType

class SuppliersTypeSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = SuppliersType
        fields = "__all__"

class SuppliersTypeCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = SuppliersType
        fields = '__all__'




from .models import Suppliers

class SuppliersSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = Suppliers
        fields = "__all__"

class SuppliersCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = Suppliers
        fields = '__all__'
