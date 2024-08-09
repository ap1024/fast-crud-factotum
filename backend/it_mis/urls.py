from rest_framework.routers import SimpleRouter
router = SimpleRouter()



from django.urls import path, include
urlpatterns = [

    path('',include('it_mis.tables.ItResourceTables.urls')),
    path('',include('it_mis.tables.SuppliersTables.urls')),
    path('',include('it_mis.tables.LicenceTables.urls')),
    path('',include('it_mis.tables.ItNetInfoTables.urls')),
    path('',include('it_mis.tables.LineTagTables.urls')),
    path('',include('it_mis.tables.TelephoneTables.urls')),  #注释编号: django-vue3-admin-urls193916:导入电话表TelephoneTables的urls
]
urlpatterns += router.urls