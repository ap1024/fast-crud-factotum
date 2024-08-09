from django.db import models

from dvadmin.utils.models import CoreModel


from PublicResource.tables.OrganizationTables.models import CompanyModel, AreaModel, DepartmentModel
from it_mis.tables.ItResourceTables.models import  ItResourceShareCommonInfo


class MysqlViewItResource(CoreModel, ItResourceShareCommonInfo):  #注释编号: django-vue3-admin-mysql_view_models542511:这里直接引入公共字段基类ItResourceShareCommonInfo
	
	company = models.ForeignKey(to=CompanyModel, verbose_name="公司", related_name="MysqlViewItResource_company", blank=True, null=True, on_delete=models.PROTECT)
	area = models.ForeignKey(to=AreaModel, verbose_name="区域", related_name="MysqlViewItResource_area", blank=True, null=True, on_delete=models.PROTECT)
	department = models.ForeignKey(to=DepartmentModel, verbose_name="部门", related_name="MysqlViewItResource_department", blank=True, null=True, on_delete=models.PROTECT)


	
	class Meta:
		verbose_name = "资产与配置信息"
		verbose_name_plural = verbose_name
		db_table = 'MysqlViewItResource'
		managed = False  #本表不被包括在makemigrations和migrate命令中
		ordering = ("-id",)
		# ordering = ("-create_datetime",)