from rest_framework.routers import SimpleRouter
router = SimpleRouter()



from .views import SuppliersViewSet, SuppliersTypeViewSet
router.register("api/SuppliersViewSet", SuppliersViewSet)
router.register("api/SuppliersTypeViewSet", SuppliersTypeViewSet)




# from django.urls import path, include

urlpatterns = [


]
urlpatterns += router.urls

