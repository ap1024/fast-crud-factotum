from dvadmin.utils.viewset import CustomModelViewSet


from .models import Licence
from .serializers import LicenceSerializer, LicenceCreateUpdateSerializer

class LicenceViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """


    
    queryset = Licence.objects.all()
    serializer_class = LicenceSerializer
    create_serializer_class = LicenceCreateUpdateSerializer
    update_serializer_class = LicenceCreateUpdateSerializer



class LicenceViewSetStatus(CustomModelViewSet):

    """
    list:查询时只返加状态为未使用的对象及加上自己当前的对象

    """
    queryset = Licence.objects.all()


    def get_queryset(self, **kwargs):
        # 拿到前端传回后端的PK值，即是ID
        if self.kwargs['pk']:
            pk = self.kwargs['pk']
            # 将当前ID的class查出来
            additional_object = Licence.objects.filter(id=pk)

            #注释编号: django-vue3-admin-views490616:将所有未使用状态的对象查出来，#这里use_status的值1代表"在用"，2代表"未用"
            filtered_queryset = Licence.objects.filter(use_status=2)

            # 拼接两个对象内容，然后返回给前端
            self.queryset = filtered_queryset.union(additional_object)

        return super().get_queryset()

    serializer_class = LicenceSerializer