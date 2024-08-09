from django.db import models
#注释编号: django-vue3-admin_models433516:单独导入JSONField
from django.db.models import JSONField

# Create your models here.
from dvadmin.utils.models import CoreModel


class goodstype(CoreModel):
    title = models.CharField(max_length=255, verbose_name="商品类型")


    class Meta:
        verbose_name = '商品类型'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class goodstypeportModel(CoreModel):
    title = models.CharField(max_length=255, verbose_name="商品端口")


    class Meta:
        verbose_name = '商品端口'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class CrudDemoModel(CoreModel):
    goods = models.CharField(max_length=255, verbose_name="商品")
    inventory = models.IntegerField(verbose_name="库存量")
    goods_price = models.FloatField(verbose_name="商品定价")
    purchase_goods_date = models.DateField(verbose_name="进货时间", blank=True, null=True)

    #注释编号: django-vue3-admin_models421416:添加多对多字段，让前端把subTable数据整理之后存到这里来
    goodstypes = models.ManyToManyField('goodstype', verbose_name="商品类型", default=None, blank=True)
    goodsport = models.ManyToManyField('goodstypeportModel', verbose_name="商品端口", default=None, blank=True)

    #注释编号: django-vue3-admin_models543516:将字段配置为JSONField类型
    subTable = JSONField(blank=True, null=True, verbose_name="子表格数据")

    class Meta:
        verbose_name = '商品表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)



# 注释编号:django-vue3-admin_models220217
# 功能说明:对CrudDemoModel专门创建两个中间模型，以方便做这两个字段的联合唯一功能
#CrudDemoModel中的goodstypes与goodsport多对多字段
class GoodstypesCrud(models.Model):
    cruddemomodel = models.ForeignKey(
        'CrudDemoModel',
        on_delete=models.CASCADE,
    )
    goodstype = models.ForeignKey(
        'goodstype',
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = "商品类型关系一"
        verbose_name_plural = verbose_name
        db_table = 'crud_demo_cruddemomodel_goodstypes'
        managed = False  #本表不被包括在makemigrations和migrate命令中




class GoodsportsCrud(models.Model):
    cruddemomodel = models.ForeignKey(
        'CrudDemoModel',
        on_delete=models.CASCADE,
    )
    goodstypeportmodel = models.ForeignKey(
        'goodstypeportModel',
        on_delete=models.CASCADE,
    )

    class Meta:
        verbose_name = "商品端口关系二"
        verbose_name_plural = verbose_name
        db_table = 'crud_demo_cruddemomodel_goodsport'
        managed = False  #本表不被包括在makemigrations和migrate命令中

# 注释编号:django-vue3-admin_models220217
