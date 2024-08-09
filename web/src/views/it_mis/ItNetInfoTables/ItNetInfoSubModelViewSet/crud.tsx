import { AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
import {inject} from "vue";


import ItResourceViewSet from "/@/views/it_mis/ItResource/crud";
import { useRouter } from "vue-router";


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
			form: {
				col: { span: 24 },
				labelWidth: '100px',
				wrapper: {
					is: 'el-dialog',
					width: '600px',
				},
				
			},
			columns: {
				itnetinfo: {
					title: '网络资源信息',
					type: 'dict-select',
					dict: dict({
						url: '/api/ItNetInfoViewSet/?limit=999',
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
						minWidth: 100, //最小列宽
					},
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
					// readonly:true,  // 开关只读模式
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
				description: {
					title: '备注说明',
					type: 'input',
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
				},

			},

		},
	};
};
