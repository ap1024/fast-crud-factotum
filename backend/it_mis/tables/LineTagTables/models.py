from django.db import models
from dvadmin.utils.models import CoreModel


from it_mis.tables.ItNetInfoTables.models import DevicePortModel
from PublicResource.tables.globalDictTables.models import globalDictModel



class NetworkFrameModel(CoreModel):
    title = models.CharField(verbose_name="网络配线架", unique=True, max_length=64, blank=False)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "网络配线架"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)



class LineAreaModel(CoreModel):
    title = models.CharField(verbose_name="线路区域", unique=True, max_length=64, blank=False)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "线路区域"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)




class LineTagtypeModel(CoreModel):
    title = models.CharField(verbose_name="线路类型", unique=True, max_length=64, blank=False)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "线路类型"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class LineTagModel(CoreModel):
    line_num = models.IntegerField(verbose_name="线编号", unique=True, help_text="该线在图纸上的编号")
    seat_num = models.IntegerField(verbose_name="卡位编号", help_text="该线在图纸上所属卡位编号")
    linetagtype = models.ForeignKey('LineTagtypeModel', verbose_name="线路类型", help_text="指明当前线路的类型", on_delete=models.PROTECT)

    
    def __str__(self):
        #注释编号: django-vue3-admin-models160018:这里要把返回的对象非str的情况下，都要转为str，这样对于导到时，才能拿到相应的数据
        return str(self.line_num)
    

    
    class Meta:
        verbose_name = "线路标签"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)


class lineAccessTypeModel(CoreModel):
    title = models.CharField(verbose_name="线路接入类型", unique=True, max_length=255, blank=False)
    url = models.CharField(verbose_name="线路类型请求的URL", max_length=255, blank=True, null=True, help_text="线路类型请求的URL,可以通过api接口查看,或者找后端要")
    label = models.CharField(verbose_name="标签", max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "子表线路接入类型"
        verbose_name_plural = verbose_name
        ordering = ("-create_datetime",)





class SubLineTagModel(CoreModel):
    sortIndex = models.IntegerField(verbose_name="子表排序索引", blank=False, default=None)

    #注释编号: django-vue3-admin-models043114:这里的线路编码即是拿到的父类的ID，尽量不要更改为其它，保持默认字段名称为parentId
    parentId = models.ForeignKey('LineTagModel', verbose_name="线路编码", on_delete=models.PROTECT)
    lineaccesstype = models.ForeignKey('lineAccessTypeModel', verbose_name="线路接入类型", on_delete=models.PROTECT)
    
    #注释编号: django-vue3-admin_models443110:这个设备归属它可能会存设备\机柜\配线架之类的ID，所以必须这里设置为IntegerField，而且前端把它做成了dict-select字典类型，如果不
    #设置为IntegerField类型的话，前端重新加载页面的时候，拿到的类型就不是IntegerField数字，而是字符串了，这会导致加载出错。
    device_ownership = models.IntegerField(verbose_name="设备归属", blank=False)

    #注释编号: django-vue3-admin-models301617:device_ownership_title字段主要是匹配device_ownership字段给前端进行搜索过滤使用的
    device_ownership_title = models.CharField(verbose_name="设备归属的显示名称", max_length=255, blank=True, null=True)


    #这里要把对应url请求存在这里,这个值由lineaccesstype的值发生变化之后,填充过来.(前端操作)
    device_ownership_url = models.CharField(verbose_name="设备归属之URL", max_length=255, blank=True, null=True)

    #这里要把对应设备归属对应要显示的label给存起来，方便后期进行使用
    device_ownership_label  = models.CharField(verbose_name="设备归属对应的label", max_length=255, blank=True, null=True)

    #这个标签是指URL请求回来之后，要显示的哪个字段的名称，这是给前端使用的

    
    #注释编号: django-vue3-admin-models484117:这里存储一个字符串，1代表前面、2代表后面，他的值可以去全局字典里进行渲染
    port_direction = models.IntegerField(verbose_name="端口方向", blank=True, null=True, default=None)


    device_port = models.ForeignKey('DevicePortModel', verbose_name="端口", blank=True, null=True, on_delete=models.PROTECT)


    def __str__(self):
        return self.line_num


    class Meta:
        verbose_name = "子表线路标签"
        verbose_name_plural = verbose_name
