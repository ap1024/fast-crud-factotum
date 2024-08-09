from django.db import models

from dvadmin.utils.models import CoreModel

# Create your models here.


# 注释编号:django-vue-admin__models505916:代码开始行
# 功能说明:

class AreaModel(CoreModel):
    title = models.CharField(verbose_name="区域", unique=True, max_length=64, blank=False)
    AreaNum = models.CharField(verbose_name="区号", max_length=64, blank=False, default=None)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "区域"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class CompanyModel(CoreModel):
    title = models.CharField(verbose_name="公司名称", unique=True, max_length=64, blank=False)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "公司名称"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class DepartmentModel(CoreModel):
    title = models.CharField(verbose_name="部门名称", unique=True, max_length=64, blank=False)

    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = "部门"
        verbose_name_plural = verbose_name    
        ordering = ("-create_datetime",)

#注释编号: django-vue3-admin-models142316:导入全局字典表
from PublicResource.tables.globalDictTables.models import globalDictModel

class OrganizationModel(CoreModel):
    company = models.ForeignKey(to=CompanyModel, verbose_name="公司",  on_delete=models.PROTECT)
    area = models.ForeignKey(to=AreaModel, verbose_name="区域",  on_delete=models.PROTECT)
    department = models.ForeignKey(to=DepartmentModel, verbose_name="部门",  on_delete=models.PROTECT)
    use = models.CharField(verbose_name="员工", max_length=64, default="", null=True)
    
    #注释编号: django-vue3-admin-models322316:将原来的字典修改为全局字典模式

    # or_use_status = models.CharField(verbose_name="员工状态",  max_length=64, blank=False, default=None)
    or_use_status = models.ForeignKey('globalDictModel', verbose_name="员工状态",  on_delete=models.PROTECT, default=None)
    date = models.DateField(verbose_name="入职时间", default=None)
    

    def __str__(self):
        return self.use

    class Meta:
        verbose_name = "it资源组织"
        verbose_name_plural = verbose_name
        ordering = ("-update_datetime",)



# 注释编号:django-vue-admin__models505916:代码结束行