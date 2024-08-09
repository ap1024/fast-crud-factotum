import { AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
import {inject} from "vue";
import { useRouter } from "vue-router";

// 注释编号:django-vue3-admin__crud245314:代码开始行
// 功能说明:导入懒加载的复用模块
import ItResourceViewSet from "/@/views/it_mis/ItResource/crud";
import SoftTypeViewSet  from "/@/views/it_mis/SoftType/crud";
import SuppliersViewSet  from "/@/views/it_mis/SuppliersTables/SuppliersViewSet/crud";
import it_area from "/@/views/PublicResource/area/crud";
// 注释编号:django-vue3-admin__crud245314:代码结束行


//此处为crudOptions配置
	export default function ({ crudExpose}: { crudExpose: CrudExpose}): CreateCrudOptionsRet {
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



	
	
	const router = useRouter();

	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
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
			// 	col: { span: 24 },
			// 	labelWidth: '100px',
			// 	wrapper: {
			// 		is: 'el-dialog',
			// 		width: '600px',
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
				title: {
					title: '许可证名称',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: '许可证名称' }],
						component: {
							placeholder: '请输入许可证名称',
						},
					},
				},
				licence_type: {
					title: '类型',
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
									url: '/api/SoftTypeViewSet/' + "getbyIds/",
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
				licence_num: {
					title: '序列号',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: '序列号' }],
						component: {
							placeholder: '请输入序列号',
						},
					},
				},
				supplier: {
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
				version: {
					title: '版本号',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: '版本号' }],
						component: {
							placeholder: '请输入版本号',
						},
					},
				},
				start_date: {
                    title: '购买日期',
					type: 'date',
					search: { show: true },
                    form: {
                    rules: [{ required: false, message: '购买日期' }],
                      component: {
                            placeholder: '请输入购买日期',
                      }
                    },
                    column: {
                      align: "center",
                      width: 120,
                    }
                  },
				end_date: {
                    title: '到期日期',
					type: 'date',
					search: { show: true },
                    form: {
                    rules: [{ required: false, message: '到期日期' }],
                      component: {
                            placeholder: '请输入到期日期',
                      }
                    },
                    column: {
                      align: "center",
                      width: 120,
                    }
                  },
				price: {
					title: '费用',
					type: 'input',
					search: { show: true },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ message: '费用' }],
						component: {
							placeholder: '请输入费用',
						},
					},
				},
				use_status: {
					title: '使用状态',
					type: 'dict-select',
					dict: dict({
						value: 'dictNum',   // 注释编号:django-vue3-admin-crud473714:这里把提交给到后面的字段配置成dictNum，而不要使用默认的id
						label: 'dictName', 
						getData: async ({ url }: { url: string }) => {
							const curId = await request({
								// 注释编号:django-vue3-admin-crud183714:dictName=LicenceViewSet_use_status_choices是由全局字典里面录入使用的
								url: '/api/globalDictModelViewSet/?dictName=LicenceViewSet_use_status_choices',
							}).then((ret: any) => {
								return ret.data[0].id;
							});
							// 注释编号:django-vue3-admin-crud513814:根据dictName=LicenceViewSet_use_status_choices对应的id来查他们里面的字典
							return request({
								url: `/api/globalDictModelViewSet/?limit=999&dictMark=${curId}`,
							}).then((ret: any) => {
								return ret.data;
							});
						},
					}),
					readonly:true,  // 注释编号:django-vue3-admin-crud373614:如果有需要可开启只读模式
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
						label: 'it_use_id',  //这个it_use字段是后端懒加载把他转为对应的值转过来的。
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
									label: 'it_use_id', //这个it_use_name字段是后端单独序列化出来使用的，原来表没有的
								},
							},
						},
					},
				},




			},

		},
	};
};
