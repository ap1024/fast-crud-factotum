from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers


""" 注释编号:django-vue-admin__serializers18271817:代码开始行"""
""" 功能说明:这里是对组织构架4个model的序列化"""

from PublicResource.tables.OrganizationTables.models import AreaModel, CompanyModel, DepartmentModel, OrganizationModel

class AreaModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = AreaModel
        fields = "__all__"


class AreaModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = AreaModel
        fields = '__all__'


class CompanyModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = CompanyModel
        fields = "__all__"


class CompanyModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = CompanyModel
        fields = '__all__'


class DepartmentModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = DepartmentModel
        fields = "__all__"


class DepartmentModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = DepartmentModel
        fields = '__all__'


class OrganizationModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = OrganizationModel
        fields = "__all__"


class OrganizationModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = OrganizationModel
        fields = '__all__'


""" 注释编号:django-vue-admin__serializers271817:代码结束行"""