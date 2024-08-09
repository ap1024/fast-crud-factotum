import { CrudOptions, AddReq, DelReq, EditReq,  CrudExpose,  UserPageQuery, dict} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import {inject} from "vue";
import { request } from '/@/utils/service';



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
				labelWidth: '100px',
				wrapper: {
					is: 'el-dialog',
					width: '600px',
				},
				
			},
			columns: {



				title: {
					title: '供应商类型',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '供应商类型名称必填' }],
						component: {
							placeholder: '请输入供应商类型',
						},
					},
				},





			},

		},
	};
};
