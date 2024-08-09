# Create your views here.

from dvadmin.utils.viewset import CustomModelViewSet
from .custom_class import use_status_and_used_by_action
from django.db.models import F 

from dvadmin.utils.json_response import SuccessResponse, DetailResponse
from rest_framework.decorators import action
import pandas as pd

""" 注释编号:django-vue3-admin__views580016:代码开始行"""
""" 功能说明:IT资产与应用的视图"""
from it_mis.tables.ItResourceTables.models import DeviceModel
from it_mis.tables.ItResourceTables.serializers import DeviceModelSerializer, DeviceModelCreateUpdateSerializer

class DeviceModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = DeviceModel.objects.all()
    serializer_class = DeviceModelSerializer
    create_serializer_class = DeviceModelCreateUpdateSerializer
    update_serializer_class = DeviceModelCreateUpdateSerializer


from it_mis.tables.ItResourceTables.models import DeviceBrand
from it_mis.tables.ItResourceTables.serializers import DeviceBrandSerializer, DeviceBrandCreateUpdateSerializer

class DeviceBrandViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = DeviceBrand.objects.all()
    serializer_class = DeviceBrandSerializer
    create_serializer_class = DeviceBrandCreateUpdateSerializer
    update_serializer_class = DeviceBrandCreateUpdateSerializer


from it_mis.tables.ItResourceTables.models import DeviceType
from it_mis.tables.ItResourceTables.serializers import DeviceTypeSerializer, DeviceTypeCreateUpdateSerializer

class DeviceTypeViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = DeviceType.objects.all()
    serializer_class = DeviceTypeSerializer
    create_serializer_class = DeviceTypeCreateUpdateSerializer
    update_serializer_class = DeviceTypeCreateUpdateSerializer

from it_mis.tables.ItResourceTables.models import Memory
from it_mis.tables.ItResourceTables.serializers import MemorySerializer, MemoryCreateUpdateSerializer

class MemoryViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = Memory.objects.all()
    serializer_class = MemorySerializer
    create_serializer_class = MemoryCreateUpdateSerializer
    update_serializer_class = MemoryCreateUpdateSerializer


from it_mis.tables.ItResourceTables.models import Disk
from it_mis.tables.ItResourceTables.serializers import DiskSerializer, DiskCreateUpdateSerializer

class DiskViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = Disk.objects.all()
    serializer_class = DiskSerializer
    create_serializer_class = DiskCreateUpdateSerializer
    update_serializer_class = DiskCreateUpdateSerializer


from it_mis.tables.ItResourceTables.models import SoftType
from it_mis.tables.ItResourceTables.serializers import SoftTypeSerializer, SoftTypeCreateUpdateSerializer

class SoftTypeViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = SoftType.objects.all()
    serializer_class = SoftTypeSerializer
    create_serializer_class = SoftTypeCreateUpdateSerializer
    update_serializer_class = SoftTypeCreateUpdateSerializer

from it_mis.tables.ItResourceTables.models import Cpu
from it_mis.tables.ItResourceTables.serializers import CpuSerializer, CpuCreateUpdateSerializer

class CpuViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = Cpu.objects.all()
    serializer_class = CpuSerializer
    create_serializer_class = CpuCreateUpdateSerializer
    update_serializer_class = CpuCreateUpdateSerializer


from it_mis.tables.ItResourceTables.models import ItResource
from it_mis.tables.ItNetInfoTables.models import ItNetInfo
from it_mis.tables.ItResourceTables.mysql_view_models import MysqlViewItResource
from it_mis.tables.ItResourceTables.serializers import ItResourceSerializer, ItResourceUpdateSerializer,ItResourceCreateSerializer, MysqlViewItResourceSerializer, ExportItResourceSerializer

from dvadmin.utils.json_response import SuccessResponse
from it_mis.tables.ItResourceTables.modelFilter import ItResourceFilter

from it_mis.tables.LicenceTables.models import Licence

class ItResourceViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = ItResource.objects.all()
    serializer_class = ItResourceSerializer

    def get_queryset(self):
        if self.action == "list":
            """ 注释编号:workspace.json__views280817:这里是针对list即时get请求做了优化，主要是让他匹配之后走mysql相应的视图"""
            self.queryset = MysqlViewItResource.objects.all()
            self.serializer_class = MysqlViewItResourceSerializer
            self.filter_class = ItResourceFilter #注释编号: django-vue3-admin_views262617:这里在更新信息时，专门使用过滤器进行过滤进行模糊查询
        elif self.action == "export_data":    #这是匹配到导出的
            """注释编号:workspace.json__views465916:这个elif去匹配export_data针对导出来做的"""
            self.queryset = MysqlViewItResource.objects.all()
        elif self.action == "update":       #这是匹配到更新数据的
            """注释编号:workspace.json__views49244914:代码开始行"""
            """ 功能说明:这里是针对序列化一对一字段的功能进行判断及处理"""
            use_status_and_used_by_action.updata(Licence, ItResource, self, field_id = "soft_licence_id", field = "soft_licence") # 配置Licence中use_status及used_by的标记
            """ 注释编号:workspace.json__views244914:代码结束行"""
        elif self.action == "destroy": #这是匹配到删除时操作时
            use_status_and_used_by_action.destroy(Licence, ItResource, self, field_id = "soft_licence_id") #删除Licence中use_status及used_by的标记
            
        return super().get_queryset()

    """注释编号:workspace.json__views280017:代码开始行"""
    """功能说明:对于外键必须在字段后面添加_id,要不无法导出来数据"""
    # export_field_label = {
    #     "company_id": "公司",
    #     "area_id": "区域",
    #     "department_id": "部门",
    #     "it_use_id": "信息归属",
    #     "device_type_id": "硬件设备类型",
    #     "device_brand_id": "硬件品牌",
    #     "device_model_id": "硬件设备型号",
    #     "service_tag": "硬件服务编码",
    #     "express_service_code": "硬件快速服务代码",
    #     "mac_addr": "mac地址",
    #     "device_cpu_id": "硬件cpu",
    #     "device_memory_id": "硬件内存",
    #     "device_disk_id": "硬件硬盘",
    #     "is_device_resource": "是否为固定资产",
    #     "it_device_resource_num": "资产编码",
    #     "soft_type_id": "软件版本与类型",
    #     "tag_num": "标记码",
    # }
   

    """ 注释编号:workspace.json__views280017:代码结束行"""

    #注释编号: django-vue3-admin_views481816:这里单独把创建及更新对象给到不同的序列化器，主要是方便制作各自的验证器
    create_serializer_class = ItResourceCreateSerializer
    update_serializer_class = ItResourceUpdateSerializer
    
    filter_class = None #注释编号: django-vue3-adminviews563216:这里最好写上=None，因为更新及删除都必须定义为None才行

    
    # 注释编号:django-vue3-admin_views211216
    # 功能说明:被访问的model他要拿到外健的外键的值而进行重写懒加载请求，专门返回该字段外健的外键的值
    
    @action(methods=['post'], detail=False)
    def getbyIds(self, request, *args, **kwargs):
        try:
            idList = request.data['values'] #获取前端传过来
        except:
             return DetailResponse(data=queryset, msg="没有传values到后端, 即是id列表")

        cur_model = self.get_queryset().model  #查到当前的model

        queryset_id = cur_model.objects.filter(id__in=idList)  #过滤出来前端传过来的list列表里面的对象
        queryset = list(queryset_id.values())

        try:
            fieldList = request.data['fieldList']

            df = pd.DataFrame(queryset, columns=fieldList)  #转换为pandas DataFrame格式，并且只拿其中列表内规定的字段

            newField =  fieldList[1].replace('_id', '') #把拿到的列表如['id', 'it_use_id']中的第二个元素fieldList[1]=it_use_id拿出来进行去除__id后缀

            try:
                #这里是拿到当前cur_model对应的newKey的外健对象的所有值并转为这字典
                choices_dict = dict(getattr(cur_model, newField).field.get_choices())
                #然后把对应的外健的值给组装回去df内
                df[f'{fieldList[1]}'] =  df[f'{fieldList[1]}'].replace(choices_dict)
            except AttributeError:
                #即是出现AttributeError: 'NoneType' object has no attribute 'model'错误时,不用理会
                pass
            queryset = df.to_dict(orient='records')  #pandas DataFrame转换成包含字典的列表格式

        except:
            pass

        return DetailResponse(data=queryset, msg="获取成功")
    # 注释编号:django-vue3-admin_views211216
     


from it_mis.tables.ItResourceTables.serializers import ItResourceNumSerializer
class ItResourceNumViewSet(CustomModelViewSet):
    """
    list:查询返回IT资产编号的最大值前端,然后在前端再回+1的操作
    """

    queryset = ItResource.objects.all()
    serializer_class = ItResourceNumSerializer
    
    # 这里重写了list方法,让他只返回it_device_resource_num的数字+1
    def list(self, request, *args, **kwargs):
        # 获取单个对象
        instance = self.queryset.order_by('-it_device_resource_num').first()
        serializer = ItResourceNumSerializer(instance)
        # 拿到资产序列号
        num = serializer.data["it_device_resource_num"]
        # 对资产序列号自动加1操作
        newNum = num + 1
        return SuccessResponse(newNum)





""" 注释编号:django-vue3-admin__views580016:代码结束行"""