from django.db import models
from dvadmin.utils.models import CoreModel


class InventoryhostModel(CoreModel):
    ip = models.CharField(max_length=50, verbose_name='IP地址')
    name=models.CharField(max_length=50, verbose_name='名称',default="测试")
    parent = models.ForeignKey(
        to="InventoryhostModel",
        on_delete=models.CASCADE,
        default=None,
        verbose_name="上级名称",
        db_constraint=False,
        null=True,
        blank=True,
        help_text="上级名称",
    )
    class Meta:
        db_table = "Inventoryhost"
        verbose_name = '资产ip表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class ProjectModel(CoreModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "Project"
        verbose_name = '项目表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class PlaybookModel(CoreModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    # file_path = models.FileField(upload_to='playbooks/')
    file_path = models.CharField(max_length=200)
    project = models.ForeignKey(ProjectModel, on_delete=models.CASCADE, related_name='playbooks')
    tempip = models.JSONField(default=list, blank=True, verbose_name="目标ip", help_text="目标ip")

    class Meta:
        db_table = "Playbook"
        verbose_name = 'playbook表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class ModuleModel(CoreModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)

    class Meta:
        db_table = "ModuleModel"
        verbose_name = '模块表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)

## Ad-hoc Model模型
class AdhocModel(CoreModel):
    module_name = models.CharField(max_length=100, verbose_name="任务名称")
    module = models.ForeignKey(ModuleModel, on_delete=models.CASCADE, related_name='ModuleModel')
    params = models.JSONField(default=list, blank=True,null=True,verbose_name="模块参数", help_text="模块参数")
    is_root_active = models.BooleanField(default=True, verbose_name="是否切换root", help_text="是否切换root")
    tempip = models.JSONField(default=list, blank=True, verbose_name="目标ip", help_text="目标ip")

    class Meta:
        db_table = "Adhoc"
        verbose_name = 'Ad-Hoc表'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)


class PlaybookExecutionModel(CoreModel):
    task_id = models.CharField(max_length=100, unique=True)
    playbook = models.ForeignKey(PlaybookModel, on_delete=models.CASCADE, related_name='executions')
    private_data_dir = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    result = models.TextField()
    Duration_time = models.FloatField()
    execution_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "PlaybookExecution"
        verbose_name = 'playbook执行日志'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)

class CommandExecutionModel(CoreModel):
    task_id = models.CharField(max_length=100, unique=True)
    command = models.TextField()
    private_data_dir = models.CharField(max_length=255)
    status = models.CharField(max_length=50)
    result = models.TextField()
    Duration_time = models.FloatField()
    execution_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "CommandExecution"
        verbose_name = 'ad-hoc执行日志'
        verbose_name_plural = verbose_name
        ordering = ('-create_datetime',)
