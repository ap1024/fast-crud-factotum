from dvadmin.utils.viewset import CustomModelViewSet



""" 注释编号:django-vue-admin__views013217:代码开始行"""
""" 功能说明:这里是对组织构架4个model的"""

from PublicResource.tables.OrganizationTables.models import AreaModel, CompanyModel, DepartmentModel, OrganizationModel

from PublicResource.tables.OrganizationTables.serializers import AreaModelSerializer, AreaModelCreateUpdateSerializer
from PublicResource.tables.OrganizationTables.serializers import CompanyModelSerializer, CompanyModelCreateUpdateSerializer
from PublicResource.tables.OrganizationTables.serializers import DepartmentModelSerializer, DepartmentModelCreateUpdateSerializer
from PublicResource.tables.OrganizationTables.serializers import OrganizationModelSerializer, OrganizationModelCreateUpdateSerializer

#注释编号: django-vue3-admin-views215716:导入字段权限控制类FieldPermissionMixin,接下来就在AreaModelViewSet进行继承使用
from dvadmin.utils.field_permission import FieldPermissionMixin  

class AreaModelViewSet(CustomModelViewSet, FieldPermissionMixin):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """


    import_field_dict = {
        "title": "区域",
    }
    import_serializer_class = AreaModelSerializer



    queryset = AreaModel.objects.all()
    serializer_class = AreaModelSerializer
    create_serializer_class = AreaModelCreateUpdateSerializer
    update_serializer_class = AreaModelCreateUpdateSerializer



class CompanyModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = CompanyModel.objects.all()
    serializer_class = CompanyModelSerializer
    create_serializer_class = CompanyModelCreateUpdateSerializer
    update_serializer_class = CompanyModelCreateUpdateSerializer
   


class DepartmentModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = DepartmentModel.objects.all()
    serializer_class = DepartmentModelSerializer
    create_serializer_class = DepartmentModelCreateUpdateSerializer
    update_serializer_class = DepartmentModelCreateUpdateSerializer

class OrganizationModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = OrganizationModel.objects.all()
    serializer_class = OrganizationModelSerializer
    create_serializer_class = OrganizationModelCreateUpdateSerializer
    update_serializer_class = OrganizationModelCreateUpdateSerializer





""" 注释编号:django-vue-admin__views013217:代码结束行"""
