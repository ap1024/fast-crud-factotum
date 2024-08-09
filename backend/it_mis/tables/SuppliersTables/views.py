from dvadmin.utils.viewset import CustomModelViewSet

from .models import SuppliersType
from .serializers import SuppliersTypeSerializer, SuppliersTypeCreateUpdateSerializer

class SuppliersTypeViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
   
    queryset = SuppliersType.objects.all()
    serializer_class = SuppliersTypeSerializer
    create_serializer_class = SuppliersTypeCreateUpdateSerializer
    update_serializer_class = SuppliersTypeCreateUpdateSerializer


from it_mis.tables.SuppliersTables.models import Suppliers
from it_mis.tables.SuppliersTables.serializers import SuppliersSerializer, SuppliersCreateUpdateSerializer

from .modelFilter import SuppliersFilter

class SuppliersViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
   
    queryset = Suppliers.objects.all()
    serializer_class = SuppliersSerializer
    create_serializer_class = SuppliersCreateUpdateSerializer
    update_serializer_class = SuppliersCreateUpdateSerializer
    # 注释编号:django-vue3-admin__views321210: 这个filter_class是自定义配置的过滤，模糊查询也可以在里面进行配置
    filter_class = SuppliersFilter