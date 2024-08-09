
from rest_framework.routers import SimpleRouter
from django.urls import path
from .views import read_file,save_file,ProjectModelViewSet,PlaybookModelViewSet,PlaybookExecutionModelViewSet,CommandExecutionModelViewSet,InventoryhostModelViewSet,AdhocModelViewSet,ModuleModelViewSet

router = SimpleRouter()
# 这里进行注册路径，并把视图关联上，这里的api地址以视图名称为后缀，这样方便记忆
router.register("api/ProjectModelViewSet", ProjectModelViewSet)
router.register("api/PlaybookModelViewSet", PlaybookModelViewSet)
router.register("api/PlaybookExecutionModelViewSet", PlaybookExecutionModelViewSet)
router.register("api/CommandExecutionModelViewSet", CommandExecutionModelViewSet)
router.register("api/InventoryhostModelViewSet", InventoryhostModelViewSet)
router.register("api/AdhocModelViewSet", AdhocModelViewSet)
router.register("api/ModuleModelViewSet", ModuleModelViewSet)






urlpatterns = [
    path('api/PlaybookModelViewSet/read_file/', read_file),
    path('api/PlaybookModelViewSet/save_file/', save_file),
]
urlpatterns += router.urls