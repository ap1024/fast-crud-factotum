<template>
  <fs-page class="PageFeatureSearchMulti">
    <fs-crud ref="crudRef" v-bind="crudBinding">
      <template #cell_url="scope">
        <el-tag size="small">{{ scope.row.url }}</el-tag>
      </template>
    </fs-crud>

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

const crudRef = ref();
const crudBinding = ref();
const { crudExpose } = useExpose({ crudRef, crudBinding });

export default defineComponent({
  name: 'AdhocModelViewSet',
  setup() {

    const messageBoxVisible = ref(false);
    const activeTab = ref('log');
    const outputText = ref('');
    const moduleName = ref('');
    const is_root_active2 = ref('');
    const ParamsName = ref('');
    const adhoclimitip2 = ref('');
    const logContainer = ref(null);
    let socket: WebSocket | null = null;

    const initWebSocket = () => {
      if (socket) {
        socket.close();
      }
      socket = new WebSocket('ws://127.0.0.1:8000/ansible_adhoc/');

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
      moduleName.value = row.module;
      ParamsName.value = row.params;
      is_root_active2.value = row.is_root_active;
      adhoclimitip2.value = row.tempip;
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
      const module = moduleName.value;
      const playbooklimitip = adhoclimitip2.value;
      const ParamsName1 = ParamsName.value;
      const is_root_active = is_root_active2.value;
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('发送WebSocket消息:', { is_root_active,ParamsName1, playbooklimitip,module });
        socket.send(JSON.stringify({ is_root_active,ParamsName1, playbooklimitip , module }));
      } else {
        console.error('WebSocket未连接或未就绪');
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

    const { crudOptions } = createCrudOptions({ crudExpose, context: { handleCustomActionOpen } });
    const { resetCrudOptions } = useCrud({
      crudExpose,
      crudOptions,
      context: { handleCustomActionOpen },
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
      messageBoxVisible,
      activeTab,
      outputText,
      ParamsName,
      is_root_active2,
      moduleName,
      logContainer,
      handleCustomActionOpen,
      handleCustomActionClose,
      handleCustomActionSubmit,
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