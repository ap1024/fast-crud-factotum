from django.db import models
from dvadmin.utils.models import CoreModel


from PublicResource.tables.OrganizationTables.models import AreaModel, CompanyModel, DepartmentModel
from PublicResource.tables.OrganizationTables.models import OrganizationModel

from it_mis.tables.SuppliersTables.models import Suppliers

from it_mis.tables.LicenceTables.models import Licence


# 注释编号:django-vue3-admin__models445717:代码开始行
# 功能说明:IT资产与应用表的设计


class DeviceModel(CoreModel):
	title = models.CharField(verbose_name="设备型号", unique=True, max_length=64, blank=False)
	
	def __str__(self):
		return self.title
	
	class Meta:
		verbose_name = "设备型号字典"
		verbose_name_plural = verbose_name

class DeviceBrand(CoreModel):
	title = models.CharField(verbose_name="设备品牌", unique=True, max_length=64, blank=False)
	
	def __str__(self):
		return self.title

	class Meta:
		verbose_name = "设备品牌字典"
		verbose_name_plural = verbose_name

class DeviceType(CoreModel):
	title = models.CharField(verbose_name="设备类型", unique=True, max_length=64, blank=False)
	
	def __str__(self):
		return self.title
	
	class Meta:
		verbose_name = "设备类型字典"
		verbose_name_plural = verbose_name

class Memory(CoreModel):
	title = models.CharField(verbose_name="内存大小", unique=True, max_length=64, blank=False)
	
	def __str__(self):
		return self.title
	
	class Meta:
		verbose_name = "内存字典"
		verbose_name_plural = verbose_name

class Disk(CoreModel):
	title = models.CharField(verbose_name="硬盘大小", unique=True, max_length=64, blank=False)
	
	def __str__(self):
		return self.title
	
	class Meta:
		verbose_name = "硬盘字典"
		verbose_name_plural = verbose_name

class SoftType(CoreModel):
	title = models.CharField(verbose_name="软件类型", unique=True, max_length=64, blank=False)
	
	def __str__(self):
		return self.title
	
	class Meta:
		verbose_name = "软件类型字典"
		verbose_name_plural = verbose_name


class Cpu(CoreModel):
	title = models.CharField(verbose_name="cpu型号", unique=True, max_length=64, blank=False)

	def __str__(self):
		return self.title

	class Meta:
		verbose_name = "cpu字典"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)



class ItResourceShareCommonInfo(models.Model):
	
	#注释编号: django-vue3-admin-models285310:公共字段定义在这里,方便当前的公共字段同步可以视图类复用

	it_use = models.ForeignKey(to=OrganizationModel, verbose_name="信息归属", on_delete=models.PROTECT)
	device_type = models.ForeignKey(to=DeviceType, verbose_name="硬件设备类型", blank=True, null=True, on_delete=models.PROTECT)
	device_brand = models.ForeignKey(to=DeviceBrand, verbose_name="硬件品牌", blank=True, null=True, on_delete=models.PROTECT)
	device_model = models.ForeignKey(to=DeviceModel, verbose_name="硬件设备型号", blank=True, null=True, on_delete=models.PROTECT)
	service_tag = models.CharField(verbose_name="硬件服务编码", max_length=64, blank=True, null=True)
	express_service_code = models.CharField(verbose_name="硬件快速服务代码", max_length=64, blank=True, null=True)
	mac_addr = models.CharField(verbose_name="mac地址", max_length=64, blank=True, null=True, )
	device_cpu = models.ForeignKey(to=Cpu, verbose_name="硬件cpu", blank=True, null=True, on_delete=models.PROTECT)
	device_memory = models.ForeignKey(to=Memory, verbose_name="硬件内存", blank=True, null=True, on_delete=models.PROTECT)
	device_disk = models.ForeignKey(to=Disk, verbose_name="硬件硬盘", blank=True, null=True, on_delete=models.PROTECT)
	is_resource = models.BooleanField(default=False, verbose_name="资产", help_text='''是否为固定资产''')
	is_device_resource = models.BooleanField(default=False, verbose_name="标签", help_text='''是否需要标签''')
	it_device_resource_num = models.PositiveIntegerField(verbose_name="资产编码", blank=True, null=True, unique=True, help_text="此处第一次录入始发值，后期建议使用自动生成")
	# 以下软件信息相关的字段
	soft_type = models.ForeignKey(to=SoftType, verbose_name="软件版本与类型", blank=True, null=True, help_text="版本与类型都要分清，方便归类分析", on_delete=models.PROTECT)
	soft_licence = models.OneToOneField('Licence', verbose_name="序列号", blank=True, null=True, help_text="被引用的序列号会标记为使用状态", on_delete=models.PROTECT)

	#注释编号: django-vue3-admin_models345109:这个tag_num字段要在视图中进行特殊处理，检验非空的字段必须值唯一（但是记得不能直接在字段中配置unique=True，这会引会更新数据时出错的问题）
	tag_num = models.CharField(verbose_name="标记码", max_length=64, blank=True, null=True, help_text="这里可录入电脑名称或电话号码等")

	
	ip_addr = models.CharField(verbose_name="ip地址", max_length=64, blank=True, null=True, help_text="这里由前端限制IP地址格式传至后端")
	
	use_account = models.CharField(verbose_name="使用帐号", max_length=64, blank=True, null=True,)
	use_password = models.CharField(verbose_name="帐号密码", max_length=64, blank=True, null=True,)
	remote_addr = models.CharField(verbose_name="远程地址", max_length=64, blank=True, null=True,)
	use_port = models.IntegerField(verbose_name="使用端口",  blank=True, null=True,)
	# use_to_tel = models.ForeignKey("DidNumInfo", verbose_name="关联电话号码", blank=True, null=True, default="")
	# use_to_other = models.ForeignKey("self", verbose_name="其它关联信息", blank=True, null=True, default="", help_text="关联自身表的其它信息，如邮箱、帐号等")
	
	purchase_start_data = models.DateField(verbose_name="采购日期", blank=True, null=True)
	warranty = models.CharField(verbose_name="保修时长", max_length=64, blank=True, null=True)



	class Meta:
		abstract = True  # 抽象基类，不会为它创建数据库表，但它可以被复用






class ItResource(CoreModel, ItResourceShareCommonInfo):

	#注释编号: django-vue3-admin-models035310:这里所有的字段都写ItResourceShareCommonInfo基类里面，目的是为了基类可以被复用

	def __str__(self):
		#这里要配置被引用访问时返回的相关字符，这里写成self.it_use.use是返回当前外键字段的外键，正常返回当前字段便可，如self.title
		return self.it_use.use

	class Meta:
		verbose_name = "资产与配置信息"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)



# 注释编号:django-vue3-admin__models445717:代码结束行