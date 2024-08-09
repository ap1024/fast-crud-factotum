import django_filters
from django.db.models import Q

from .models import CrudDemoModel



class goodsFilter(django_filters.rest_framework.FilterSet):
 
    #注释编号: django-vue3-admin_modelFilter034014:这里要配置多对多的查询及对应的方法，注意一定要传入queryset参数
    goodstypes = django_filters.ModelMultipleChoiceFilter(method='Mul_filter_custom', queryset = CrudDemoModel.objects.all())
    goodsport = django_filters.ModelMultipleChoiceFilter(method='Mul_filter_custom', queryset = CrudDemoModel.objects.all())

    goods = django_filters.CharFilter(field_name='goods', lookup_expr='icontains')


    
    #注释编号: django-vue3-admin_modelFilter543116:自定义多对多字段的过滤方法
    def Mul_filter_custom(self, queryset, name, value):

        data = dict(self.data)   #这里也可以拿self.request.query_params

        nameValueList = []
        for k, v in data.items():
            if name in k and len(v) > 0:
                v[0] = int(v[0])  # 将字符串如'1'转为数字1
                nameValueList.append(v[0])
        #来到这里拿到goodstypes对应的值列表[3, 2, 1]
       
        if nameValueList: #这里一定要判断是否
           queryset = queryset.filter(**{name + '__in': nameValueList})


        return  queryset


    class Meta:
        model = CrudDemoModel
        exclude = ('subTable',)  
        #注释编号: django-vue3-admin_modelFilter373814:这里不要配置fields = "__all__" ，因为字表字段查询不了，会引发错误，所以直接排除掉
