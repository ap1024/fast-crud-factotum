from django.db import models
from dvadmin.utils.models import CoreModel

from PublicResource.tables.OrganizationTables.models import AreaModel
from it_mis.tables.SuppliersTables.models import Suppliers

# from it_mis.models import SoftType 不通这样写，会导致循环导入


class Licence(CoreModel):
	resource_area = models.ForeignKey(to=AreaModel, verbose_name="区域", null=True, default=None, on_delete=models.PROTECT)
	title = models.CharField(verbose_name="许可证名称", max_length=64, blank=False, null=True)
	# 这里外键写成'it_mis.SoftType'是为了解决循环导入的问题
	licence_type = models.ForeignKey('it_mis.SoftType', verbose_name="类型",blank=True, null=True, on_delete=models.PROTECT)
	licence_num = models.CharField(verbose_name="序列号", max_length=64, unique=True)
	supplier = models.ForeignKey(to=Suppliers, verbose_name="供应商", blank=False, null=True, on_delete=models.PROTECT)
	version = models.CharField(verbose_name="版本号", max_length=64, blank=True, null=True)
	start_date = models.DateField(verbose_name="购买日期", blank=True, null=True)
	end_date = models.DateField(verbose_name="到期日期", blank=True, null=True)
	price = models.CharField(verbose_name="费用", max_length=64, blank=True, null=True)
	
	#use_status在全局字典当中1表示在用，2表示未用,默认使用2表示未使用状态,该字典由CharField修改为IntegerField，这样前端配置dict-select时，才不会有问题
	use_status = models.IntegerField(verbose_name="使用状态", blank=False, default="2", help_text="此状态不可手动修改")

	used_by = models.ForeignKey("ItResource", verbose_name="被使用者", blank=True, null=True, \
								 default=None , help_text="被谁引用或使用，系统自动生成不用填过", on_delete=models.PROTECT)

	class Meta:
		verbose_name = "许可证"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)