<template>
	<fs-page class="PageFeatureSearchMulti">
		<fs-crud ref="crudRef" v-bind="crudBinding">
			<template #cell_url="scope">
				<el-tag size="small">{{ scope.row.url }}</el-tag>
			</template>
			<!-- 注释编号:django-vue3-admin__index16221618:码开始行-->
			<!-- 功能说明:配置导入的组件进页面，这里要注意有个路由要修改当前的api-->
			<!-- <template #actionbar-right>
				<importExcel  api="api/it_area/" >导入 </importExcel>
			</template> -->
			<!-- 注释编号:django-vue3-admin__index16221618:代码结束行-->
		</fs-crud>
		
	</fs-page>
</template>

<script lang="ts">
import { ref, onMounted, getCurrentInstance, defineComponent} from 'vue';
import { useFs } from '@fast-crud/fast-crud';
import createCrudOptions from './crud';

/* 注释编号:django-vue3-admin-index04010410:代码开始行*/
/* 功能说明:导入两个用于权限控制的组件*/
import { GetPermission } from './api';
import {handleColumnPermission} from "/@/utils/columnPermission";
/* 注释编号:django-vue3-admin-index010410:代码结束行*/

import _ from 'lodash-es';
// 注释编号:django-vue3-admin__index131718:配置导入组件import


export default defineComponent({
	name: "it_area",   //把name放在这里进行配置了
    setup() {   //这里配置了setup()

		// 注释编号:django-vue3-admin-index190616:代码开始行
		// 功能说明:这里拿到当前的name名称，并把它塞进context里面，并传出去给crud或者setting初始化使用
		
		const instance = getCurrentInstance();

		const context: any = {
			componentName: instance?.type.name
		};

		// 注释编号:django-vue3-admin-index390610:配置useFs，拿到crudOptions及resetCrudOptions
		const {crudBinding, crudRef, crudExpose,crudOptions,resetCrudOptions} = useFs({createCrudOptions, context});
   

		// 注释编号:django-vue3-admin-index190616:代码结束行

		// 页面打开后获取列表数据
		onMounted(async () => {
			// 注释编号:django-vue3-admin-index160710:代码开始行
			// 功能说明:对于crudOptions进行重新整理，呈现出只有相应权限的列，然后利用resetCrudOptions进行重置CrudOptions
			// 设置列权限
			const newOptions = await handleColumnPermission(GetPermission,crudOptions)	
			//重置crudBinding
			resetCrudOptions(newOptions);
			// 注释编号:django-vue3-admin-index160710:代码结束行
			
			crudExpose.doRefresh();
		});
		return {  
		//增加了return把需要给上面<template>内调用的<fs-crud ref="crudRef" v-bind="crudBinding">
				crudBinding,
				crudRef,

			};
    } 	//这里关闭setup()
});  //关闭defineComponent
</script>

<style lang="less">
  .PageFeatureSearchMulti {
    .fs-search-multi-line-buttons {
      position: absolute;
      bottom: -38px;
      right: 226px;
    }
  }
</style>
