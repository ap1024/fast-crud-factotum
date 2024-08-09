
import django_filters
from django.db.models import Q


from it_mis.tables.ItNetInfoTables.models import ItNetInfo


class ItNetInfoFilter(django_filters.rest_framework.FilterSet):
 
    title = django_filters.CharFilter(method='filter_custom')


    
    # 在这个自定义方法中构建您的查询条件
    def filter_custom(self, queryset, name, value):
        q1 = Q(title__icontains=value)
        q2 = Q(user__icontains=value)
        q3 = Q(ipv4__icontains=value)

         # 使用 | 运算符将它们组合为一个 "或" 查询条件
        combined_q = q1 | q2 | q3
        
        return queryset.filter(combined_q)


    class Meta:
        model = ItNetInfo
        fields = "__all__"  #这里配置所有字段可查
