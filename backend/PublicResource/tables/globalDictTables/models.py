from django.db import models

from dvadmin.utils.models import CoreModel

# Create your models here.


class globalDictModel(CoreModel):
    belongSystem = models.ForeignKey('self', verbose_name="归属系统",  related_name="dict_belongSystem", blank=True, null=True, on_delete=models.PROTECT, help_text="自己关联自己来使用字典")
    belogTable = models.ForeignKey('self', verbose_name="归属表格",  related_name="dict_belogTable", blank=True, null=True, on_delete=models.PROTECT, help_text="自己关联自己来使用字典")
    dictMark = models.ForeignKey('self', verbose_name="字典标记",  related_name="dict_dictMark", blank=True, null=True, on_delete=models.PROTECT, help_text="自己关联自己来使用字典")
    dictName =  models.CharField(verbose_name="字典名称",  max_length=64, blank=False, default=None)
    dictNum = models.IntegerField(verbose_name="字典序号", default=0, null=True, blank=True)


    class Meta:
        verbose_name = "全局字典"
        verbose_name_plural = verbose_name