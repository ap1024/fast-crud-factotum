from rest_framework.routers import SimpleRouter
router = SimpleRouter()

from rest_framework.routers import SimpleRouter
router = SimpleRouter()




from .views import globalDictModelViewSet

# # 这里进行注册路径，并把视图关联上
router.register("api/globalDictModelViewSet", globalDictModelViewSet)




# from django.urls import path
urlpatterns = [

]
urlpatterns += router.urls