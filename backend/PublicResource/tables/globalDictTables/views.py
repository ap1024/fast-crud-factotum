from dvadmin.utils.viewset import CustomModelViewSet




from .models import globalDictModel
from .serializers import globalDictModelSerializer, globalDictModelCreateUpdateSerializer

class globalDictModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    queryset = globalDictModel.objects.all()
    serializer_class = globalDictModelSerializer
    create_serializer_class = globalDictModelCreateUpdateSerializer
    update_serializer_class = globalDictModelCreateUpdateSerializer

    def get_queryset(self):  
        queryset = super().get_queryset() 

        #这里拿到request传过来的参数,我们主要是判断是否有ordering的key在里面嘛,有的话直接使用ordering排序,没有的话就给个None,接下来就是使用默认排序
        ordering = self.request.query_params.get('ordering', None)  
        if ordering:  
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-create_datetime')
        return queryset



