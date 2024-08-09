from django.db import models
from dvadmin.utils.models import CoreModel



class goodstypeModel1(CoreModel):
    title = models.CharField(max_length=255, verbose_name="商品类型")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = '商品类型'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class goodsportModel1(CoreModel):
    title = models.CharField(max_length=255, verbose_name="商品端口")


    def __str__(self):
        return self.title
    
    class Meta:
        verbose_name = '商品端口'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)



class goodsModel1(CoreModel):
    goods = models.CharField(max_length=255, verbose_name="商品")
    inventory = models.IntegerField(verbose_name="库存量")
    goods_price = models.FloatField(verbose_name="商品定价")
    purchase_goods_date = models.DateField(verbose_name="进货时间", blank=True, null=True)


    # def __str__(self):
    #     return self.goods
    
    class Meta:
        verbose_name = '商品表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class goodsToOtherModel1(CoreModel):
    goodsName=  models.ForeignKey('goodsModel1', verbose_name="产品名称", on_delete=models.CASCADE)
    goodstype=  models.ForeignKey('goodstypeModel1', verbose_name="商品类型", on_delete=models.CASCADE)
    goodsport=  models.ForeignKey('goodsportModel1', verbose_name="商品端口", on_delete=models.CASCADE)

    # def __str__(self):
    #     return self.goodsName
    
    class Meta:
        verbose_name = '商品详细信息表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)