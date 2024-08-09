from rest_framework.routers import SimpleRouter
router = SimpleRouter()


""" 注释编号:django-vue3-admin__urls59525915:代码开始行"""
""" 功能说明:"""
from it_mis.tables.ItResourceTables.views import DeviceModelViewSet, DeviceBrandViewSet, DeviceTypeViewSet, MemoryViewSet, DiskViewSet, SoftTypeViewSet, CpuViewSet, ItResourceViewSet

router.register("api/DeviceModelViewSet", DeviceModelViewSet)
router.register("api/DeviceBrandViewSet", DeviceBrandViewSet)
router.register("api/DeviceTypeViewSet", DeviceTypeViewSet)
router.register("api/MemoryViewSet", MemoryViewSet)
router.register("api/DiskViewSet", DiskViewSet)
router.register("api/SoftTypeViewSet", SoftTypeViewSet)
router.register("api/CpuViewSet", CpuViewSet)
router.register("api/ItResourceViewSet", ItResourceViewSet)



""" 注释编号:django-vue3-admin__urls525915:代码结束行"""



from django.urls import path

from it_mis.tables.ItResourceTables.views import ItResourceNumViewSet

urlpatterns = [

    # 这条路由主要是针对请求返回最大的资产编码对象的
    path('api/LicenceViewSet/it_device_resource_num/', ItResourceNumViewSet.as_view({'get': 'list'})),
]
urlpatterns += router.urls