from rest_framework.routers import SimpleRouter
router = SimpleRouter()

from rest_framework.routers import SimpleRouter
router = SimpleRouter()


"""注释编号:django-vue-admin__urls533717:代码开始行"""
""" 功能说明:"""

from PublicResource.tables.OrganizationTables.views import AreaModelViewSet, CompanyModelViewSet, DepartmentModelViewSet, OrganizationModelViewSet


# 这里进行注册路径，并把视图关联上
router.register("api/it_area", AreaModelViewSet)
router.register("api/company", CompanyModelViewSet)
router.register("api/department", DepartmentModelViewSet)
router.register("api/organization", OrganizationModelViewSet)
"""注释编号:django-vue-admin__urls533717:代码结束行"""


# from django.urls import path
urlpatterns = [

]
urlpatterns += router.urls