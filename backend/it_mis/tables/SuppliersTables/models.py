
from django.db import models
from dvadmin.utils.models import CoreModel

from PublicResource.tables.OrganizationTables.models import AreaModel


class SuppliersType(CoreModel):
	title = models.CharField(verbose_name="供应商类型", max_length=64, blank=False)

	def __str__(self):
		return self.title
	
	class Meta:
		verbose_name = "供应商类型"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)


# class SuppliersBelongToType(CoreModel):
# 	title = models.CharField(verbose_name="供应商归属类型", max_length=64, blank=False)

# 	def __str__(self):
# 		return self.title
	
# 	class Meta:
# 		verbose_name = "供应商归属类型"
# 		verbose_name_plural = verbose_name
# 		ordering = ("-create_datetime",)

#这里引用了IT网络资源类型表进来复用
from it_mis.tables.ItNetInfoTables.models import ItNetType

class Suppliers(CoreModel):
	resource_area = models.ForeignKey(to=AreaModel, verbose_name="区域", null=True, default=None, on_delete=models.PROTECT)
	suppliers_type = models.ForeignKey(to=SuppliersType, verbose_name="供应商类型", null=True, default=None, on_delete=models.PROTECT)
	SuppliersBelongToType = models.ForeignKey(to=ItNetType, verbose_name="供应商归属类型", null=True, default=None, on_delete=models.PROTECT, help_text="这里引用了IT网络资源类型表进来复用")
	title = models.CharField(verbose_name="供应商描述", max_length=64, blank=False, help_text='''填方便查找的供应商名称或提供服务之类的关健字''')
	name = models.CharField(verbose_name="联系人", unique=True, max_length=64, blank=False, default="")
	fixed_phone = models.BigIntegerField(verbose_name="固定电话", help_text="全部数字，不能记录的号码请直接使用备注", blank=True, null=True)
	mobile_phone = models.BigIntegerField(verbose_name="移动电话", help_text="全部数字，不能记录的号码请直接使用备注", blank=True, null=True)
	email = models.EmailField(verbose_name="邮箱地址", unique=True, default="", blank=True, null=True)
	addr = models.CharField(verbose_name="供应商地址", max_length=128, blank=True, null=True)
	status = models.BooleanField(verbose_name="服务状态", default=True)

	def __str__(self):
		return self.title

	class Meta:
		verbose_name = "供应商"
		verbose_name_plural = verbose_name
		ordering = ("-create_datetime",)