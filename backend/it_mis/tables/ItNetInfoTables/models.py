
from django.db import models
from dvadmin.utils.models import CoreModel

from PublicResource.tables.OrganizationTables.models import AreaModel, CompanyModel, DepartmentModel


class ItNetType(CoreModel):
	title = models.CharField(verbose_name="网络资源类型", unique=True, max_length=64, blank=False)


	class Meta:
		verbose_name = "网络资源类型"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)


class NetSpeed(CoreModel):
	title = models.CharField(verbose_name="网络速率", max_length=64, blank=False)
	other_info = models.CharField(verbose_name="其它信息", max_length=64, blank=False, help_text="如拨号、城域专线上下行对等及其它信息描述")

	class Meta:
		verbose_name = "网络速率"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)


class ItNetInfo(CoreModel):
	area = models.ForeignKey(to=AreaModel, verbose_name="区域", related_name="ItNetInfo_area", null=True, default=None, on_delete=models.PROTECT)
	company = models.ForeignKey(to=CompanyModel, verbose_name="公司", related_name="ItNetInfo_company", null=True, default=None, on_delete=models.PROTECT)
	department = models.ForeignKey(to=DepartmentModel, verbose_name="部门", related_name="ItNetInfo_department",null=True, default=None, on_delete=models.PROTECT)
	title = models.CharField(verbose_name="资源名称",  max_length=64, blank=False)
	suppliers = models.ForeignKey("Suppliers", verbose_name="供应商", blank=False, null=True, default=None, on_delete=models.PROTECT)
	type = models.ForeignKey("ItNetType", verbose_name="资源类型", blank=True, null=True, on_delete=models.PROTECT)
	netspeed = models.ForeignKey('NetSpeed', verbose_name="网络速率", blank=True, null=True, default=None, on_delete=models.PROTECT)
	code = models.CharField(verbose_name="编码/编号", max_length=64, blank=True, null=True)
	user = models.CharField(verbose_name="使用帐号", max_length=64, blank=True, null=True)
	password = models.CharField(verbose_name="使用密码", max_length=64, blank=True, null=True)
	ipv4 = models.CharField(verbose_name="ipv4地址", max_length=64, blank=True, null=True, help_text="这里由前端限制IP地址格式传至后端")
	submask = models.CharField(verbose_name="子网掩码", max_length=64, blank=True, null=True, help_text="这里由前端限制IP地址格式传至后端")
	gateway = models.CharField(verbose_name="网关", max_length=64, blank=True, null=True, help_text="这里由前端限制IP地址格式传至后端")
	DNS1 = models.CharField(verbose_name="主DNS", max_length=64, blank=True, null=True, help_text="这里由前端限制IP地址格式传至后端")
	DNS2 = models.CharField(verbose_name="备DNS", max_length=64, blank=True, null=True, help_text="这里由前端限制IP地址格式传至后端")
	# contract = models.ForeignKey("ItInfoContract", verbose_name="合同", blank=True, null=True)

	#use_status在全局字典当中1表示在用，2表示未用,默认使用2表示未使用状态,该字典由CharField修改为IntegerField，这样前端配置dict-select时，才不会有问题
	use_status = models.IntegerField(verbose_name="使用状态", blank=False, default="2", help_text="此状态不可手动修改")

	used_by = models.ForeignKey("ItResource", verbose_name="被使用者", blank=True, null=True, \
								 default=None , help_text="被谁引用或使用，系统自动生成不用填过", on_delete=models.PROTECT)
	
	used_by_port = models.ForeignKey('DevicePortModel', verbose_name="设备端口", blank=False, null=True, default=None, on_delete=models.PROTECT)
	other_description = models.CharField(verbose_name="其它信息", max_length=255, blank=True, null=True, help_text="这里的信息主要是由ItNetInfoSubModel子表description传过来的")


	class Meta:
		verbose_name = "网络资源"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)


class DevicePortModel(CoreModel):
	title = models.CharField(verbose_name="设备端口", unique=True, max_length=64, blank=False)

	class Meta:
		verbose_name = "设备端口"
		verbose_name_plural = verbose_name
		# ordering = ("title",)



# 注释编号:django-vue3-admin_models545115
# 功能说明:这里便是第三张,隐藏表,子表的设计了.

class ItNetInfoSubModel(CoreModel):
	#注释编号: django-vue3-admin_models315211:这里要配置成一对一的字段，因为一条光纤网络只能接入一个端口
	itnetinfo = models.OneToOneField('ItNetInfo', verbose_name="网络资源信息",  blank=True, null=True, default=None, on_delete=models.PROTECT)
	device_port = models.ForeignKey('DevicePortModel', verbose_name="设备端口", blank=True, null=True, default=None, on_delete=models.PROTECT)
	
	#这个字段前端不可手动修改，这里即就是parentId
	parentId = models.ForeignKey("ItResource", verbose_name="被使用者", blank=True, null=True, \
								 default=None , on_delete=models.PROTECT)
	#这个字段前端不可手动修改
	use_status = models.CharField(verbose_name="使用状态", max_length=64, blank=False, default="已用", help_text="此状态不可手动修改")

	class Meta:
		verbose_name = "网络资源子表"
		verbose_name_plural = verbose_name

# 注释编号:django-vue3-admin_models545115