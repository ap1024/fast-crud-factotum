from rest_framework.routers import SimpleRouter

from .views import CrudDemoModelViewSet, goodsTypeViewSet, goodstypeportModelViewSet

router = SimpleRouter()
# 这里进行注册路径，并把视图关联上
router.register("api/CrudDemoModelViewSet", CrudDemoModelViewSet)
router.register("api/goodstype", goodsTypeViewSet)
router.register("api/goodstypeportModel", goodstypeportModelViewSet)



from django.urls import path, include
urlpatterns = [

    path('',include('crud_demo.tables.sub_crud_goods.urls')),
 
]
urlpatterns += router.urls