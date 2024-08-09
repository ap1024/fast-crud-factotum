#第一版代码，亲手写的
import os.path
import time
from channels.exceptions import StopConsumer
from channels.generic.websocket import WebsocketConsumer
import json
import ansible_runner
import re
from .models import PlaybookExecutionModel, PlaybookModel
from django.utils import timezone
from django.core.exceptions import ObjectDoesNotExist
import traceback
from asgiref.sync import async_to_sync
import threading

class ansible_playbook_ResConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

    def receive(self, text_data):
        data = json.loads(text_data)
        playbook_path = data.get('playbook_path', '')
        playbook_name = data.get('playbookName1', '')
        playbook_limitip = data.get('playbooklimitip', '')
        
        if playbook_path and playbook_name:
            if self.validate_playbook_limitip(playbook_name, playbook_limitip):
                self.send(text_data=json.dumps({'result': '资产清单校验匹配成功,开始执行任务\n'
                '  _____\n'
                ' /     \\\n'
                '| () () |\n'
                ' \\  ^  /\n'
                '  |||||\n'
                '  |||||\n'}))

                run_ansible_playbook(playbook_path, self, playbook_name, playbook_limitip)
            else:
                self.send(text_data=json.dumps({'result': 'Playbook限制资产不匹配'}))
        else:
            self.send(text_data=json.dumps({'result': 'No playbook path or name provided'}))

    def validate_playbook_limitip(self, playbook_name, playbook_limitip):
        try:
            playbook = PlaybookModel.objects.get(name=playbook_name)
            db_ips = set(playbook.tempip)
            input_ips = set(playbook_limitip)
            print(db_ips == input_ips)
            return db_ips == input_ips
        
        except ObjectDoesNotExist:
            self.send(text_data=json.dumps({'result': f'Playbook "{playbook_name}" not found'}))
            return False
        except Exception as e:
            self.send(text_data=json.dumps({'result': f'Error: {str(e)}'}))
            return False

    def disconnect(self, close_code):
        print('断开连接')
        raise StopConsumer()

def run_ansible_playbook(playbook_path, consumer, playbook_name, playbook_limitip):
    current_file = os.path.abspath(__file__)
    base_dir = os.path.dirname(current_file)
    private_data_dir = os.path.join(base_dir, "ansible_project")
    inventory_file = os.path.join(private_data_dir, "inventory") 
    start_time = time.time()
    playbook_path = os.path.join(private_data_dir+"/project/", playbook_path)
    if isinstance(playbook_limitip, list):
        playbook_limitip_str = ','.join(map(str, playbook_limitip))
    else:
        playbook_limitip_str = playbook_limitip

    def event_callback(event):
        try:
            stdout = event.get('stdout', '无输出')
            cleaned_line = re.sub(r'\x1B[@-_][0-?]*[ -/]*[@-~]', '', stdout)
            consumer.send(text_data=json.dumps({'result': cleaned_line}))
        except Exception as e:
            print(f"Error processing event: {e}")

    runner_thread, runner = ansible_runner.run_async(
        private_data_dir=private_data_dir,
        playbook=playbook_path,
        limit=playbook_limitip_str,
        inventory=inventory_file,
        event_handler=event_callback
    )

    # 等待运行完成
    runner_thread.join()

    end_time = time.time()
    execution_time1 = round(end_time - start_time, 2)
    playbook_instance = PlaybookModel.objects.get(name=playbook_name)

    consumer.send(text_data=json.dumps({'result': '任务执行完毕，请自行查看结果!\n'
            '  *****  \n'
            ' *     * \n'
            '*  o o  *\n'
            '*   ^   *\n'
            ' * \\_/ * \n'
            '  *****  \n'}))

    # 记录执行结果
    current_time = timezone.now()
    PlaybookExecutionModel.objects.create(
        task_id=runner.config.ident,
        playbook=playbook_instance,
        private_data_dir=private_data_dir,
        status=runner.status,
        result=runner.rc,
        Duration_time=execution_time1,
        execution_time=current_time
    )


    


# import os.path
# import time
# import json
# import ansible_runner
# import re
# from .models import PlaybookExecutionModel, PlaybookModel
# from django.utils import timezone
# from django.core.exceptions import ObjectDoesNotExist
# import asyncio
# # from channels.layers import get_channel_layer
# from asgiref.sync import async_to_sync
# from channels.generic.websocket import AsyncWebsocketConsumer


# class ansible_playbook_ResConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         await self.accept()

#     async def disconnect(self, close_code):
#         print('断开连接')

#     async def receive(self, text_data):
#         data = json.loads(text_data)
#         playbook_path = data.get('playbook_path', '')
#         playbook_name = data.get('playbookName1', '')
#         playbook_limitip = data.get('playbooklimitip', '')
        
#         if playbook_path and playbook_name:
#             if await self.validate_playbook_limitip(playbook_name, playbook_limitip):
#                 await self.channel_layer.send(
#                     self.channel_name,
#                     {
#                         "type": "run_playbook",
#                         "playbook_path": playbook_path,
#                         "playbook_name": playbook_name,
#                         "playbook_limitip": playbook_limitip
#                     }
#                 )
#                 await self.send(text_data=json.dumps({'result': 'IP校验匹配成功，开始执行任务'}))
#             else:
#                 await self.send(text_data=json.dumps({'result': 'Playbook限制IP不匹配'}))
#         else:
#             await self.send(text_data=json.dumps({'result': 'No playbook path or name provided'}))

#     async def run_playbook(self, event):
#         playbook_path = event['playbook_path']
#         playbook_name = event['playbook_name']
#         playbook_limitip = event['playbook_limitip']
        
#         # 在异步环境中运行同步函数
#         await asyncio.to_thread(
#             run_ansible_playbook,
#             playbook_path,
#             self,
#             playbook_name,
#             playbook_limitip
#         )
#     async def send_playbook_output(self, event):
#         message = event['message']
#         await self.send(text_data=json.dumps({'result': message}))

#     async def validate_playbook_limitip(self, playbook_name, playbook_limitip):
#         try:
#             playbook = await asyncio.to_thread(PlaybookModel.objects.get, name=playbook_name)
#             db_ips = set(await asyncio.to_thread(lambda: playbook.tempip.values_list('ip', flat=True)))
#             input_ips = set(playbook_limitip)
#             return db_ips == input_ips
        
#         except ObjectDoesNotExist:
#             await self.send(text_data=json.dumps({'result': f'Playbook "{playbook_name}" not found'}))
#             return False
#         except Exception as e:
#             await self.send(text_data=json.dumps({'result': f'Error: {str(e)}'}))
#             return False


# def run_ansible_playbook(playbook_path, consumer, playbook_name, playbook_limitip):
#     private_data_dir = "/root/wuli/djangoProject/mansible/"
#     start_time = time.time()
#     playbook_path = os.path.join(private_data_dir+"project/", playbook_path)
    
#     def event_callback(event):
#         try:
#             stdout1 = event.get('stdout', '')
#             stdout2 = event.get('event_data', {}).get('res', {}).get('stdout', '')
#             task_id1 = event.get('runner_ident')
#             stdout = stdout1 + stdout2
#             cleaned_line = re.sub(r'\x1B[@-_][0-?]*[ -/]*[@-~]', '', stdout)
            
#             # 使用WebSocket发送实时输出
#             async_to_sync(consumer.channel_layer.send)(
#                 consumer.channel_name,
#                 {
#                     "type": "send_playbook_output",
#                     "message": cleaned_line
#                 }
#             )
#         except Exception as e:
#             print(f"Error processing event: {e}")

#     r = ansible_runner.run(private_data_dir=private_data_dir, playbook=playbook_path, event_handler=event_callback)
    
#     end_time = time.time()
#     execution_time1 = round(end_time - start_time, 2)
#     playbook_instance = PlaybookModel.objects.get(name=playbook_name)

#     current_time = timezone.now()
#     PlaybookExecutionModel.objects.create(
#         task_id=r.config.ident,
#         playbook=playbook_instance,
#         private_data_dir=private_data_dir,
#         status=r.status,
#         result=r.rc,
#         Duration_time=execution_time1,
#         execution_time=current_time
#     )

#     # 发送完成消息
#     async_to_sync(consumer.channel_layer.send)(
#         consumer.channel_name,
#         {
#             "type": "send_playbook_output",
#             "message": "Playbook execution completed."
#         }
#     )

