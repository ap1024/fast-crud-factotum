<template>
	<fs-page class="PageFeatureSearchMulti">
		<fs-crud ref="crudRef" v-bind="crudBinding">
			<template #cell_url="scope">
				<el-tag size="small">{{ scope.row.url }}</el-tag>
			</template>
			<!-- 注释编号:django-vue3-admin__index395715:码开始行-->
			<!-- 功能说明:配置导入的组件进页面，这里要注意有个路由要修改api/crud_demo/-->
			<template #actionbar-right>
              <importExcel  api="api/crud_demo/" >导入 </importExcel>
            </template>
			<!-- 注释编号:django-vue3-admin__index395715:代码结束行-->
		</fs-crud>
		
	</fs-page>
</template>
<!-- 注释编号:django-vue3-admin__index052211:这里要配置name="demo"的名称-->
<script lang="ts" setup name="demogoodstype">
import { ref, onMounted } from 'vue';
import { useExpose, useCrud} from '@fast-crud/fast-crud';
import { createCrudOptions } from './crud';

import * as api from './api';
import _ from 'lodash-es';

// 注释编号:django-vue3-admin__index525615:配置导入组件import


const rolePermission = ref();
defineExpose(rolePermission);
// crud组件的ref
const crudRef = ref();
// crud 配置的ref
const crudBinding = ref();
// 暴露的方法
const { crudExpose } = useExpose({ crudRef, crudBinding });
// 你的crud配置
const { crudOptions } = createCrudOptions({ crudExpose, rolePermission });
// 初始化crud配置
const { resetCrudOptions } = useCrud({ crudExpose, crudOptions });
// 你可以调用此方法，重新初始化crud配置
// resetCrudOptions(options)

// 页面打开后获取列表数据
onMounted(() => {
	crudExpose.doRefresh();
});
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