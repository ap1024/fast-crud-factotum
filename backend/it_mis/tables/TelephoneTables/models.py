from django.db import models
from dvadmin.utils.models import CoreModel

from PublicResource.tables.OrganizationTables.models import AreaModel, CompanyModel, DepartmentModel
from PublicResource.tables.OrganizationTables.models import OrganizationModel

from it_mis.tables.SuppliersTables.models import Suppliers


class TelephoneTypeModel(CoreModel):
    title = models.CharField(verbose_name="电话类型", unique=True, max_length=64, blank=False)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "电话类型"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class lineAccessModel(CoreModel):
    title = models.CharField(verbose_name="线路接入信息", unique=True, max_length=64, blank=False)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "线路接入信息"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)



#这里引用了IT网络资源类型表进来复用
from it_mis.tables.ItNetInfoTables.models import ItNetType
from PublicResource.tables.globalDictTables.models import globalDictModel

class TelephoneModel(CoreModel):

    # 注释编号:django-vue3-admin-models570211
    # 功能说明:号码归属信息
    
    company = models.ForeignKey(to=CompanyModel, verbose_name="号码归属公司", related_name="Telcompany",  on_delete=models.PROTECT)
    area = models.ForeignKey(to=AreaModel, verbose_name="号码归属区域",  related_name="Telarea", on_delete=models.PROTECT)
    department = models.ForeignKey(to=DepartmentModel, verbose_name="号码归属部门",  related_name="Teldepartment", on_delete=models.PROTECT)
    TelUser = models.ForeignKey(to=OrganizationModel, verbose_name="号码使用人", related_name="TelUser", on_delete=models.PROTECT, blank=True, null=True, default=None)
    TelRealPerson = models.ForeignKey(to=OrganizationModel, verbose_name="号码实名认证人", related_name="TelRealPerson", on_delete=models.PROTECT)
    realDepartment = models.ForeignKey(to=DepartmentModel, verbose_name="号码管理部门",  on_delete=models.PROTECT)

    # 注释编号:django-vue3-admin-models570211


    TelAreaNum = models.CharField(verbose_name="号码区号", max_length=64, blank=False, default=None)
    TelNumber = models.CharField(verbose_name="号码Num", unique=True, max_length=64, blank=False)
    Telstatus = models.ForeignKey(to=globalDictModel, verbose_name="号码状态",  on_delete=models.PROTECT, default=None, help_text="这里引用了全局字典表进来复用")

    TelephoneType = models.ForeignKey(to=TelephoneTypeModel, verbose_name="电话类型",  on_delete=models.PROTECT)
    SuppliersItNetType = models.ForeignKey(to=ItNetType, verbose_name="供应商类型", null=True, default=None, on_delete=models.PROTECT, help_text="这里引用了IT网络资源类型表进来复用")
    Suppliers  = models.ForeignKey(to=Suppliers, verbose_name="供应商",  on_delete=models.PROTECT)
    # data = models.DateField(verbose_name="日期", blank=True, null=True)


    #如下是转接配置需求，比如远程地址、远程账号、远程密码，转接描述等
    transfer_address = models.CharField(verbose_name="转接需求地址", max_length=255, blank=True, null=True)
    transfer_dial_num = models.CharField(verbose_name="转接拨打号码", max_length=255, blank=True, null=True)
    transfer_account = models.CharField(verbose_name="转接需求账号", max_length=255, blank=True, null=True)
    transfer_password = models.CharField(verbose_name="转接需求密码", max_length=255, blank=True, null=True)
    transfer_description = models.CharField(verbose_name="转接需求描述", max_length=255, blank=True, null=True)

    
    def __str__(self):
        return self.TelNumber

    class Meta:
        verbose_name = "电话表"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)



class TelAccessTypeModel(CoreModel):
    """
    电话接入类型，是主要给电话转接飞线表里面的联动选择使用的
    """
    title = models.CharField(verbose_name="电话接入类型", unique=True, max_length=255, blank=False)
    Tel_access_url = models.CharField(verbose_name="电话类型请求的URL", unique=True, max_length=255, blank=False, help_text="电话类型请求的URL,可以通过api接口查看,或者找后端要")
    label = models.CharField(verbose_name="标签", max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "电话子表线路接入类型"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


from it_mis.tables.LineTagTables.models import lineAccessTypeModel




class SubTelephoneModelShareCommonInfo(models.Model):
    # 公共字段定义在这里

    #所有子表对应父表的ID，都默认使用parentId，这样对于前端的api配置就可以统一
    parentId = models.ForeignKey('TelephoneModel', verbose_name="关联电话号码", on_delete=models.PROTECT, help_text="这里拿到的实际是关联电话号码的ID，而不是电话号码的值")

    sortIndex = models.IntegerField(verbose_name="子表排序索引", blank=False, default=None)

    #注释编号: django-vue3-admin-models394110:接入类型及对应的需求title、URL、label
    accesstype = models.ForeignKey('lineAccessTypeModel', verbose_name="接入类型", blank=True, null=True,  default=None, on_delete=models.PROTECT)
    accessInfo = models.CharField(verbose_name="接入信息", max_length=255, blank=True, null=True, default=None)

    url = models.CharField(verbose_name="接入类型之URL", max_length=255, blank=True, null=True)
    label  = models.CharField(verbose_name="接入类型对应的label", max_length=255, blank=True, null=True)

    #这里存储一个字符串，1代表前面、2代表后面，他的值可以去全局字典里进行渲染
    port_direction = models.IntegerField(verbose_name="端口方向", blank=True, null=True, default=None)
    device_port = models.ForeignKey('DevicePortModel', verbose_name="端口", blank=True, null=True, on_delete=models.PROTECT)
    # 你可以添加更多的公共字段...

    class Meta:
        abstract = True  # 抽象基类，不会为它创建数据库表




class SubTelephoneModel(CoreModel, SubTelephoneModelShareCommonInfo):
    """
    电话转接飞线表是针对TelephoneModel电话表做成的子表,这样前端可以套在TelephoneModel电话表中,录入多条电话号码转接情况数据
    """


    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "电话子表之转接飞线表"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)

