<template>
    <div class="sub-table">
      <div v-if="id > 0" style="height: 400px; position: relative">
        <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
      </div>
      <div v-else><fs-button @click="saveMain" type="success" >保存</fs-button> <font color="green">先点击这里保存之后，便会自动弹出子表的编辑页面</font></div>
      <div><font color="green" size="4">
        <br>
        <!-- 注意:<br>
        如果更换设备，一定要到对应的设备归属上修改为新设备的信息，而旧设备可以COPY一条新数据，仍然使用旧资产编码便可。 -->
      </font></div>
    </div>
    
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, watch, ref } from "vue";
  import createCrudOptions from "./crud";
  import { useFs, useUi } from "@fast-crud/fast-crud";
  
  export default defineComponent({
    name: "SubTelephoneModelViewSetSub",
    props: {
      /**
       * 主表id
       */
      id: {
        type: Number,
        default: 0
      },
      disabled: {
        type: Boolean,
        default: false
      },
      readonly: {
        type: Boolean,
        default: false
      }
    },
    emits: ["save-main"],
    setup(props, ctx) {
      // 注释编号:django-vue3-admin__index363416:这里是拿到主表对应的对象ID之parentIdRef并把它传过去crud使用
      const parentIdRef = ref(props.id);
      
      // 注释编号:django-vue3-admin-index371416:这里是把整个props传过去crud，方便拿到里面的disabled
      const showStatus = ref(props)

      // 注释编号:django-vue3-admin-index461516:这里要把showStatus塞进context里面
      const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context: { parentIdRef, showStatus } });   
      const { ui } = useUi();
  
      let formItemContext = ui.formItem.injectFormItemContext();
  
      function emit(data: any) {
        // console.log("emit:", data);
        formItemContext.onBlur();
        formItemContext.onChange();
      }
  

      function saveMain() {
        ctx.emit("save-main", true);
      }
  
      // 注释编号:django-vue3-admin__index323616:watch监听父ID的变化,比如最开始新增对象,然后保存之后,转为编辑页面,这时就必须监听拿到父ID再把他转给crud使用 
      watch(
        () => {
          return props.id;  
        },
        (value: any) => {
          if (value > 0) {
            crudExpose.setSearchFormData({
              form: { parentId: value },
              mergeForm: true,
              triggerSearch: true
            });
            parentIdRef.value = value;
          }
        },
        {
          immediate: true  //表示在初始化的时候就立刻执行一次回调函数
        }
      );
  
      // 注释编号:django-vue3-admin__index503516:这里配置加载页面,并且对加载页面watch监听进行特殊处理
      onMounted(() => {
        crudExpose.doRefresh();
        watch(
          () => {
            return props.disabled || props.readonly;    //返回任何一个结果都可以
          },
          (value) => {
            if (value) {    // 如果props.disabled || props.readonly有一个为true就操作如下
              crudBinding.value.table.editable.readonly = true;
              crudBinding.value.actionbar.buttons.addRow.show = false;
              crudBinding.value.rowHandle.show = false;
            } else {   // 如果props.disabled || props.readonly都返回false就执行如
              crudBinding.value.table.editable.readonly = false;
              crudBinding.value.actionbar.buttons.addRow.show = true;
              crudBinding.value.rowHandle.show = true;
            }
          },
          {
            immediate: true  //表示在初始化的时候就立刻执行一次回调函数
          }
        );
      });
  
      return {
        crudBinding,
        crudRef,
        saveMain,
      };
    }
  });
  </script>
  

<!-- 注释编号: django-vue3-admin-index572117:这里是配置table单选中行的背景颜色-->
<style>
   tr.current-row > td {  
    background-color: #c2e4f0 !important;  
  }
</style>