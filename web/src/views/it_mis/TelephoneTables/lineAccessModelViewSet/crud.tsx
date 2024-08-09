import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';


//此处为crudOptions配置
export default function ({ crudExpose}: { crudExpose: CrudExpose}): CreateCrudOptionsRet {
	const pageRequest = async (query: any) => {
		return await api.GetList(query);
	};
	const editRequest = async ({ form, row }: EditReq) => {
		if (row.id) {  
			form.id = row.id;
		}
		return await api.UpdateObj(form);
	};
	const delRequest = async ({ row }: DelReq) => {
		return await api.DelObj(row.id);
	};
	const addRequest = async ({ form }: AddReq) => {
		return await api.AddObj(form);
	};

    const exportRequest = async (query: UserPageQuery) => {
		return await api.exportData(query)
	};
	

	
	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			actionbar: {
				buttons: {
						export:{
                            click(){
                                return exportRequest(crudExpose.getSearchFormData())
                            }
					}
				}
			},
			form: {
				col: { span: 24 },
				// labelWidth: '100px',
				wrapper: {
					is: 'el-dialog',
					// width: '600px',
				},
				
			},
			columns: {

				title: {
					title: '线路接入信息',
					type: 'input',
					search: { show: true},
					column: {
						// minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '线路接入信息必填' }],
						component: {
							placeholder: '请输入线路接入信息',
						},

						bottomRender({ value }) {
							return <el-tag type="success" size='large' style="font-size: 16px;">线路接入信息，比如1号街线+黄色，2号街线+绿色，这样写</el-tag>;
						},
					},
				},


			},

		},
	};
};
