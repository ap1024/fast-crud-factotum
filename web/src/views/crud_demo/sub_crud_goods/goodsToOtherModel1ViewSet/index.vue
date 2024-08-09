<template>
	<fs-page class="PageFeatureSearchMulti">
		<fs-crud ref="crudRef" v-bind="crudBinding">
			<template #cell_url="scope">
				<el-tag size="small">{{ scope.row.url }}</el-tag>
			</template>
		</fs-crud>
		
	</fs-page>
</template>

<script lang="ts" >
import { defineComponent, ref, onMounted } from 'vue';
import { useFs} from '@fast-crud/fast-crud';
import  createCrudOptions from './crud';
import * as api from './api';
import _ from 'lodash-es';

	export default defineComponent({
		name:"goodsToOtherModel1ViewSet",
		setup() {

	const { crudBinding, crudRef, crudExpose, resetCrudOptions } = useFs({ createCrudOptions});

	// 页面打开后获取列表数据
	onMounted(() => {
		crudExpose.doRefresh();
	});

	return {
			crudBinding,
			crudRef,

		};
	}

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