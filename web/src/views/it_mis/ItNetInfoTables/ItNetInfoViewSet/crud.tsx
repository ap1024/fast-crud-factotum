import { AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
import {inject} from "vue";
import { useRouter } from "vue-router";


// 注释编号:django-vue3-admin__crud083114:代码开始行
// 功能说明:导入懒加载复用模块

import SuppliersViewSet  from "/@/views/it_mis/SuppliersTables/SuppliersViewSet/crud";
import ItNetTypeViewSet from "/@/views/it_mis/ItNetInfoTables/ItNetTypeViewSet/crud";
import NetSpeedViewSet from "/@/views/it_mis/ItNetInfoTables/NetSpeedViewSet/crud";
import ItResourceViewSet from "/@/views/it_mis/ItResource/crud";
import it_area from "/@/views/PublicResource/area/crud";
import company from "/@/views/PublicResource/company/crud";
import department from "/@/views/PublicResource/department/crud";


// 注释编号:django-vue3-admin__crud083114:代码结束行


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


	
	const router = useRouter();

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
			search: {
				container: {
					layout: "multi-line"
				},
				col: {
					span: 4
				},
				options: {
					labelWidth: "100px"
				}
			},
			form: {
				col: { span: 12 },	//配置成一行两个元素
				labelPosition: "left", 
				labelWidth: "auto", //配置成lable的宽为自动
				requireAsteriskPosition:"right", //星号的位置
				row:{ gutter: 20},  //配置同一行内，两个元素之间空隙20px
			},
			columns: {
				area: {
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
						}
					}),
					column: {
						minWidth: 150, //最小列宽
					},
					form: {
						// helper: {
						// 	render() {
						// 		return <div style={"color:blue"}>区域是必需要填写的</div>;
						// 		}
						// 	},
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
				company: {
					title: '公司',
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
									url: '/api/company/' + "getbyIds/",
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
							createCrudOptions: company,
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

				department: {
					title: '部门',
					search: {
						// disabled: true,
						show: true
					},
					type: 'table-select',
					dict: dict({
						isTree: true,
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {
								return request({
									url: '/api/department/' + "getbyIds/",
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
							createCrudOptions: department,
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
				title: {
					title: '资源名称',
					type: 'input',
					search: { 
						show: true, 
						order: 0,
						col:{span:8},
						component: {
							placeholder: '可搜索资源名称,用户名及IPV4地址',
							clearable: true,
						},	
						
					},
					column: {
						minWidth: 250,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '资源名称必填' }],
						component: {
							placeholder: '请输入资源名称',

						},
					},
				},

				suppliers: {
					title: '供应商',
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
									url: '/api/SuppliersViewSet/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
							}
						},
					}),
					column: {
						minWidth: 250, //最小列宽
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
							createCrudOptions: SuppliersViewSet,
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
				type: {
					title: '资源类型',
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
									url: '/api/ItNetTypeViewSet/' + "getbyIds/",
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
							createCrudOptions: ItNetTypeViewSet,
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
				netspeed: {
					title: '网络速率',
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
									url: '/api/NetSpeedViewSet/' + "getbyIds/",
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
							createCrudOptions: NetSpeedViewSet,
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
				code: {
					title: '编码/编号',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 160,
						sortable: 'custom',
					},
					form: {
						component: {
							placeholder: '请输入编码/编号',
						},
					},
				},
				user: {
					title: '使用帐号',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 160,
						sortable: 'custom',
					},
					form: {
						component: {
							placeholder: '请输入使用帐号',
						},
					},
				},
				password: {
					title: '使用密码',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 160,
						sortable: 'custom',
					},
					form: {
						component: {
							placeholder: '请输入使用帐号',
						},
					},
				},
				ipv4:{
					title: "ipv4地址",
					type: 'ip_input',
					column: {
						minWidth: 160,
						sortable: 'custom',
					},

				},
				submask:{
					title: "子网掩码",
					type: 'ip_input',
					column: {
						minWidth: 160,
						sortable: 'custom',
					},

				},
				gateway:{
					title: "网关地址",
					type: 'ip_input',
					column: {
						minWidth: 160,
						sortable: 'custom',
					},

				},
				DNS1:{
					title: "DNS1地址",
					type: 'ip_input',
					column: {
						minWidth: 160,
						sortable: 'custom',
					},

				},
				DNS2:{
					title: "DNS2地址",
					type: 'ip_input',
					column: {
						minWidth: 160,
						sortable: 'custom',
					},

				},
				use_status: {
					title: '使用状态',
					type: 'dict-select',
					dict: dict({
						value: 'dictNum',
						label: 'dictName', 
						getData: async ({ url }: { url: string }) => {
							const curId = await request({
								url: '/api/globalDictModelViewSet/?dictName=ItNetInfo_use_status_choices',
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
					readonly:true,  // 开启只读模式
					form: {
						value:2,
						clearable: false,
						helper:'这个字段默认未用状态，如果被IT资源所引用就会自动修改为在用状态',
						component: {
							span: 12,
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},
				used_by: {
					title: '使用者',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					readonly:true,
					dict: dict({
						isTree: true,
						value: 'id',
						label: 'it_use_id', //这个it_use_id字段是后端单独序列化出来使用的，原来表没有的
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {
								const fieldList = ["id", "it_use_id"]
								return request({
									url: '/api/ItResourceViewSet/' + "getbyIds/",
									method: "post",
									data: { values, fieldList },
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
						suffixRender({value}) {
							//这里把当前的value传进去
							function goto({value}: {value: any}) {
								if (!value){
									// 这里判断当选项没有值是，用户又点了跳转按钮，那说明是需要新增对象
									value =0
								}
								// 这里是跳转至相应的路由，把value给到id
								//这里整个配置主要name:'ItResourceSetNewPageEdit'便可
								router.push({name:'ItResourceSetNewPageEdit',params:{id:value}})
							}
							return (
								// 这里配置一个跳转的按钮及引用函数
								<el-button-group style={"padding-left:5px"}>
								<fs-button color="#e1f3d8" style="color: #67C23A" onClick={() => goto({value})} >跳转</fs-button>
								</el-button-group>
							);
						},
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: ItResourceViewSet,
							filterable: true,
							placeholder: '请选择',
							props: {
								props: {
									value: 'id',
									label: 'it_use_id',//这个it_use_id字段是后端单独序列化出来使用的，原来表没有的
								},
							},
							// disabled: true,   //禁用状态
						},
					},
				},
				used_by_port: {
					title: '使用设备的端口',
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
						minWidth: 140, //最小列宽
					},
					form:{
						component:{disabled: true}  //禁用状态
					}
				},
				other_description: {
					title: '其它',
					type: "input",
					search: {show: false},
					form: {
						component:{disabled: true}  //禁用状态
					},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
				},

				description: {
					title: '备注',
					type: ["textarea","colspan"],
					search: {show: false},
					form: {
						component: {
							rows:8,   //配置一共默认占用8行的高度
							maxlength: 500,
							placeholder: '输入备注',
						},
					},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
				},

			},

		},
	};
};
