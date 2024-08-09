from dvadmin.utils.viewset import CustomModelViewSet
from dvadmin.utils.json_response import SuccessResponse, DetailResponse
from rest_framework.decorators import action

from django.db.models import Q



from .models import LineTagtypeModel
from .serializers import LineTagtypeModelSerializer, LineTagtypeModelCreateUpdateSerializer

class LineTagtypeModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = LineTagtypeModel.objects.all()
    serializer_class = LineTagtypeModelSerializer
    create_serializer_class = LineTagtypeModelCreateUpdateSerializer
    update_serializer_class = LineTagtypeModelCreateUpdateSerializer




from .models import LineTagModel
from .serializers import LineTagModelSerializer, LineTagModelCreateUpdateSerializer

class LineTagModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = LineTagModel.objects.all()
    serializer_class = LineTagModelSerializer
    create_serializer_class = LineTagModelCreateUpdateSerializer
    update_serializer_class = LineTagModelCreateUpdateSerializer




from .models import lineAccessTypeModel
from .serializers import lineAccessTypeModelSerializer, lineAccessTypeModelCreateUpdateSerializer

class lineAccessTypeModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = lineAccessTypeModel.objects.all()
    serializer_class = lineAccessTypeModelSerializer
    create_serializer_class = lineAccessTypeModelCreateUpdateSerializer
    update_serializer_class = lineAccessTypeModelCreateUpdateSerializer


    def get_queryset(self):  
        queryset = super().get_queryset() 

        # 注释编号:django-vue3-admin-views123317
        # 功能说明:如果有传过来filterUrlAndLabel的值，就说明要对url及label字段进行过滤，只返回url及label为非空的对象
        filterUrlAndLabel = self.request.query_params.get('filterUrlAndLabel', None)  
        if filterUrlAndLabel:  
            #这里前面要导入from django.db.models import Q
            queryset = queryset.filter( Q(url__isnull=False) & Q(label__isnull=False))
        # 注释编号:django-vue3-admin-views123317
        return queryset




from .models import SubLineTagModel
from .serializers import SubLineTagModelSerializer, SubLineTagModelCreateUpdateSerializer

class SubLineTagModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = SubLineTagModel.objects.all()
    serializer_class = SubLineTagModelSerializer
    create_serializer_class = SubLineTagModelCreateUpdateSerializer
    update_serializer_class = SubLineTagModelCreateUpdateSerializer


    # 注释编号:django-vue3-admin-views255815
    # 功能说明:这里做查询的以sortIndex进行正向排序
   
    def get_queryset(self):  
        queryset = super().get_queryset() 
        ordering = self.request.query_params.get('ordering', None)  
        if ordering:  
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('sortIndex')
        return queryset
    # 注释编号:django-vue3-admin-views255815





from it_mis.tables.ItResourceTables.models import ItResource

from .serializers import ItResourceViewSetSubSerializer, ItResourceViewSetSubUpdateSerializer

class ItResourceViewSetSub(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """



    queryset = ItResource.objects.all()
    serializer_class = ItResourceViewSetSubSerializer
    create_serializer_class = ItResourceViewSetSubUpdateSerializer
    update_serializer_class = ItResourceViewSetSubUpdateSerializer

    # 注释编号:django-vue3-admin-views314415
    # 功能说明:在这个线路标签当中突然引用了ItResource之IT资源表，就是为了单独做这个过滤is_device_resource=True
    def get_queryset(self):
        self.queryset = ItResource.objects.filter(is_device_resource=True)
    # 注释编号:django-vue3-admin-views314415
        

        return super().get_queryset()
    



from .models import LineAreaModel
from .serializers import LineAreaModelSerializer, LineAreaModelCreateUpdateSerializer

class LineAreaModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = LineAreaModel.objects.all()
    serializer_class = LineAreaModelSerializer
    create_serializer_class = LineAreaModelCreateUpdateSerializer
    update_serializer_class = LineAreaModelCreateUpdateSerializer


    def get_queryset(self):  
        queryset = super().get_queryset() 
        #这里拿到request传过来的参数,我们主要是判断是否有ordering的key在里面嘛,有的话直接使用ordering排序,没有的话就给个None,接下来就是使用默认排序
        ordering = self.request.query_params.get('ordering', None)  
        if ordering:  
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('-create_datetime')
        return queryset
    


from .models import NetworkFrameModel
from .serializers import NetworkFrameModelSerializer, NetworkFrameModelCreateUpdateSerializer

class NetworkFrameModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = NetworkFrameModel.objects.all()
    serializer_class = NetworkFrameModelSerializer
    create_serializer_class = NetworkFrameModelCreateUpdateSerializer
    update_serializer_class = NetworkFrameModelCreateUpdateSerializer