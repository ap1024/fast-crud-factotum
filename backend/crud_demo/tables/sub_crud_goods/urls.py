from rest_framework.routers import SimpleRouter

from .views import goodsModel1ViewSet, goodsToOtherModel1ViewSet, goodsportModel1ViewSet, goodstypeModel1ViewSet


router = SimpleRouter()
# 这里进行注册路径，并把视图关联上
router.register("api/goodsModel1ViewSet", goodsModel1ViewSet)
router.register("api/goodsportModel1ViewSet", goodsportModel1ViewSet)
router.register("api/goodsToOtherModel1ViewSet", goodsToOtherModel1ViewSet)
router.register("api/goodstypeModel1ViewSet", goodstypeModel1ViewSet)




urlpatterns = [
 
]
urlpatterns += router.urls