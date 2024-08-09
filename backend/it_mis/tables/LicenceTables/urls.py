from rest_framework.routers import SimpleRouter
router = SimpleRouter()



from .views import LicenceViewSet, LicenceViewSetStatus
router.register("api/LicenceViewSet", LicenceViewSet)


from django.urls import path

urlpatterns = [

    path('api/LicenceViewSet/status/<int:pk>/', LicenceViewSetStatus.as_view({'get': 'list'})),
]
urlpatterns += router.urls

