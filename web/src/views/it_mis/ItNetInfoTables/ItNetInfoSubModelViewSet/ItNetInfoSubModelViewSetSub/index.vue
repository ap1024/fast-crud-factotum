<template>
    <div class="sub-table">
      <div v-if="id > 0" style="height: 400px; position: relative">
        <fs-crud ref="crudRef" v-bind="crudBinding"> </fs-crud>
      </div>
      <div v-else><fs-button @click="saveMain" type="success" >保存</fs-button> <font color="green">先点击这里保存之后，便会自动弹出子表的编辑页面</font></div>
      <div><font color="green" size="4">
        <br>
        注意:<br>
        1.不能直接删除父对象,因为这样还要手动清空数据,再把所子表数据对应上来,非常麻烦<br>
        2.建议要换新设备时,可以先把copy一份旧设备的数据进行开成一个旧设备的ID或序列号<br>
        3.而新设备直接在的旧ID的基础上进行录入便可<br>
        4.通过以上配置,就可以不需要对光纤网络重新配置关联至设备了.<br>
      </font></div>
    </div>
    
  </template>
  
  <script lang="ts">
  import { defineComponent, onMounted, watch, ref } from "vue";
  import createCrudOptions from "./crud";
  import { useFs, useUi } from "@fast-crud/fast-crud";
  
  export default defineComponent({
    name: "ItNetInfoSubModelViewSetSub",
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
      const { crudBinding, crudRef, crudExpose } = useFs({ createCrudOptions, context: { parentIdRef } });
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
  