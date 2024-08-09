# 导入信号库
from django.db.models.signals import post_save
from django.dispatch import receiver
from it_mis.tables.ItResourceTables.models import ItResource

from it_mis.tables.LicenceTables.models import Licence
from it_mis.tables.ItNetInfoTables.models import ItNetInfo


# 注释编号:django-vue3-admin__signals093014:代码开始行
# 功能说明:对ItResource之created创建对象之后做了动作的处理
#需要导入from it_mis.models import ItResource, Licence

#导入自定义的处理函数
from .custom_class import use_status_and_used_by_action

@receiver(post_save, sender=ItResource, dispatch_uid="ItResource_created_post_save")
def ItResource_created_post_save(sender, instance, created, **kwargs):
    if created:  #这时创建完对象之后进行信号操作
        # 注释编号:django-vue3-admin__serializers351515:代码开始行
        # 功能说明:如果新增过来的值有soft_licence，那么就要进行相应更新处理
        if instance.soft_licence_id: 
            use_status_and_used_by_action.add(instance, Licence, field_id="soft_licence_id")
        # 注释编号:django-vue3-admin__serializers531815:代码结束行


# 注释编号:django-vue3-admin__signals093014:代码结束行