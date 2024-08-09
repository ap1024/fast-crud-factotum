import { CrudOptions, AddReq, DelReq, EditReq,  CrudExpose,  UserPageQuery, dict, CreateCrudOptionsRet } from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import {inject} from "vue";
import { request } from '/@/utils/service';

// 注释编号:django-vue3-admin__crud265914:代码开始行
// 功能说明:导入懒加载外键对应的crud进行复用

import it_area from "/@/views/PublicResource/area/crud";
import SuppliersTypeViewSet from "/@/views/it_mis/SuppliersTables/SuppliersTypeViewSet/crud";

// 注释编号:django-vue3-admin__crud265914:代码结束行




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
			// form: {
			// 	// col: { span: 12 },
			// 	labelWidth: '100px',
			// 	wrapper: {
			// 		is: 'el-dialog',
			// 		// width: '600px',
			// 	},
				
			// },
			columns: {


				resource_area: {
					title: '区域',
					search: {
						// disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						isTree: true,
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {
								return request({
									url: '/api/it_area/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
							}
						},
					}),
					column: {
						minWidth: 150, //最小列宽
					},
					form: {
						helper: {
							render() {
								return <div style={"color:blue"}>区域是必需要填写的</div>;
								}
							},
						rules: [
							// 表单校验规则
							{
								required: true,
								message: '必填项',
							},
						],
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: it_area,
							filterable: true,
							placeholder: '请选择',
							props: {
								props: {
									value: 'id',
									label: 'title',
								},
							},
						},
					},
				},
				suppliers_type: {
					title: '供应商归属',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						isTree: true,
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {
								return request({
									url: '/api/SuppliersTypeViewSet/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
							}
						},
					}),
					column: {
						minWidth: 150, //最小列宽
					},
					form: {
						rules: [
							// 表单校验规则
							{
								required: true,
								message: '必填项',
							},
						],
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: SuppliersTypeViewSet,
							filterable: true,
							placeholder: '请选择',
							props: {
								props: {
									value: 'id',
									label: 'title',
								},
							},
						},
					},
				},
				SuppliersBelongToType: {
					title: '供应商类型',
					type: 'dict-select',
					search: {
						show: true,   //可被搜索过滤
					},
					dict: dict({
						url: '/api/ItNetTypeViewSet/?limit=999',
						value: 'id',
						label: 'title',
						getData: async ({ url }: { url: string }) => {
							return request({
								url: url,
							}).then((ret: any) => {
								return ret.data;
								});
							},
						}),
					column: {
						minWidth: 100, //最小列宽
					},
					form: {
						helper: {
							render() {
								return <div style={"color:green"}>供应商类型是引用了网络资源表的资源类型表</div>;
								}
							},
						rules: [
							// 表单校验规则，这里配置必填项
							{
								required: true,
								message: '必填项',
							},
						],
						component:{
							filterable: true,   //配置在选择时，可过滤搜索
						},
					}
				},
				title: {
					title: '供应商描述',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '供应商描述必填' }],
						component: {
							placeholder: '请输入供应商描述',
						},
					},
				},
				name: {
					title: '联系人',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '联系人' }],
						component: {
							placeholder: '请输入联系人',
						},
					},
				},
				fixed_phone: {
					title: '固定电话',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{  pattern: /^[1-9]\d*$/, message: '此项必须为纯数字' }],
						component: {
							placeholder: '请输入固定电话',
						},
					},
				},
				mobile_phone: {
					title: '移动电话',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{  pattern: /^[1-9]\d*$/, message: '此项必须为纯数字' }],
						component: {
							placeholder: '请输入移动电话',
						},
					},
				},
				email: {
					title: '邮箱地址',
					type: 'text',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{  type: 'email', message: '必须输入邮箱地址格式' }],
						component: {
							placeholder: '请输入邮箱地址',
						},
					},
				},
				addr: {
					title: '供应商地址',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						// rules: [{ message: '供应商地址' }],
						component: {
							placeholder: '请输入供应商地址',
						},
					},
				},
				status: {
					title: '服务状态',
					search: { show: true },
					type: 'dict-radio',
					dict: dict({
						data: [
							{
								label: '是',
								value: true,
								color: 'success',
							},
							{
								label: '否',
								value: false,
								color: 'danger',
							},
						],
					}),
					form: {
						rules: [{ required: true, message: '服务状态必填' }],
						value: true,
					},
				},

				description: {
					title: '备注说明',
					type: ["textarea","colspan"],
					search: {show: false},
					column: {
						show: false
					},
					form: {
						component: {
							rows:4,   //配置一共默认占用1行的高度的
							// maxlength: 500,
							placeholder: '输入备注',
						},
					},
				},



			},

		},

	}
};

