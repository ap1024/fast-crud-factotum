from dvadmin.utils.viewset import CustomModelViewSet


from .models import goodstypeModel1, goodsModel1, goodsportModel1, goodsToOtherModel1

from .serializers import goodstypeModel1Serializer, goodstypeModel1CreateUpdateSerializer
from .serializers import goodsModel1Serializer, goodsModel1CreateUpdateSerializer
from .serializers import goodsportModel1Serializer, goodsportModel1CreateUpdateSerializer
from .serializers import goodsToOtherModel1Serializer, goodsToOtherModel1CreateUpdateSerializer


class goodstypeModel1ViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = goodstypeModel1.objects.all()
    serializer_class = goodstypeModel1Serializer
    create_serializer_class = goodstypeModel1CreateUpdateSerializer
    update_serializer_class = goodstypeModel1CreateUpdateSerializer
    

class goodsModel1ViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = goodsModel1.objects.all()
    serializer_class = goodsModel1Serializer
    create_serializer_class = goodsModel1CreateUpdateSerializer
    update_serializer_class = goodsModel1CreateUpdateSerializer
    

class goodsportModel1ViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = goodsportModel1.objects.all()
    serializer_class = goodsportModel1Serializer
    create_serializer_class = goodsportModel1CreateUpdateSerializer
    update_serializer_class = goodsportModel1CreateUpdateSerializer


class goodsToOtherModel1ViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = goodsToOtherModel1.objects.all()
    serializer_class = goodsToOtherModel1Serializer
    create_serializer_class = goodsToOtherModel1CreateUpdateSerializer
    update_serializer_class = goodsToOtherModel1CreateUpdateSerializer