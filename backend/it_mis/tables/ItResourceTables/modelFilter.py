import django_filters
from django.db.models import Q


from it_mis.tables.ItResourceTables.mysql_view_models import MysqlViewItResource




# 注释编号:django-vue3-admin_modelFilter475817
# 功能说明:这里写一个FilterSet进行针对it_use传回来的数据进行Q或查询
class ItResourceFilter(django_filters.rest_framework.FilterSet):
 
    #这里是通过it_use字段传过来，我们进行了匹配Q查询，返回多个字段的匹配结果
    it_use = django_filters.CharFilter(method='filter_custom')


    #如下是对单独字段进行模糊查询的配置
    remote_addr = django_filters.CharFilter(field_name='remote_addr', lookup_expr='icontains')
    tag_num = django_filters.CharFilter(field_name='tag_num', lookup_expr='icontains')
    mac_addr = django_filters.CharFilter(field_name='mac_addr', lookup_expr='icontains')
    service_tag = django_filters.CharFilter(field_name='service_tag', lookup_expr='icontains')
    express_service_code = django_filters.CharFilter(field_name='express_service_code', lookup_expr='icontains')

    
    # 在这个自定义方法中构建您的查询条件
    def filter_custom(self, queryset, name, value):
        q1 = Q(it_use__use__icontains=value)
        q2 = Q(use_account__icontains=value)
        q3 = Q(it_device_resource_num__icontains=value)

         # 使用 | 运算符将它们组合为一个 "或" 查询条件
        combined_q = q1 | q2 | q3
        
        return queryset.filter(combined_q)


    class Meta:
        model = MysqlViewItResource
        fields = "__all__"  #这里配置所有字段可查
# 注释编号:django-vue3-admin_modelFilter475817