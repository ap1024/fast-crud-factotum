from rest_framework.routers import SimpleRouter
router = SimpleRouter()



from .views import ItNetTypeViewSet, NetSpeedViewSet, ItNetInfoViewSet, ItNetInfoViewSetStatus, DevicePortModelViewSet, ItNetInfoSubModelViewSet
router.register("api/ItNetTypeViewSet", ItNetTypeViewSet)
router.register("api/NetSpeedViewSet", NetSpeedViewSet)
router.register("api/ItNetInfoViewSet", ItNetInfoViewSet)
router.register("api/DevicePortModelViewSet", DevicePortModelViewSet)
router.register("api/ItNetInfoSubModelViewSet", ItNetInfoSubModelViewSet)


from .views import ItNetInfoSubModelStatuViewSet
from django.urls import path
urlpatterns = [

       # 单独做一条相应状态过滤的路由，给前端页面单独请求,这里是匹配到get请求，把做成字典值为list传到后端处理
    path('api/ItNetInfoViewSetStatus/status/<int:pk>/', ItNetInfoViewSetStatus.as_view({'get': 'list'})),

    #注释编号: django-vue3-admin_urls265416:对子表一对一字段进行特殊请求处理
    path('api/ItNetInfoSubModelStatuViewSet/status/<int:pk>/', ItNetInfoSubModelStatuViewSet.as_view({'get': 'list'})),

]
urlpatterns += router.urls

