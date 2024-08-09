
import django_filters
from .models import Suppliers


class SuppliersFilter(django_filters.rest_framework.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    name = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    fixed_phone = django_filters.CharFilter(field_name='fixed_phone', lookup_expr='icontains')
    mobile_phone = django_filters.CharFilter(field_name='mobile_phone', lookup_expr='icontains')

    class Meta:
        model = Suppliers
        fields = "__all__"  #这里配置所有字段可查