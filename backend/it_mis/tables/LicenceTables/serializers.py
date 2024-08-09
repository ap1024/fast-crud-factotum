
from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers

from .models import Licence

class LicenceSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = Licence
        fields = "__all__"

class LicenceCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = Licence
        fields = '__all__'