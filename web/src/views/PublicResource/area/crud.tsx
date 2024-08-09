import { AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery, CreateCrudOptionsRet } from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { dictionary } from '/@/utils/dictionary';
import {inject} from "vue";


import {auth} from '/@/utils/authFunction'



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

				// 注释编号:django-vue3-admin__crud352915:代码开始行
                // 功能说明:这里配置前页面显示的form表单配置及column列配置
                title: {
					title: '区域',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '区域名称必填' }],
						component: {
							placeholder: '请输入区域名称',
						},
					},
				},
				AreaNum: {
					title: '区号',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
						// order:-980,
					},
					form: {
						rules: [
							// 表单校验规则，这里配置必填项
							{
								required: true,
								message: '必填项',
								pattern: /^[0-9]\d*$/,
							},
						],
						helper: "必须填写纯数字",
						component: {
							placeholder: '请输入号码区号',
						},
					},
				},
                // 注释编号:django-vue3-admin__crud352915:代码结束行
                



			},
		},
	};
};
