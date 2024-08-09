
from dvadmin.utils.serializers import CustomModelSerializer
from rest_framework import serializers



""" 注释编号:django-vue3-admin__serializers134815:码开始行 """
""" 功能说明:IT资产与应用相关表的序列化"""
from it_mis.tables.ItResourceTables.models import DeviceModel, DeviceBrand, DeviceType, Memory, Disk, SoftType, Cpu, ItResource

from it_mis.tables.ItResourceTables.mysql_view_models import MysqlViewItResource

class DeviceModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = DeviceModel
        fields = "__all__"

class DeviceModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = DeviceModel
        fields = '__all__'

class DeviceBrandSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = DeviceBrand
        fields = "__all__"

class DeviceBrandCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = DeviceBrand
        fields = '__all__'

class DeviceTypeSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = DeviceType
        fields = "__all__"

class DeviceTypeCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = DeviceType
        fields = '__all__'


class MemorySerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = Memory
        fields = "__all__"

class MemoryCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = Memory
        fields = '__all__'

class DiskSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = Disk
        fields = "__all__"

class DiskCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = Disk
        fields = '__all__'

class SoftTypeSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = SoftType
        fields = "__all__"

class SoftTypeCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = SoftType
        fields = '__all__'

class CpuSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = Cpu
        fields = "__all__"

class CpuCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = Cpu
        fields = '__all__'

class ItResourceSerializer(CustomModelSerializer):
    """
    序列化器
    """
    # it_use = serializers.PrimaryKeyRelatedField(source='it_use.use',queryset = ItResource.objects.all()) # 建议在这里配置序列化字段，会导致外部编辑页面更新出错

    class Meta:
        model = ItResource
        fields = "__all__"

class ItResourceNumSerializer(CustomModelSerializer):
    """
    这里的序列化是匹配路由api/LicenceViewSet/it_device_resource_num/
    主要是实现请求的字段it_device_resource_num而配置的
    """

    class Meta:
        model = ItResource
        fields = '__all__'


class ItResourceUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """




    class Meta:
        model = ItResource
        fields = '__all__'

# 注释编号:django-vue3-admin_serializers361316
# 功能说明:更新对象时对tag_num字段进行校验，可为null但是必须有值的情况下是唯一的
#参考链接http://drf.jiuyou.info/#/drf/serializers?id=%e5%ad%97%e6%ae%b5%e7%ba%a7%e9%aa%8c%e8%af%81

    def validate_tag_num(self, value):  
        # alidate_your_field(self, value)是一个验证方法，your_field是你想要验证的字段的名字，value是该字段的值
        # 拿到当前ID
        curid = self.request.data.get("id")
        #拿到当前提交过来的tag_num
        cur_tag_num = self.request.data.get("tag_num")
        #查数据库原来对应ID的tag_num
        oldNum = ItResource.objects.get(id=curid).tag_num
        if cur_tag_num != oldNum and cur_tag_num:
            existing_records = ItResource.objects.filter(tag_num=cur_tag_num)
            if existing_records.exists():
                raise serializers.ValidationError("该值已存在，请选择其他值。")
        return value
# 注释编号:django-vue3-admin_serializers361316




class ItResourceCreateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = ItResource
        fields = '__all__'

# 注释编号:django-vue3-admin_serializers201216
# 功能说明:创建对象时对tag_num字段进行校验，可为null但是必须有值的情况下是唯一的


    def validate_tag_num(self, value):  
  
        #  alidate_your_field(self, value)是一个验证方法，your_field是你想要验证的字段的名字，value是该字段的值
        
        if value:
		# 检查数据库中是否已存在具有相同值的记录
            existing_records = ItResource.objects.filter(tag_num=value)
            # 如果存在其他记录具有相同值，则引发ValidationError
            if existing_records.exists():
                raise serializers.ValidationError("该值已存在，请选择其他值。")

        return value
# 注释编号:django-vue3-admin_serializers201216






"""注释编号:workspace.json__serializers565316:代码开始行"""
"""功能说明:针对外健的导出，最好是针对性的建一个序列化器才行"""
"""这里要写一下source='company.title'是说当前company字段对应的模型当名称字段title(这个要看对应表的命名的，而不是随意思想出来的)，注意company是字段名称而不是模型名称"""

class ExportItResourceSerializer(CustomModelSerializer):
    """
    导出
    """

    #注释编号: django-vue3-admin_serializers304114:这里写外键对应的值，如下字段必须是视图中配置过并包含在export_foreignKey__value_column字段内的才行，要不查询起来起好慢
    #export_foreignKey__value_column = ('company', 'area', 'department', 'it_use', 'device_type', 'device_brand','device_cpu', 'device_memory', 'device_disk', 'soft_type')
    # company = serializers.CharField(source='company.title', default=None, read_only=True, help_text='部门') 
    # area = serializers.CharField(source='area.title', default=None, read_only=True, help_text='区域') 
    # department = serializers.CharField(source='department.title', default=None, read_only=True, help_text='部门') 
    # it_use = serializers.CharField(source='it_use.use', default=None, read_only=True, help_text='信息归属') 
    # device_type = serializers.CharField(source='device_type.title', default=None, read_only=True, help_text='硬件设备类型') 
    # device_brand = serializers.CharField(source='device_brand.title', default=None, read_only=True, help_text='硬件品牌') 
    # device_model = serializers.CharField(source='device_model.title', default=None, read_only=True, help_text='硬件设备型号') 
    # device_cpu = serializers.CharField(source='device_cpu.title', default=None, read_only=True, help_text='硬件cpu') 
    # device_memory = serializers.CharField(source='device_memory.title', default=None, read_only=True, help_text='硬件内存') 
    # device_disk = serializers.CharField(source='device_disk.title', default=None, read_only=True, help_text='硬件硬盘') 
    # soft_type = serializers.CharField(source='soft_type.title', default=None, read_only=True, help_text='软件版本与类型') 

 
    class Meta:
        model = MysqlViewItResource
        fields = "__all__"



""" 注释编号:workspace.json__serializers565316:代码结束行"""




class MysqlViewItResourceSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = MysqlViewItResource
        fields = "__all__"






""" 注释编号:django-vue3-admin__serializers134815:代码结束行"""