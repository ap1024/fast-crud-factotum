import { AddReq, DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';


import it_area from "/@/views/PublicResource/area/crud";
import department from "/@/views/PublicResource/department/crud";
import  organization  from "/@/views/PublicResource/organization/crud";


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
						add:{
							show:false
						},
						export:{
                            click(){
                                return exportRequest(crudExpose.getSearchFormData())
                            }
					}
				}
			},
			rowHandle:{

				buttons:{
					edit:{
						show:false
					},
					copy:{
						show:false
					},
					remove:{
						show:false
					}
				}
			},
			columns: {
				_index: {
					title: '序号',
					form: { show: false },
					column: {
						type: 'index',
						align: 'center',
						width: '70px',
						columnSetDisabled: true, //禁止在列设置中选择
						fixed:true,
					},
				},
				id: {
					title: 'ID',
					type: 'number',
					column: { show: false },
					search: { show: false },
					form: { show: false },
				},
				company: {
					title: '公司',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						// 
						url: '/api/company/?limit=999',
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
						// minWidth: 100, //最小列宽
						fixed:true,
					},
				},
				area: {
					title: '区域',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						// prototype: true,  //这里配置每一次都要进行请求，这样可以解决mysql视图中关系显示的外键字段问题,但是配置这个之后,他同步也无法显示出来title
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {   //element plus的一个bug,这里必须要对values的值进行判断非""
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
						minWidth: 100, //最小列宽
						fixed:true,
					},
					form: {
						show: false,
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: it_area,
						},
					},
				},
				department: {
					title: '部门',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						// prototype: true,  //这里配置每一次都要进行请求，这样可以解决mysql视图中关系显示的外键字段问题,但是配置这个之后,他同步也无法显示出来title
						// 
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {   //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/department/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
						} 

					}
					}),
					column: {
						minWidth: 100, //最小列宽
						fixed:true,
					},
					form: {

						show: false,
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: department,
						},
					},
				},
				TelUser: {
					title: '号码使用人',
					search: {
						order:0, //默认是1，所以0是排在最前面的
						show: true,
					},
					type: 'table-select',
					dict: dict({
						value: 'id',
						label: 'use',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {   //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/organization/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
							}
						}
					}),
					column: {
						minWidth: 150, //最小列宽
						fixed:true,
					},
					form: {
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: organization,
							filterable: true,
							placeholder: '请选择',
							props: {
								props: {
									value: 'id',
									label: 'use',
								},
							},
						},
					},
				},
				TelRealPerson: {
					title: '号码实名认证人',
					search: {
						show: true,
					},
					type: 'table-select',
					dict: dict({
						value: 'id',
						label: 'use',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {   //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/organization/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
							}
						}
					}),
					column: {
						minWidth: 150, //最小列宽
						fixed:true,
					},
					form: {
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: organization,
							filterable: true,
							placeholder: '请选择',
							props: {
								props: {
									value: 'id',
									label: 'use',
								},
							},
						},
					},
				},
				realDepartment: {
					title: '号码管理部门',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						// prototype: true,  //这里配置每一次都要进行请求，这样可以解决mysql视图中关系显示的外键字段问题,但是配置这个之后,他同步也无法显示出来title
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {   //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/department/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
						} 

					}
					}),
					column: {
						minWidth: 100, //最小列宽
						fixed:true,
					},
					form: {

						show: false,
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: department,
						},
					},
				},
				parentId: {
					title: '关联电话号码',
					type: 'dict-select',
					search: { 
						component: {
							// placeholder: '请输入关联电话号码',
							clearable: true,
							filterable:true,
						},
						show: true
					},
					dict: dict({
						url: '/api/TelephoneModelViewSet/?limit=999',
						value: 'id',
						label: 'TelNumber',
						getData: async ({ url }: { url: string }) => {
						return request({
							url: url,
						}).then((ret: any) => {
							return ret.data;
							});
						},
						}),
					column: {
						minWidth: 80, //最小列宽
						sortable: 'custom',
					},

				},
				sortIndex: {
					title: '子表排序索引',
					type: 'input',
					// show: false,
					column: {
						// minWidth: 120,
						sortable: 'custom',
					},
				},
				accesstype: {
					title: '接入类型',
					type: 'dict-select',
					search: { 
						component: {
							// placeholder: '请输入关联电话号码',
							clearable: true,
							filterable:true,
						},
						show: true
					},
					dict: dict({
						url: '/api/lineAccessTypeModelViewSet/?limit=999',
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
						minWidth: 80, //最小列宽

						},
				},
				accessInfo: {
					title: '接入信息',
					type: 'input',
					search: { 
						component: {
							// placeholder: '请输入关联电话号码',
							clearable: true,
							filterable:true,
						},
						show: true
					},
					column: {
						// minWidth: 120,
						sortable: 'custom',
					},

				},
				url: {
					title: '接入类型之URL',
					type: 'input',
					// show: false,
					column: {
						// minWidth: 120,
						sortable: 'custom',
					},
				},
				label: {
					title: '接入类型之Label',
					type: 'input',
					// show: false,
					column: {
						// minWidth: 120,
						sortable: 'custom',
					},
				},
				port_direction: {
					title: '端口方向',
					type: 'dict-select',
					dict: dict({
						value: 'dictNum',
						label: 'dictName',
						getData: async () => {
							const curId = await request({
								url: '/api/globalDictModelViewSet/?dictName=lineTagPortDirection',
							}).then((ret: any) => {
								return ret.data[0].id;
							});
							return request({
								url: `/api/globalDictModelViewSet/?limit=999&dictMark=${curId}`,
							}).then((ret: any) => {
								return ret.data;
							});
						},
					}),
					form: {
						component: {
							span: 12,
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				device_port: {
					title: '端口',
					type: 'dict-select',
					dict: dict({
					url: '/api/DevicePortModelViewSet/?limit=999',
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
						minWidth: 80, //最小列宽
						sortable: 'custom',
					},
					form:{
					// rules: [
					//   // 表单校验规则
					//   {
					//     required: true,
					//     message: '必填项',
					//   },
					// ],
					component:{
						filterable: true,
					},
					},
				},

			},

		},
	};
}
