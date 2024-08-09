from rest_framework.routers import SimpleRouter
router = SimpleRouter()




from django.urls import path, include

urlpatterns = [

        path('',include('PublicResource.tables.OrganizationTables.urls')),
        path('',include('PublicResource.tables.globalDictTables.urls')),

]
urlpatterns += router.urls

