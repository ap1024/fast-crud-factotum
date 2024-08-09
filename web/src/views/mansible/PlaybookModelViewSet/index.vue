<template>
  <fs-page class="PageFeatureSearchMulti">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_url="scope">
        <el-tag size="small">{{ scope.row.url }}</el-tag>
      </template>
    </fs-crud>

    <el-dialog class="dialog-container" v-model="fileDialogVisible" title="编辑文件" width="800px" draggable>
      <el-input
        type="textarea"
        v-model="fileContent"
        rows="20"
        placeholder="文件内容"
      ></el-input>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleFileDialogClose" class="button cancel">取消</el-button>
          <el-button type="primary" @click="handleFileDialogSubmit" class="button submit">提交</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog class="message-box" v-model="messageBoxVisible" title="消息盒子" width="1700px" @opened="scrollToBottom">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="执行日志" name="log">
          <div class="log-container" ref="logContainer">
            <pre class="log-text" v-html="outputText" style="white-space: pre-wrap;"></pre>
          </div>
          <el-button @click="handleCustomActionClose" class="button cancel">关闭</el-button>
          <el-button type="primary" @click="handleCustomActionSubmit" class="button submit">执行</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </fs-page>
</template>

<script lang="ts">
import { ref, onMounted, onUnmounted, defineComponent, watch, nextTick } from 'vue';
import { useExpose, useCrud } from '@fast-crud/fast-crud';
import { createCrudOptions } from './crud';
import { ReadFile, SaveFile } from './api';

const crudRef = ref();
const crudBinding = ref();
const { crudExpose } = useExpose({ crudRef, crudBinding });

export default defineComponent({
  name: 'PlaybookModelViewSet',
  setup() {
    const fileDialogVisible = ref(false);
    const messageBoxVisible = ref(false);
    const activeTab = ref('log');
    const outputText = ref('');
    const playbookPath = ref('');
    const playbookName = ref('');
    const playbooklimitip2 = ref('');
    const logContainer = ref(null);
    const fileContent = ref('');
    let socket: WebSocket | null = null;

    const initWebSocket = () => {
      if (socket) {
        socket.close();
      }
      socket = new WebSocket('ws://127.0.0.1:8000/ansible_playbook/');

      socket.onopen = () => {
        console.log('WebSocket连接已打开');
      };

      socket.onmessage = (event) => {
        console.log('收到WebSocket消息:', event.data);
        const data = JSON.parse(event.data);
        if (data.result) {
          console.log('添加新的输出:', data.result);
          outputText.value += data.result + '\n';
        }
      };

      socket.onclose = () => {
        console.log('WebSocket连接已关闭');
      };

      socket.onerror = (error) => {
        console.error('WebSocket连接发生错误:', error);
      };
    };

    const handleCustomActionOpen = (row) => {
      initWebSocket();
      messageBoxVisible.value = true;
      outputText.value = '';
      playbookPath.value = row.file_path;
      playbookName.value = row.name;
      playbooklimitip2.value = row.tempip;
    };

    const handleCustomActionClose = () => {
      messageBoxVisible.value = false;
      outputText.value = '';
      if (socket) {
        socket.close();
        socket = null;
      }
    };

    const handleCustomActionSubmit = () => {
      outputText.value = '';
      const playbook_path = playbookPath.value;
      const playbooklimitip = playbooklimitip2.value;
      const playbookName1 = playbookName.value;
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('发送WebSocket消息:', { playbook_path, playbookName1, playbooklimitip });
        socket.send(JSON.stringify({ playbook_path, playbookName1, playbooklimitip }));
      } else {
        console.error('WebSocket未连接或未就绪');
      }
    };

    const handleFileDialogOpen = async (filePath) => {
      try {
        playbookPath.value = filePath;
        const response = await ReadFile(filePath);
        if (response.content.error) {
          console.error('读取文件失败:', response.content.error);
          return;
        }
        fileContent.value = response.content;
        fileDialogVisible.value = true;
      } catch (error) {
        console.error('读取文件失败:', error);
      }
    };

    const handleFileDialogClose = () => {
      fileDialogVisible.value = false;
      fileContent.value = '';
    };

    const handleFileDialogSubmit = async () => {
      try {
        const filePath = playbookPath.value;
        const response = await SaveFile(filePath, fileContent.value);
        if (response.status.error) {
          alert("保存文件失败" + response.status.error);
          return;
        } else {
          alert(response.status);
        }
        fileDialogVisible.value = false;
        fileContent.value = '';
      } catch (error) {
        console.error('保存文件失败', error);
      }
    };

    const scrollToBottom = () => {
      if (logContainer.value) {
        logContainer.value.scrollTop = logContainer.value.scrollHeight;
      }
    };

    watch(() => outputText.value, () => {
      nextTick(scrollToBottom);
    });

    const { crudOptions } = createCrudOptions({ crudExpose, context: { handleCustomActionOpen, handleFileDialogOpen } });
    const { resetCrudOptions } = useCrud({
      crudExpose,
      crudOptions,
      context: { handleCustomActionOpen, handleFileDialogOpen },
    });

    onMounted(() => {
      crudExpose.doRefresh();
      initWebSocket();
    });

    onUnmounted(() => {
      if (socket) {
        socket.close();
      }
    });

    return {
      crudBinding,
      crudRef,
      fileDialogVisible,
      messageBoxVisible,
      activeTab,
      outputText,
      playbookPath,
      playbookName,
      logContainer,
      fileContent,
      handleCustomActionOpen,
      handleCustomActionClose,
      handleCustomActionSubmit,
      handleFileDialogOpen,
      handleFileDialogClose,
      handleFileDialogSubmit,
      scrollToBottom,
    };
  },
});
</script>

<style>
.log-container {
  max-height: 400px;
  overflow-y: auto;
}
.log-text {
  white-space: pre-wrap;
}
</style>