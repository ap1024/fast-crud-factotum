import { CrudOptions, AddReq, DelReq, EditReq, dict, compute, UserPageQuery, CreateCrudOptionsProps, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
import { useRouter } from "vue-router";


// 注释编号:django-vue3-admin__crud450112:代码开始行
// 功能说明:导入懒加载外键对应的crud进行复用
import it_area from "/@/views/PublicResource/area/crud";
import department from "/@/views/PublicResource/department/crud";
import  organization  from "/@/views/PublicResource/organization/crud";
import  DeviceTypeViewSet  from "/@/views/it_mis/DeviceType/crud";
import  DeviceBrandViewSet  from "/@/views/it_mis/DeviceBrandViewSet/crud";
import  DeviceModelViewSet  from "/@/views/it_mis/DeviceModelViewSet/crud";
import  CpuViewSet  from "/@/views/it_mis/Cpu/crud";
import  MemoryViewSet  from "/@/views/it_mis/Memory/crud";
import  DiskViewSet  from "/@/views/it_mis/Disk/crud";
import  SoftTypeViewSet  from "/@/views/it_mis/SoftType/crud";
import  LicenceViewSet  from "/@/views/it_mis/LicenceViewSet/crud";
// 注释编号:django-vue3-admin__crud450112:代码结束行


// 注释编号:django-vue3-admin__crud400716:这里引入光纤网络的子表进来
import subTableComponent from "/@/views/it_mis/ItNetInfoTables/ItNetInfoSubModelViewSet/ItNetInfoSubModelViewSetSub/index.vue";


// 注释编号:django-vue3-admin__crud564816:column.order:-950最好是根据第一个排序字段跳-10这样来，这样如果中间要追加排序的话也方便


//此处为crudOptions配置
// 注释编号:django-vue3-admin__crud443414:这里注意要把上下文context传进来，因为他带了index.vue中传过来的属性
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
			//这个search是配置多行搜索配置的
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
						columns: [	"it_use", 
									"soft_type",
									"soft_licence", 
									"tag_num",
									"ip_addr",
									"use_account",
									"use_password",
									"remote_addr",
									"use_port",
									"purchase_start_data",
									"warranty"
								]  
					},
					base1: {
						slots: {
							label: (scope) => {
								return (
									<span style={{ color: scope.hasError ? "red" : "" }}>
									硬件信息
								</span>
								);
							}
							},
						columns: [	"device_type", 
									"device_brand", 
									"device_model",
									"service_tag", 
									"express_service_code",
									"mac_addr",
									"device_cpu",
									"device_memory",
									"device_disk",
								]
						},
						base2: {
							slots: {
								label: (scope) => {
									return (
										<span style={{ color: scope.hasError ? "red" : "" }}>
										资产配置
									</span>
									);
								}
								},
							columns: [	"is_resource", 
										"is_device_resource", 
										"it_device_resource_num",
									]
							},
						// 注释编号:django-vue3-admin__crud220816:代码开始行
						// 功能说明:将子表配置进单独的tags标签里面,这里视自己的项目页面情况而定的,非必须配置事项					
						base3: {
							label: "光纤网络",
							columns: [	"subTable", 
									]
							},
						// 注释编号:django-vue3-admin__crud220816:代码结束行
						base99: {
							label: "备注说明",
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
						minWidth: 100, //最小列宽
						fixed:true,
					},
					form: {
						// 注释编号:workspace.json__crud291217:在form中不显示出来
						show: false,
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
						// 注释编号:workspace.json__crud291217:在form中不显示出来
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
						// 注释编号:workspace.json__crud291217:在form中不显示出来
						show: false,
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: department,
						},
					},
				},
				it_use: {
					title: '信息归属',
					// 注释编号:django-vue3-admin__crud305417:代码开始行
					// 功能说明:这里专门对type: 'dict-select'改造为name: "el-input"
					search: {
						component: {
							name: "el-input",// 注释编号:django-vue3-admincrud564710:把搜索框从dict-select类型变成el-input类型,注意这里的name对应的是Ui的组件名称
							placeholder: '信息归属、用户名、资产编码查询',
							clearable: true,
						},
						order:0, //默认是1，所以0是排在最前面的
						show: true,
						col:{span:8},
						
					},
					// 注释编号:django-vue3-admin__crud305417:代码结束行
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

				device_type: {
					title: '硬件类型',
					search: {
                        // disabled: true,
						show: true,
						
					},
					type: 'table-select',
					dict: dict({
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {   //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/DeviceTypeViewSet/' + "getbyIds/",
									method: "post",
									data: { values }
								}).then((ret: any) => {
									return ret.data;
								});
							}
						}
					}),
					column: {
						minWidth: 110, //最小列宽
						sortable: 'custom',
						order:-1000,
					},
					form: {
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: DeviceTypeViewSet,
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
				device_brand: {
					title: '硬件品牌',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						

						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {	 //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/DeviceBrandViewSet/' + "getbyIds/",
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
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: DeviceBrandViewSet,
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

				device_model: {
					title: '硬件型号',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						

						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {	 //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/DeviceModelViewSet/' + "getbyIds/",
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
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: DeviceModelViewSet,
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
				service_tag: {
					title: '硬件服务编码',
					type: 'input',
					search: { 
						show: true,
						component: {
							placeholder: '请输入硬件服务编码',
							clearable: true,
						},
						
					},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: '硬件服务编码必填' }],
						component: {
							placeholder: '请输入硬件服务编码',
						},
					},
				},
				express_service_code: {
					title: '硬件快速代码',
					type: 'input',
					search: { 
						show: true,
						component: {
							placeholder: '请输入硬件快速代码',
							clearable: true,
						},
					},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: '硬件快速服务代码必填' }],
						component: {
							placeholder: '请输入硬件快速服务代码',
						},
					},
				},
				mac_addr: {
					title: 'mac地址',
					type: 'input',
					search: { 
						show: true,
						component: {
							placeholder: '请输入mac地址',
							clearable: true,
						},	
					},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: 'mac地址' }],
						component: {
							placeholder: '请输入mac地址',
						},
					},
				},
				device_cpu: {
					title: '硬件cpu',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						

						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {	 //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/CpuViewSet/' + "getbyIds/",
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
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: CpuViewSet,
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
				device_memory: {
					title: '硬件内存',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						

						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {	 //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/MemoryViewSet/' + "getbyIds/",
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
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: MemoryViewSet,
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
				device_disk: {
					title: '硬件硬盘',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						

						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {	 //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/DiskViewSet/' + "getbyIds/",
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
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: DiskViewSet,
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
				is_resource: {
					title: '是否固定资产',
					search: { show: true },
					type: 'dict-radio',
					dict: dict({
						data: [
							{ value: true, label: "是" },
							{ value: false, label: "否" }
						]
					}),
					column: {
						width: 130,
						sortable: 'custom',
					},
					form: {
						value: false,  //这里配置了默认值为false
					},
				},
				is_device_resource: {
					title: '是否需要标签',
					search: { show: false },
					type: 'dict-radio',
					dict: dict({
						data: [
							{ value: true, label: "是" },
							{ value: false, label: "否" }
						]
					}),
					column: {
						width: 130,
						sortable: 'custom',
					},
					form: {
						value: false,  //这里配置了默认值为false
						
						// 值变动异步触发操作
						async valueChange({ value, form }) {
							// 假设您需要根据 value 发起异步请求来更新 form 中的数据
							if(value){
								// Radio点"是"进来这里
								// 配置一个特殊的URL请求地址

								// 必须先判断资产编码是否为空
								if(!form.it_device_resource_num){
									const url = '/api/LicenceViewSet/it_device_resource_num/';
									const getData = async ({ url }: { url: string }) => {
										// 异步等待拿到数据
										return await request({url: url}).then((ret: any) => {
											return ret.data;
										});
										
										};
									// 调用方法拿到数据赋值给data
									const data = await getData({url});
									// 把URL请求到的值赋给资产编码
									form.it_device_resource_num = data

								}
	
						} else {
							// Radio点"否"进来这里
							// 资产编码设置为NUll

							// 必须先判断资产编码是否为空
							if(!form.it_device_resource_num){
								form.it_device_resource_num = null
							}
							}
						},

					},
				},
				it_device_resource_num: {
					title: '资产编码',
					type: 'number',
					// search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
						order:-960,
					},
					form: {
						component: {
							placeholder: '请输入资产编码',
							
						},
					},
				},
				soft_type: {
					title: '软件类型',
					search: {
                        // disabled: true,
						show: true,
					},
					type: 'table-select',
					dict: dict({
						
						value: 'id',
						label: 'title',
						getNodesByValues: async (values: any[]) => {
							if (!values.includes("")) {	 //element plus的一个bug,这里必须要对values的值进行判断非""
								return request({
									url: '/api/SoftTypeViewSet/' + "getbyIds/",
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
						order:-990,
					},
					form: {
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: SoftTypeViewSet,
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
				soft_licence: {
					title: '序列号',
					search: {
                        // disabled: true,
						// show: true,
					},
					type: 'table-select',
					column: {
						minWidth: 150, //最小列宽
						component:{
							dict: dict({
								
								value: 'id',
								label: 'licence_num',
								getNodesByValues: async (values: any[]) => {
									if (!values.includes("")) {	 //element plus的一个bug,这里必须要对values的值进行判断非""
										return request({
											url: '/api/LicenceViewSet/' + "getbyIds/",
											method: "post",
											data: { values }
										}).then((ret: any) => {
											return ret.data;
										});
									}
								}
							}),
						}
					},
					form: {
						/* 注释编号:workspace.json__crud52315217:代码开始行*/
						/* 功能说明:这里添加了一个按钮做跳转至相应的对象，以便随时方便预览、新增、编辑、对象*/
						suffixRender({value}) {
							//这里把当前的value传进去
							function goto({value}: {value: any}) {
								if (!value){
									// 这里判断当选项没有值是，用户又点了跳转按钮，那说明是需要新增对象
									value =0
								}
								// 这里是跳转至相应的路由，把value给到id
								//这里整个配置主要name:'LicenceViewSetNewPageEdit'便可
								router.push({name:'LicenceViewSetNewPageEdit',params:{id:value}})
							}
							return (
								// 这里配置一个跳转的按钮及引用函数
								<el-button-group style={"padding-left:5px"}>
								<fs-button color="#e1f3d8" style="color: #67C23A" onClick={() => goto({value})} >跳转</fs-button>
								</el-button-group>
							);
						},
						/* 注释编号:workspace.json__crud315217:代码结束行*/
						component: {
							rowKey: "id", //element-plus 必传
							createCrudOptions: LicenceViewSet,
							filterable: true,
							placeholder: '请选择',
							props: {
								props: {
									value: 'id',
									label: 'licence_num',
								},
							},
							dict: dict({
								prototype: true,
								
								url: '/api/LicenceViewSet/status/',
								value: 'id',
								label: 'licence_num',
								getData: async ({ url, form}: { url: string; form: any }) => {
									// 这里专门传了当前的form进来，是为了拿到他的值form.soft_licence然后再进行拼接路由，这样后端就可以拿到当前form的某个值进行筛选了。
									// 注意这里要想拿到form.soft_licence字段是根据自己的model表解决了，要根本使用情况而修改
									let pkid = 0   //这时初始设置为0，配置拿不到值的情况
									if (form.soft_licence){
										pkid = form.soft_licence //这是配置拿到值的情况
									}
									return request({
											url: url + pkid + "/", //这是做了一个拼接路由URL地址
									}).then((ret: any) => {
										return ret.data;
									});
								},
	
							}),

						},
					},
				},
				tag_num: {
					title: '标记码',
					type: 'input',
					search: { 
						show: true,
						component: {
							placeholder: '请输入标记码',
							clearable: true,
						},	
					},
					column: {
						minWidth: 120,
						sortable: 'custom',
						order:-950,
					},
					form: {
						component: {
							placeholder: '请输入标记码',
						},
					},
				},
				ip_addr:{
					title: "IP地址",
					type: 'ip_input',
					column: {
						minWidth: 120,
						sortable: 'custom',
					},

				},

				use_account: {
					title: '使用帐号',
					type: 'input',
					// search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
						order:-980,
					},
					form: {
						rules: [{ message: '使用帐号' }],
						component: {
							placeholder: '请输入使用帐号',
						},
					},
				},
				use_password: {
					title: '密码口令',
					type: 'input',
					// search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
						order:-970,
					},
					form: {
						rules: [{ message: '帐号密码' }],
						component: {
							placeholder: '请输入帐号密码',
						},
					},
				},

				remote_addr: {
					title: '远程地址',
					type: 'input',
					search: { show: true,
						component: {
							placeholder: '请输入远程地址',
							clearable: true,
						},	
					},
					column: {
						minWidth: 120,
						sortable: 'custom',
						
					},
					form: {
						// rules: [{ message: '远程地址' }],
						component: {
							placeholder: '请输入远程地址',
						},
					},
				},
				use_port: {
					title: '使用端口',
					type: 'number',
					controls: false,
					search: { show: false },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{  type: 'number', message: '使用端口' }],
						component: {
							placeholder: '请输入使用端口',
						},
					},
				},
				purchase_start_data: {
                    title: '采购日期',
					type: 'date',
					search: { show: true },
                    form: {
                    rules: [{ message: '采购日期' }],
                      component: {
                            placeholder: '请输入采购日期',
                      }
                    },
                    column: {
                      align: "center",
                      width: 120,
                    }
                  },
				warranty: {
					title: '保修时长',
					type: 'input',
					// search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: '保修时长' }],
						component: {
							placeholder: '请输入保修时长',
						},
					},
				},

			// 注释编号:django-vue3-admin__crud575316:代码开始行
			// 功能说明:对注释进行跨列配置，解决看起来太小的问题，重点参数colspan
				description: {
					title: '备注说明',
					type: ["textarea","colspan"],
					search: {show: false},
					form: {
						component: {
							rows:8,   //配置一共默认占用8行的高度的
							maxlength: 500,
							placeholder: '输入备注',
						},
					},
				},
				
			// 注释编号:django-vue3-admin__crud575316:代码结束行


			// 注释编号:django-vue3-admin__crud580516:代码开始行
			// 功能说明:引用入了一张子表,并且配置了相应的保存及保存之后页面的处理
			subTable: {
				title: "引用光纤网络",
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
					formatter: ({ row }) => {
					return "查看或编辑状态查看内容";
					}
				}
				},
			// 注释编号:django-vue3-admin__crud580516:代码结束行


			},

		},
	};
};
