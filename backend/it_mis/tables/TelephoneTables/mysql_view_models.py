from django.db import models

from dvadmin.utils.models import CoreModel


from it_mis.tables.TelephoneTables.models import SubTelephoneModelShareCommonInfo
from PublicResource.tables.OrganizationTables.models import CompanyModel, AreaModel, DepartmentModel, OrganizationModel

class MysqlViewSubTelephoneModel(CoreModel, SubTelephoneModelShareCommonInfo):
    """
    mysql视图子表之转接飞线表
    就在这里面添加额外的属性，其它的不需要写出来，因为我们已经继承了CoreModel, SubTelephoneModelShareCommonInfo
    """
    company = models.ForeignKey(to=CompanyModel, verbose_name="号码归属公司", related_name="MysqlVViewSubTelephoneModel_Telcompany",  on_delete=models.PROTECT)
    area = models.ForeignKey(to=AreaModel, verbose_name="号码归属区域",  related_name="MysqlVViewSubTelephoneModel_Telarea", on_delete=models.PROTECT)
    department = models.ForeignKey(to=DepartmentModel, verbose_name="号码归属部门",  related_name="MysqlVViewSubTelephoneModel_Teldepartment", on_delete=models.PROTECT)
    TelUser = models.ForeignKey(to=OrganizationModel, verbose_name="号码使用人", related_name="MysqlVViewSubTelephoneModel_TelUser", on_delete=models.PROTECT, blank=True, null=True, default=None)
    TelRealPerson = models.ForeignKey(to=OrganizationModel, verbose_name="号码实名认证人", related_name="MysqlVViewSubTelephoneModel_TelRealPerson", on_delete=models.PROTECT)
    realDepartment = models.ForeignKey(to=DepartmentModel, verbose_name="号码管理部门",  related_name="MysqlVViewSubTelephoneModel_realDepartment", on_delete=models.PROTECT)

 

    class Meta:
        verbose_name = "电话子表筛选专用表"
        verbose_name_plural = verbose_name
        db_table = 'MysqlViewSubTelephoneModel'
        managed = False  #本表不被包括在makemigrations和migrate命令中
        ordering = ("-id",)
		# ordering = ("-create_datetime",)
  




from dvadmin.utils.serializers import CustomModelSerializer

class MysqlViewSubTelephoneModelSerializer(CustomModelSerializer):
    """
    序列化器
    """

    class Meta:
        model = MysqlViewSubTelephoneModel
        fields = "__all__"



from dvadmin.utils.viewset import CustomModelViewSet

class MysqlViewSubTelephoneModelViewSet(CustomModelViewSet):
    """
    list:查询
    """
    queryset = MysqlViewSubTelephoneModel.objects.all()
    serializer_class = MysqlViewSubTelephoneModelSerializer
    # create_serializer_class = MysqlVViewSubTelephoneModelCreateUpdateSerializer
    # update_serializer_class = MysqlVViewSubTelephoneModelCreateUpdateSerializer