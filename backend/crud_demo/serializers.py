from crud_demo.models import CrudDemoModel
from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers

class CrudDemoModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

#这里是进行了序列化模型及所有的字段
    class Meta:
        model = CrudDemoModel
        fields = "__all__"


# 注释编号:django-vue3-admin_serializers490917
# 功能说明:这里就是配置两个多对多字段的联合唯一校验处理

from .models import GoodstypesCrud, GoodsportsCrud
import pandas as pd
#这里是创建/更新时的列化器#自定义联合唯一的过滤器
# def unique_together_fileds(self, validated_data):

#     #这里相当于有id的话就把值拿出来，没有的话就直接给个None
#     cruId = self.request.data.get('id', None)

#     goodstypes_data = validated_data['goodstypes']
#     goodsport_data = validated_data['goodsport']
#     if validated_data['goodstypes']:
       
#         #注释编号: django-vue3-admin_serializers110110:这goodstypes_data_list是存储子表单里面的数据条目数对应的类型ID，比如子表有7条数据，那这里就会拿到7个ID组到list里面
#         #子表里面有多少条数据就会有多少条数据在list里面
#         goodstypes_data_list = []  
#         for item in goodstypes_data:
#             goodstypes_data_list.append(item.id)
#         #这里与上面的goodstypes_data_list是一一对应的，子表里面有多少条数据就会有多少条数据在list里面
#         goodsport_data_list = []  
#         for item in goodsport_data:
#             goodsport_data_list.append(item.id)

#         #index是下标，value是里面的值，对子表中第一个多对多字段对应的数据条目进行循环出来
#         for index, value in enumerate(goodstypes_data_list): 

#             #这里拿到当前这一条数据对应在多对多字段的中间数据模型里面一共有多少条数据，都查出来，结果比如为A
#             cru_obj_queryset= GoodstypesCrud.objects.filter(goodstype=value)
#             # 这里对结果A的查询集进行循环每到里面的每个对像
#             for cru_obj in cru_obj_queryset:
#                 #拿到当前循环到的对象的对应cruddemomodel_id的值，注意这里肯定不是指前端提交过来的对象ID
#                 cru_obj_id = cru_obj.cruddemomodel_id
#                 #查询到当前cru_obj_id对应的所有对象查询集
#                 goodsport_obj_queryset = GoodsportsCrud.objects.filter(cruddemomodel=cru_obj_id)
#                 #把对象查询集的值都转为pandas对应的DataFrame格式
#                 df = pd.DataFrame(goodsport_obj_queryset.values())

#                 #再把df转为list,这时flist 能可结果是[1, 2, 3, 5, 6]
#                 dflist = df['goodstypeportmodel_id'].tolist() 

#                 #来到这里就直接判断子表中第二个多对多字段是否在dflist便可，如果存在就证明第一个多对多对象及第二个多对多对象的组合是有重叠存在的。
#                 if goodsport_data_list[index] in dflist:

#                     #如果查到重复的对象id与提交过来的对象ID不同，才是真正的重复，这里要过滤掉自己本身的数据
#                     if cru_obj_id != cruId:
#                         #这里应该返回错误的提示，比如是什么值与什么值对应出错
#                         detail = {'statu':False, 'msg': f"序号{index+1}的数据搭配已存在，请重新检查数据的可行性。"  }
#                         return detail
                    
                 
#     #这里如果完成没有错误必须要返回正常的信息回去给调用才行            
#     return {'statu':True, 'msg': None  }
                    
# 注释编号:django-vue3-admin_serializers490917

        


class CrudDemoModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """


    class Meta:
        model = CrudDemoModel
        fields = '__all__'

 

 
 # 注释编号:django-vue3-admin_serializers391017
 # 功能说明:这里专门引入了两个多对多字段的联合唯一校验函数，这里也是属于序列化器校验的一种处理方法
    # def validate(self, validated_data):
    #     if self.request.data:
    #         ret = unique_together_fileds(self, validated_data)
    #         if ret['statu'] == False:
    #             raise serializers.ValidationError(detail=ret['msg'])
    #     return validated_data
    
# 注释编号:django-vue3-admin_serializers391017
    




from .models import goodstype

class goodsTypeSerializer(CustomModelSerializer):
    """
    序列化器
    """

#这里是进行了序列化模型及所有的字段
    class Meta:
        model = goodstype
        fields = "__all__"

#这里是创建/更新时的列化器
class goodsTypeCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """


    class Meta:
        model = goodstype
        fields = '__all__'




from .models import goodstypeportModel

class goodstypeportModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

#这里是进行了序列化模型及所有的字段
    class Meta:
        model = goodstypeportModel
        fields = "__all__"

#这里是创建/更新时的列化器
class goodstypeportModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """


    class Meta:
        model = goodstypeportModel
        fields = '__all__'