from mansible.models import ProjectModel,PlaybookModel,PlaybookExecutionModel,CommandExecutionModel,InventoryhostModel,AdhocModel,ModuleModel
from dvadmin.utils.serializers import CustomModelSerializer


#序列化器：ModuleModel
class ModuleModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = ModuleModel
        fields = "__all__"

#这里是创建/更新时的列化器
class ModuleModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """
    class Meta:
        model = ModuleModel
        fields = '__all__'


#序列化器：AdhocModel
class AdhocModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = AdhocModel
        fields = "__all__"

#这里是创建/更新时的列化器
class AdhocModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = AdhocModel
        fields = '__all__'
    


#序列化器：ProjectModel
class ProjectModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = ProjectModel
        fields = "__all__"

#这里是创建/更新时的列化器
class ProjectModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """

    class Meta:
        model = ProjectModel
        fields = '__all__'


#序列化器：InventoryModel
class InventoryhostModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = InventoryhostModel
        fields = "__all__"
        

#这里是创建/更新时的列化器
class InventoryhostModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """
    class Meta:
        model = InventoryhostModel
        fields = '__all__'
        

# 序列化器：PlaybookModel
class PlaybookModelSerializer(CustomModelSerializer):
    """
    序列化器
    """
#这里是进行了序列化模型及所有的字段
    class Meta:
        model = PlaybookModel
        fields = "__all__"

#这里是创建/更新时的列化器
class PlaybookModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """
    
    class Meta:
        model = PlaybookModel
        fields = '__all__'


# 序列化器：PlaybookExecutionModel
class PlaybookExecutionModelSerializer(CustomModelSerializer):
    """
    用于序列化 PlaybookExecutionModel 的自定义序列化器。
    """

    class Meta:
        model = PlaybookExecutionModel  
        fields = "__all__"


class PlaybookExecutionModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """
    class Meta:
        model = PlaybookExecutionModel
        fields = '__all__'


# 序列化器：CommandExecutionModel
class CommandExecutionModelSerializer(CustomModelSerializer):
    """
    用于序列化 CommandExecutionModel 的自定义序列化器。
    """
    playbook_execution = PlaybookExecutionModelSerializer(read_only=True)  # 嵌套序列化 playbook_execution 字段

    class Meta:
        model = CommandExecutionModel  # 确保 CommandExecutionModel 是已定义的模型
        fields = "__all__"

class CommandExecutionModelCreateUpdateSerializer(CustomModelSerializer):
    """
    创建/更新时的列化器
    """
    class Meta:
        model = CommandExecutionModel
        fields = '__all__'