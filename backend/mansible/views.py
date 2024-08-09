# Create your views here.
import os,json
from mansible.models import ProjectModel,PlaybookModel,PlaybookExecutionModel,CommandExecutionModel,InventoryhostModel,AdhocModel,ModuleModel
from mansible.serializers import ProjectModelSerializer, ProjectModelCreateUpdateSerializer, PlaybookModelSerializer, \
    PlaybookModelCreateUpdateSerializer, PlaybookExecutionModelSerializer, PlaybookExecutionModelCreateUpdateSerializer, \
    CommandExecutionModelSerializer, CommandExecutionModelCreateUpdateSerializer, InventoryhostModelSerializer, \
    InventoryhostModelCreateUpdateSerializer,AdhocModelSerializer,AdhocModelCreateUpdateSerializer,ModuleModelSerializer,ModuleModelCreateUpdateSerializer
from dvadmin.utils.viewset import CustomModelViewSet
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse


class ModuleModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = ModuleModel.objects.all()
    serializer_class = ModuleModelSerializer
    create_serializer_class = ModuleModelCreateUpdateSerializer
    update_serializer_class = ModuleModelCreateUpdateSerializer



class InventoryhostModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = InventoryhostModel.objects.all()
    serializer_class = InventoryhostModelSerializer
    create_serializer_class = InventoryhostModelCreateUpdateSerializer
    update_serializer_class = InventoryhostModelCreateUpdateSerializer
    


class ProjectModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = ProjectModel.objects.all()
    serializer_class = ProjectModelSerializer
    create_serializer_class = ProjectModelCreateUpdateSerializer
    update_serializer_class = ProjectModelCreateUpdateSerializer


class PlaybookModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    # InventoryhostModel_info = DynamicSerializerMethodField()
    queryset = PlaybookModel.objects.all()
    serializer_class = PlaybookModelSerializer
    create_serializer_class = PlaybookModelCreateUpdateSerializer
    update_serializer_class = PlaybookModelCreateUpdateSerializer

 
class PlaybookExecutionModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = PlaybookExecutionModel.objects.all()
    serializer_class = PlaybookExecutionModelSerializer
    create_serializer_class = PlaybookExecutionModelCreateUpdateSerializer
    update_serializer_class = PlaybookExecutionModelCreateUpdateSerializer


class AdhocModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = AdhocModel.objects.all()
    serializer_class = AdhocModelSerializer
    create_serializer_class = AdhocModelCreateUpdateSerializer
    update_serializer_class = AdhocModelCreateUpdateSerializer


class CommandExecutionModelViewSet(CustomModelViewSet):
    """
    list:查询
    create:新增
    update:修改
    retrieve:单例
    destroy:删除
    """
    queryset = CommandExecutionModel.objects.all()
    serializer_class = CommandExecutionModelSerializer
    create_serializer_class = CommandExecutionModelCreateUpdateSerializer
    update_serializer_class = CommandExecutionModelCreateUpdateSerializer



@csrf_exempt
def read_file(request):
    file_path = request.GET.get('file_path')
    current_file = os.path.abspath(__file__)
    base_dir = os.path.dirname(current_file)
    private_data_dir = os.path.join(base_dir, "ansible_project")
    # private_data_dir = "/root/wuli/djangoProject/mansible/"
    file_path = os.path.join(private_data_dir+"/project/", file_path)
    print(f"Requested file path: {file_path}")
    try:
        with open(file_path, 'r') as file:
            content = file.read()
        return JsonResponse({'content': content})
    except FileNotFoundError:
        print("File not found")
        return JsonResponse({'error': 'File not found'}, status=404)
    except Exception as e:
        print(f"Error reading file: {e}")
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
def save_file(request):
    data = json.loads(request.body)
    file_path = data.get('file_path')
    current_file = os.path.abspath(__file__)
    base_dir = os.path.dirname(current_file)
    private_data_dir = os.path.join(base_dir, "ansible_project")
    # private_data_dir = "/root/wuli/djangoProject/mansible/"
    file_path = os.path.join(private_data_dir+"/project/", file_path)
    content = data.get('content')
    try:
        with open(file_path, 'w') as file:
            file.write(content)
        return JsonResponse({'status': '保存成功_the file is saved'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
