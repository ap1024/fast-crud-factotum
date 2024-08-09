from dvadmin.utils.viewset import CustomModelViewSet
from dvadmin.utils.json_response import SuccessResponse, DetailResponse
from rest_framework.decorators import action



from .models import TelephoneTypeModel
from .serializers import TelephoneTypeModelSerializer, TelephoneTypeModelCreateUpdateSerializer

class TelephoneTypeModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = TelephoneTypeModel.objects.all()
    serializer_class = TelephoneTypeModelSerializer
    create_serializer_class = TelephoneTypeModelCreateUpdateSerializer
    update_serializer_class = TelephoneTypeModelCreateUpdateSerializer




from .models import TelephoneModel
from .serializers import TelephoneModelSerializer, TelephoneModelCreateUpdateSerializer

class TelephoneModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = TelephoneModel.objects.all()
    serializer_class = TelephoneModelSerializer
    create_serializer_class = TelephoneModelCreateUpdateSerializer
    update_serializer_class = TelephoneModelCreateUpdateSerializer



from .models import TelAccessTypeModel
from .serializers import TelAccessTypeModelSerializer, TelAccessTypeModelCreateUpdateSerializer

class TelAccessTypeModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = TelAccessTypeModel.objects.all()
    serializer_class = TelAccessTypeModelSerializer
    create_serializer_class = TelAccessTypeModelCreateUpdateSerializer
    update_serializer_class = TelAccessTypeModelCreateUpdateSerializer



from .models import lineAccessModel
from .serializers import lineAccessModelSerializer, lineAccessModelCreateUpdateSerializer

class lineAccessModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = lineAccessModel.objects.all()
    serializer_class = lineAccessModelSerializer
    create_serializer_class = lineAccessModelCreateUpdateSerializer
    update_serializer_class = lineAccessModelCreateUpdateSerializer



from .models import SubTelephoneModel
from .serializers import SubTelephoneModelSerializer, SubTelephoneModelCreateUpdateSerializer

class SubTelephoneModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """

    
    queryset = SubTelephoneModel.objects.all()
    serializer_class = SubTelephoneModelSerializer
    create_serializer_class = SubTelephoneModelCreateUpdateSerializer
    update_serializer_class = SubTelephoneModelCreateUpdateSerializer


    def get_queryset(self):  
        queryset = super().get_queryset() 
        ordering = self.request.query_params.get('ordering', None)  
        if ordering:  
            queryset = queryset.order_by(ordering)
        else:
            queryset = queryset.order_by('sortIndex')
        return queryset