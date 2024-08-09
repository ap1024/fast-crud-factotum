# Create your views here.
from crud_demo.models import CrudDemoModel
from crud_demo.serializers import CrudDemoModelSerializer, CrudDemoModelCreateUpdateSerializer
from dvadmin.utils.viewset import CustomModelViewSet

from .modelFilter import goodsFilter


class CrudDemoModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    #注释编号:django-vue3-admin__views181311:码开始行
    # export_field_label = {
    #     "goods": "商品",
    #     "inventory": "库存量",
    #     "goods_price":"商品定价",
    #     "purchase_goods_date": "进货时间",
    # }

    # export_serializer_class = CrudDemoModelSerializer
    #注释编号:django-vue3-admin__views181311:代码结束行

    #注释编号:django-vue3-admin__views402916:代码开始行
    #功能说明:
    # import_field_dict = {
    #     "goods": "商品",
    #     "inventory": "库存量",
    #     "goods_price":"商品定价",
    #     "purchase_goods_date": "进货时间",
    # }

    # import_serializer_class = CrudDemoModelSerializer

    queryset = CrudDemoModel.objects.all()
    serializer_class = CrudDemoModelSerializer
    create_serializer_class = CrudDemoModelCreateUpdateSerializer
    update_serializer_class = CrudDemoModelCreateUpdateSerializer
    
    #注释编号: django-vue3-admin_views112816:配置自定义过滤器filter_class = goodsFilter
    filter_class = goodsFilter
    





from .models import goodstype
from .serializers import goodsTypeSerializer,goodsTypeSerializer
class goodsTypeViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = goodstype.objects.all()
    serializer_class = goodsTypeSerializer
    create_serializer_class = goodsTypeSerializer
    update_serializer_class = goodsTypeSerializer
    search_fields = ['title']




from .models import goodstypeportModel
from .serializers import goodstypeportModelSerializer,goodstypeportModelSerializer
class goodstypeportModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = goodstypeportModel.objects.all()
    serializer_class = goodstypeportModelSerializer
    create_serializer_class = goodstypeportModelSerializer
    update_serializer_class = goodstypeportModelSerializer
    search_fields = ['title']
    