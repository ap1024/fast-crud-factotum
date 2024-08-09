/* eslint-disable no-mixed-spaces-and-tabs */
import { CrudOptions, AddReq, DelReq, EditReq, dict, compute, UserPageQuery, CreateCrudOptionsProps, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
import { useRouter } from "vue-router";


// import it_area from "/@/views/PublicResource/area/crud";
// import department from "/@/views/PublicResource/department/crud";
import  organization  from "/@/views/PublicResource/organization/crud";



import subTableComponent from "/@/views/it_mis/TelephoneTables/SubTelephoneModelViewSetSub/index.vue";


//此处为crudOptions配置
export default function (object: CreateCrudOptionsProps): CreateCrudOptionsRet {


	const { crudBinding, crudRef } = object.crudExpose;
	const { crudExpose } = object;

	const pageRequest = async (query: any) => {
		return await api.GetList(query);
	};
	const editRequest = async ({ form, row }: EditReq) => {
		if (row.id) {   //这里一定要判断row.id是否存在，存在才能form.id = row.id，要不会出现问题的
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

	//路由初始化
	const router = useRouter();




	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			// 这个search是配置多行搜索配置的
			search: {
				container: {
					layout: "multi-line"
				},
				col: {
					span: 4  //一行是24，而这里配置每一个对象占用4，就说明每一行有6个对象
				},
				// options: {
				// 	labelWidth: "50px"
				// }
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

				// 功能说明:这里设置form的宽度及一行几条数据
				col: { span: 12 },
				// labelWidth: '100px',
				wrapper: {
					is: 'el-dialog',
					width: '1200px',  //弹窗宽度
				},

				group: {
					groups: {
					base: {  //分组key，可随意命名，不重复便可
						// 注释编号:django-vue3-admin__crud532710:这里把label写在slots里面，以scope.hasError来判断是否有引发错误，比如必填项没有写
						slots: {
							label: (scope) => {
								return (
									<span style={{ color: scope.hasError ? "red" : "" }}>
									基本信息
								</span>
								);
							}
							},
						
						//对应隐藏在tabs里面的字段
						columns: [	"company", 
									"area",
									"department", 
									"TelUser",
									"TelRealPerson",
									"realDepartment",
									"TelAreaNum",
									"TelephoneType",
									"TelNumber",
									"Telstatus",
									"SuppliersItNetType",
									"Suppliers",
									"data",
								]  
							},

						// 功能说明:将子表配置进单独的tags标签里面,这里视自己的项目页面情况而定的,非必须配置事项					
					base1: {
						label: "转接配置",
						columns: [	"subTable", 
								]
						},

					base2: {
						label: "转接需求",
						columns: [	"transfer_address", "transfer_dial_num", "transfer_account", "transfer_password", "transfer_description"
								]
						},

					base99: {
						label: "其它说明",
						columns: [	"description", 
								]
						},

						
					},
				},


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
					title: '归属公司',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
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
						minWidth: 150, //最小列宽
						fixed:true,
					},
					form: {
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
					},
				},
				area: {
					title: '归属区域',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						url: '/api/it_area/?limit=999',
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
						fixed:true,
					},
					form: {
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
						// 注释编号:django-vue3-admin-crud135415:代码开始行
						// 功能说明:利用区域对区号进行自动填写
						async valueChange ({form,value,getComponentRef}){
							form.TelAreaNum= undefined;  //把区号先置空
							if (value){
							  const data = getComponentRef("area").dict._data
							  //根据当前选中的id值去字典data里面拿到对应的AreaNum
							  form.TelAreaNum  = data.find(obj => obj.id === value)?.AreaNum
							}
						},
						// 注释编号:django-vue3-admin-crud135415:代码结束行
						
					},
				},
				department: {
					title: '使用部门',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						url: '/api/department/?limit=999',
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
						fixed:true,
					},
					form: {
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
					},
				},
				TelUser: {
					title: '使用人',

					// search: {
					// 	component: {
					// 		name: "el-input",// 把搜索框从dict-select类型变成el-input类型,注意这里的name对应的是Ui的组件名称
					// 		placeholder: '信息归属、用户名、资产编码查询',
					// 		clearable: true,
					// 	},
					// 	order:0, //默认是1，所以0是排在最前面的
					// 	show: true,
					// 	col:{span:8},
						
					// },
					search:{show:true},

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
						minWidth: 200, //最小列宽
						fixed:true,
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
								//这里整个配置主要name:'organizationNewPageEdit'便可
								router.push({name:'organizationNewPageEdit',params:{id:value}})
							}
							return (
								// 这里配置一个跳转的按钮及引用函数
								<el-button-group style={"padding-left:5px"}>
								<fs-button  color="#e1f3d8" style="color: #67C23A" onClick={() => goto({value})} >跳转</fs-button>
								</el-button-group>
							);
						},
						// rules: [
						// 	// 表单校验规则
						// 	{
						// 		required: true,
						// 		message: '必填项',
						// 	},
						// ],
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
					title: '号码实名人',

					// search: {
					// 	component: {
					// 		name: "el-input",// 把搜索框从dict-select类型变成el-input类型,注意这里的name对应的是Ui的组件名称
					// 		placeholder: '信息归属、用户名、资产编码查询',
					// 		clearable: true,
					// 	},
					// 	order:0, //默认是1，所以0是排在最前面的
					// 	show: true,
					// 	col:{span:8},
						
					// },

					search:{show: true},

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
						minWidth: 200, //最小列宽
						// fixed:true, //固定列
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
								//这里整个配置主要name:'organizationNewPageEdit'便可
								router.push({name:'organizationNewPageEdit',params:{id:value}})
							}
							return (
								// 这里配置一个跳转的按钮及引用函数
								<el-button-group style={"padding-left:5px"}>
								<fs-button  color="#e1f3d8" style="color: #67C23A" onClick={() => goto({value})} >跳转</fs-button>
								</el-button-group>
							);
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
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						url: '/api/department/?limit=999',
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
						minWidth: 150, //最小列宽
						// fixed:true,  //固定列
					},
					form: {
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
					},
				},
				TelephoneType: {
					title: '电话类型',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						url: '/api/TelephoneTypeModelViewSet/?limit=999',
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
						// fixed:true, //固定列
					},
					form: {
						rules: [
							// 表单校验规则，这里配置必填项
							{
								required: true,
								message: '必填项',
							},
						],
						component: {
							span: 12,
							filterable: true,   //配置在选择时，可过滤搜索
						},
					},
				},
				TelAreaNum: {
					title: '号码区号',
					type: 'input',
					// search: { show: true},
					// readonly:true,   //配置成自定义的readonly
					column: {
						minWidth: 120,
						sortable: 'custom',
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
						helper: "当前数字区号由区域选择之后自动生成",
						component: {
							placeholder: '请输入号码区号',
							disabled: true,
						},
					},
				},
				TelNumber: {
					title: '电话号码',
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
								message: '必填项且必须填写纯数字',
								pattern: /^[1-9]\d*$/,
							},
						],
						// helper: "必须填写纯数字",
						component: {
							placeholder: '请输入电话号码',
						},
					},
				},
				Telstatus: {
					title: '号码状态',
					type: 'dict-select',
					dict: dict({
						value: 'id',
						label: 'dictName',   // 这里要添加为字典名称的字段
						getData: async ({ url }: { url: string }) => {
							const curId = await request({
								// 请求回来字典名称为TelephoneModel_Telstatus_choices对象ID
								url: '/api/globalDictModelViewSet/?dictName=TelephoneModel_Telstatus_choices',
							}).then((ret: any) => {
								return ret.data[0].id;
							});
							// 通过上面请求回来的TelephoneModel_Telstatus_choices对象ID来拼接直正要拿到的字典名称需求
							return request({
								url: `/api/globalDictModelViewSet/?limit=999&dictMark=${curId}`,
							}).then((ret: any) => {
								return ret.data;
							});
						},
					}),
					column: {
						minWidth: 100, //最小列宽
						// fixed:true, //固定列
					},
					form: {
						rules: [
							// 表单校验规则，这里配置必填项
							{
								required: true,
								message: '必填项',
							},
							
						],
						component: {
							span: 12,
						},
					},
					component: { props: { color: 'auto' } }, // 自动染色
				},



				SuppliersItNetType: {
					title: '供应商类型',
					search: {
						show: true,
					},
					type: 'dict-select',
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
						// fixed:true, //固定列
					},
					form: {
						rules: [
							// 表单校验规则，这里配置必填项
							{
								required: true,
								message: '必填项',
							},
						],
						component: {
							span: 12,
							filterable: true,   //配置在选择时，可过滤搜索
						},
					},

				},
				Suppliers: {
					title: '供应商',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						url: '/api/SuppliersViewSet/?limit=999',
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
						minWidth: 200, //最小列宽
						// fixed:true,    //固定列
					},
					form: {
						rules: [
							// 表单校验规则，这里配置必填项
							{
								required: true,
								message: '必填项',
							},
						],
						component: {
							span: 12,
							filterable: true,   //配置在选择时，可过滤搜索
						},
					},
				},

			// 功能说明:对注释进行跨列配置，解决看起来太小的问题，重点参数colspan
				description: {
					title: '备注说明',
					type: ["textarea","colspan"],
					search: {show: false},
					column: {
						minWidth: 200, //最小列宽
						// show: false,
					},
					form: {
						component: {
							rows:8,   //配置一共默认占用8行的高度的
							maxlength: 500,
							placeholder: '输入备注',
						},
					},
				},
			// 功能说明:引用入了一张子表,并且配置了相应的保存及保存之后页面的处理
			subTable: {
				title: "子表",
				type: "text",
				form: {
					title: "",  //配置在form内没有title内容
					labelWidth:"0",   //配置子表的宽度占满介面
					component: {
					name: subTableComponent,
					id:compute(({form})=>{
						return form.id
					}),
					on:{
						//可以传进form进去async saveMain({form})
						async saveMain(){
						//保存主表
						const formRef = crudExpose.getFormRef()
						const ret = await formRef.submit()
						//将form改为编辑模式
						let formWrapperRef = crudExpose.getFormWrapperRef();
						// 这个地方要改为拿到ret.res.data，示例中拿到的是ret.res
						formWrapperRef.setFormData(ret.res.data)
						crudRef.value.formWrapperRef.formOptions.mode = "edit"
						crudRef.value.formWrapperRef.title="编辑"
						}
					}
					},
					col: {
					span: 24
					},
				},
				column: {
					minWidth: 200, //最小列宽
					formatter: ({ row }) => {
					return "查看或编辑状态查看内容";
					}
				}
				},

				
				// 注释编号:django-vue3-admin-crud273411:代码开始行
				// 功能说明:这里是配置转接需求的字段
				transfer_address: {
					title: '转接需求地址',
					type: 'input',
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						component: {
							placeholder: '转接需求地址，如URL',
						},
					},
				},
				transfer_dial_num: {
					title: '转接拨打号码',
					type: 'input',
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						// helper: "如电话号码或者带有#+分机的号码等",
						component: {
							placeholder: '如电话号码或者带有#+分机的号码等',
						},
					},
				},
				transfer_account: {
					title: '转接需求账号',
					type: 'input',
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						// helper: "转接需求账号",
						component: {
							placeholder: '转接需求账号',
						},
					},
				},
				transfer_password: {
					title: '转接需求密码',
					type: 'input',
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						// helper: "转接需求账号",
						component: {
							placeholder: '转接需求密码',
						},
					},
				},
				transfer_description: {
					title: '转接需求说明',
					type: ["textarea","colspan"],
					search: {show: false},
					column: {
						minWidth: 200, //最小列宽
						// show: false,
					},
					form: {
						component: {
							rows:8,   //配置一共默认占用8行的高度的
							maxlength: 500,
							placeholder: '转接需求说明',
						},
					},
				},

				// 注释编号:django-vue3-admin-crud273411:代码结束行


			},

		},
	};
};
