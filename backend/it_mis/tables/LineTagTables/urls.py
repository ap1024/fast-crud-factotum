from rest_framework.routers import SimpleRouter
router = SimpleRouter()


from .views import LineTagtypeModelViewSet
router.register("api/LineTagtypeModelViewSet", LineTagtypeModelViewSet)

from .views import LineTagModelViewSet
router.register("api/LineTagModelViewSet", LineTagModelViewSet)

from .views import lineAccessTypeModelViewSet
router.register("api/lineAccessTypeModelViewSet", lineAccessTypeModelViewSet)

from .views import SubLineTagModelViewSet
router.register("api/SubLineTagModelViewSet", SubLineTagModelViewSet)


from .views import ItResourceViewSetSub
router.register("api/ItResourceViewSetSub", ItResourceViewSetSub)


from .views import LineAreaModelViewSet

router.register("api/LineAreaModelViewSet", LineAreaModelViewSet)


from .views import NetworkFrameModelViewSet

router.register("api/NetworkFrameModelViewSet", NetworkFrameModelViewSet)




urlpatterns = [


]
urlpatterns += router.urls