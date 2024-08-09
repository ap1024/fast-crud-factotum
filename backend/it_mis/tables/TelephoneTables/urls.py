from rest_framework.routers import SimpleRouter
router = SimpleRouter()


from .views import TelephoneTypeModelViewSet, TelephoneModelViewSet, TelAccessTypeModelViewSet, SubTelephoneModelViewSet, lineAccessModelViewSet
router.register("api/TelephoneTypeModelViewSet", TelephoneTypeModelViewSet)
router.register("api/TelephoneModelViewSet", TelephoneModelViewSet)
router.register("api/TelAccessTypeModelViewSet", TelAccessTypeModelViewSet)
router.register("api/SubTelephoneModelViewSet", SubTelephoneModelViewSet)
router.register("api/lineAccessModelViewSet", lineAccessModelViewSet)


from .mysql_view_models import MysqlViewSubTelephoneModelViewSet
router.register("api/MysqlViewSubTelephoneModelViewSet", MysqlViewSubTelephoneModelViewSet)


urlpatterns = [ 


]
urlpatterns += router.urls