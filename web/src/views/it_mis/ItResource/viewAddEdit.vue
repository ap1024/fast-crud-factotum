<template>
  <fs-page>
    <template #header>
      <div style="color: rgb(228, 80, 80);" class="title">对象新增、查看、编辑综合页面</div>
    </template>
    <!-- 注释编号:workspace.json__edit453916:码开始行-->
    <!-- 功能说明:这里实现在预览状态或编辑状态直接切换至增加状态，当然他同时还要切按回原来的状态，这里如果点进来就是新增需求id=0时，那他是不显示的-->
    <div style="margin-top: 20px" class="p-5">
    <el-switch
    v-model="addToggleShowValue"
    v-if="idNum" 
    @click="addToggleButton"
    size="large"
    active-text="切换成新增对象"
    inactive-text="切换回原状态"
  />

    </div>
    <!-- 注释编号:workspace.json__edit453916:代码结束行-->



    <!-- 注释编号:workspace.json__edit463716:码开始行-->
    <!-- 功能说明:这里主体呈现form的地方，也带保存按钮及取消按钮-->
    <div class="p-5">
      <fs-form  ref="formRef" v-bind="formOptions" />
      <div style="margin-top: 10px">
        <fs-button  @click="closeWin" size="large" >取消</fs-button>
        <fs-button  v-if="formRef"  :disabled="SaveShowButton" @click="formRef.submit" type="primary" size="large" >保存</fs-button>
        <!-- 这里v-if="formRef"是必须要有的,不能修改为别的,不然后面的@click="formRef.submit"拿不到submit属性 -->
    </div>
      <!-- 注释编号:workspace.json__edit463716:代码结束行-->


      <!-- 注释编号:workspace.json__edit423616:码开始行-->
      <!-- 功能说明:这里是专门写了一个用于切换上面保存按钮的呈现与关闭的切换开关，这里如果点进来就是新增需求id=0时，那他是不显示的-->
      <div style="margin-top: 20px">
        <el-switch
        v-model="viewToggleEditshowValue"
        v-if="idNum" 
        size="large"
        @click="viewToggleEditButton"
        class="ml-2"
        inline-prompt
        style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949;"
        active-text="点击切换预览"
        inactive-text="点击启用编辑"
      />
      </div>
      <!-- 注释编号:workspace.json__edit423616:代码结束行-->
      
    </div>
    
  </fs-page>
</template>

<script lang="ts" >
import { useRoute } from "vue-router";
import { onMounted, ref,getCurrentInstance, defineComponent} from "vue";
import createCrudOptions  from './crud';
import * as api from "./api";
  // mittBus是vue-next-admin中用来操作tag标签的功能
import mittBus from '/@/utils/mitt';
import { useFs } from '@fast-crud/fast-crud';
import _ from 'lodash-es';

export default defineComponent({    //这里配置defineComponent
    name: "ItResourceSetNewPageEdit",   //把name放在这里进行配置了
    setup() {   //这里配置了setup()

    const { crudBinding, crudRef, crudExpose, resetCrudOptions } = useFs({ createCrudOptions});


    const formRef = ref();  //这个属性为组件实例分配了一个引用名称 "formRef"。稍后可以使用这个引用来访问组件的属性和方法，使用 Vue 的 API。
    const formOptions = ref(); //将对象 formOptions 的属性绑定到组件。formOptions 可能包含配置或数据，用于表单的正确功能。

    const route = useRoute();
    const id: any = route.params.id;  //拿到传进来的id
    const idNum = ref(true) //这个是配合id=0时，新增需求时，不显示两个切换关闭

    const SaveShowButton = ref(true); //保存按钮的显示与隐藏操作参数

    const viewToggleEditshowValue = ref(false); //预览及编辑状态的切换信号值

    const addToggleShowValue = ref(false);  //切换新增页面或切换回原来的页面的状态切换信号值

    const oldData: any = ref(null); //这里为了存储当前form里面的旧值，主要是配合开关点击事件addToggleButton使用
    
    const oldShowButtonValue: any = ref(null) //这个是为了存储保存按钮旧的状态SaveShowButton.value
    

    if (id==="0"){
      // 这里是判断当页面是由id=0新增需求点进来里时，那些切换按钮及保存按钮的具体做法
      idNum.value = false //两个切换按钮此时要直接隐藏起来
      SaveShowButton.value = false //保存按钮此时必须显示
    }

 
    // 这里对保存按钮显示与隐藏状态进行判断
    const showButtonValue =() => {
      if (!SaveShowButton.value){
        formOptions.value = crudBinding.value.editForm;
      } else {
        formOptions.value = crudBinding.value.viewForm;
      }
    }

    /* 注释编号:workspace.json__viewAddEdit07500714:代码开始行*/
    /* 功能说明:这里配置点击预览与编辑的切换动作*/
    const viewToggleEditButton = () => {
      SaveShowButton.value = !SaveShowButton.value;
      oldShowButtonValue.value = !oldShowButtonValue.value
      showButtonValue();
      submitMethod(); //因addForm或viewFrom\editForm进行切换,这里必须重新调用保存提交数据的方法
    };
    /* 注释编号:workspace.json__viewAddEdit500714:代码结束行*/



    /* 注释编号:workspace.json__viewAddEdit09050914:代码开始行*/
    /* 功能说明:这里点击新增按钮时重置数据,并转为新增介面,把无关按钮*/

    const addToggleButton = ()=> {
      // 这里拿到点击当前按钮前保存按钮的显示情况的值SaveShowButton.value,并进行深拷贝,赋值给一个新变量
      if (oldShowButtonValue.value === null){
        oldShowButtonValue.value = JSON.parse(JSON.stringify(SaveShowButton.value));
      }

      if (oldData.value === null){
        // 这里是为了只拿到初始化点击进来的第一次的值
        const data = formRef.value.getFormData();
        oldData.value = JSON.parse(JSON.stringify(data));  //深拷贝数据
      }
      
      if (addToggleShowValue.value) {
        // 这里进行重置form显示信息，并且切换回增状态

        //这里是点击启用新增功能
        formRef.value.reset();
        formOptions.value = crudBinding.value.addForm;
        SaveShowButton.value = false //进入新增状态必须启用保存按钮
        submitMethod(); //因addForm或viewFrom\editForm进行切换,这里必须重新调用保存提交数据的方法

      } else {
        //这里是切换回去原来的状态
        formRef.value.setFormData(oldData.value);
        if (oldShowButtonValue.value) {
          SaveShowButton.value = true
        }else {
          SaveShowButton.value = false
        }
        showButtonValue(); //根据情况展示相应Form的需求
        submitMethod(); //因addForm或viewFrom\editForm进行切换,这里必须重新调用保存提交数据的方法

      } 

    };
    /* 注释编号:workspace.json__viewAddEdit09050914:代码结束行*/



    const closeWin = () => {
      // 点击取消关闭当前的tag标签页，这时vue-next-admin的功能
      //参考https://lyt-top.gitee.io/vue-next-admin-doc-preview/config/tagsView/#_2-%E5%85%B3%E9%97%AD-%E5%8F%82%E6%95%B0-1
      mittBus.emit(
              "onCurrentContextmenuClick",
              Object.assign({}, { contextMenuClickId: 1, ...route })
          );
    };


    /* 注释编号:workspace.json__edit56125616:代码开始行*/
    /* 功能说明:*/
    if (id && id == "0") {
      //编辑表单
      formOptions.value = crudBinding.value.addForm;
    } else {
      formOptions.value = crudBinding.value.viewForm;
    }
    /* 注释编号:workspace.json__edit125616:代码结束行*/



    /* 注释编号:workspace.json__edit55075516:代码开始行*/
    /* 功能说明:这里创建一个提交保存的方法,方便后面调用,对点击保存按钮做处理，1是保存数据，2是关闭当前tag标签页*/

    const submitMethod = ()=>{
      const doSubmit = formOptions.value.doSubmit;
      formOptions.value.doSubmit = (context: any) => {
        // console.log("111111116666666666", context)
         doSubmit(context); // 这里提交保存数据
        // 如下便是关闭当前的tag标签页
        //参考https://lyt-top.gitee.io/vue-next-admin-doc-preview/config/tagsView/#_2-%E5%85%B3%E9%97%AD-%E5%8F%82%E6%95%B0-1
        mittBus.emit(
                "onCurrentContextmenuClick",
                Object.assign({}, { contextMenuClickId: 1, ...route })
            );
    };
      
    }
    submitMethod(); //这里调用保存提交数据的方法

    /* 注释编号:workspace.json__edit075516:代码结束行*/

 

    /* 注释编号:workspace.json__edit00300017:代码开始行*/
    /* 功能说明:如果id有值且不为0说明是想预览或者编辑对象，这时就必须通过下面的代码进行获取对象呈现于form内*/

    if (id && id !== "0") {
    const getDetail = async (id: any) => {
      return await api.GetObj(id);
    };

    onMounted(async () => {
      if (id) {
        //远程获取记录详情
        const detail = await getDetail(id);
        //这里要注意了，有些文档是直接给detail，但是我这里是配了detail['data']，因为查看了一个detail对象，他包括了一些不必须要的响应数据，而detail['data']才刚好是符合需求的数据
        formRef.value.setFormData(detail['data']);
      }
    });
    }
    /* 注释编号:workspace.json__edit300017:代码结束行*/


    // 页面打开后获取列表数据
    onMounted(() => {
      crudExpose.doRefresh();
    });
    return {  
 //增加了return把需要给上面<template>内调用的<fs-crud ref="crudRef" v-bind="crudBinding">
        crudBinding,
        crudRef,
        addToggleShowValue,
        idNum,
        addToggleButton,
        formOptions,
        closeWin,
        formRef,
        SaveShowButton,
        viewToggleEditshowValue,
        viewToggleEditButton,
      };
    } 	//这里关闭setup()
  });  //关闭defineComponent

</script>