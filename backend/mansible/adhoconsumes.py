import os
import time
from channels.exceptions import StopConsumer
from channels.generic.websocket import WebsocketConsumer
import json
import ansible_runner
import re
from .models import CommandExecutionModel, ModuleModel
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist

class AnsibleAdhocConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        module_id = data.get('module')
        params = data.get('ParamsName1', '')
        target_ips = data.get('playbooklimitip', [])
        use_root = data.get('is_root_active', False) 
        
        if module_id and params and target_ips:
            try:
                module = ModuleModel.objects.get(id=module_id)
                module_name = module.name.lower()
                if module_name in self.module_handlers:
                    handler = getattr(self, self.module_handlers[module_name])
                    handler(params, target_ips, use_root)
                else:
                    self.send(text_data=json.dumps({'result': f'Unsupported module: {module.name}'}))
            except ObjectDoesNotExist:
                self.send(text_data=json.dumps({'result': f'Module with id {module_id} not found'}))
        else:
            self.send(text_data=json.dumps({'result': 'Invalid data provided'}))

    def disconnect(self, close_code):
        print('WebSocket disconnected')
        raise StopConsumer()

    def run_shell_module(self, command, target_ips, use_root):
        self.send(text_data=json.dumps({'result': 'Starting shell command execution...\n'}))
        run_ansible_adhoc(self, 'shell', command, target_ips, use_root)

    def run_copy_module(self, params, target_ips, use_root):
        src, dest = params.split(':')
        self.send(text_data=json.dumps({'result': 'Starting copy operation...\n'}))
        run_ansible_adhoc(self, 'copy', f"src=./ansible_project/file/{src} dest={dest}", target_ips, use_root)

    def run_file_module(self, params, target_ips, use_root):
        self.send(text_data=json.dumps({'result': 'Starting file operation...\n'}))
        run_ansible_adhoc(self, 'file', params, target_ips, use_root)

    def run_service_module(self, params, target_ips, use_root):
        self.send(text_data=json.dumps({'result': 'Starting service operation...\n'}))
        run_ansible_adhoc(self, 'service', params, target_ips, use_root)

    def run_yum_module(self, params, target_ips, use_root):
        self.send(text_data=json.dumps({'result': 'Starting yum operation...\n'}))
        run_ansible_adhoc(self, 'yum', params, target_ips, use_root)

    module_handlers = {
        'shell': 'run_shell_module',
        'copy': 'run_copy_module',
        'file': 'run_file_module',
        'service': 'run_service_module',
        'yum': 'run_yum_module',
    }

def run_ansible_adhoc(consumer, module, module_args, target_ips, use_root):
    current_file = os.path.abspath(__file__)
    base_dir = os.path.dirname(current_file)
    private_data_dir = os.path.join(base_dir, "ansible_project")
    inventory_file = os.path.join(private_data_dir, "inventory") 
    start_time = time.time()
    if isinstance(target_ips, list):
        target_ips_str = ','.join(map(str, target_ips))
    else:
        target_ips_str = target_ips
    
    env_vars = {}
    if use_root:
        env_vars['ANSIBLE_BECOME'] = 'yes'
        env_vars['ANSIBLE_BECOME_METHOD'] = 'su'
        env_vars['ANSIBLE_BECOME_USER'] = 'root'
    
    def event_callback(event):
        try:
            stdout = event.get('stdout', '')
            cleaned_line = re.sub(r'\x1B[@-_][0-?]*[ -/]*[@-~]', '', stdout)
            consumer.send(text_data=json.dumps({'result': cleaned_line}))
        except Exception as e:
            print(f"Error processing event: {e}")

    runner_thread, runner = ansible_runner.run_async(
        private_data_dir=private_data_dir,
        host_pattern=target_ips_str,
        module=module,
        module_args=module_args,
        inventory=inventory_file,
        envvars=env_vars,
        event_handler=event_callback
    )

    # 等待运行完成
    runner_thread.join()

    end_time = time.time()
    execution_time = round(end_time - start_time, 2)

    consumer.send(text_data=json.dumps({'result': 'Task execution completed!\n'}))

    current_time = timezone.now()
    CommandExecutionModel.objects.create(
        task_id=runner.config.ident,
        command=f"{module}: {module_args}",
        private_data_dir=private_data_dir,
        status=runner.status,
        result=runner.rc,
        Duration_time=execution_time,
        execution_time=current_time
    )