import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery, CreateCrudOptionsRet, CreateCrudOptionsProps, ScopeContext} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
// import { dictionary } from '/@/utils/dictionary';
// import {inject} from "vue";


// 注释编号:django-vue3-admin__crud400716:这里引入光纤网络的子表进来
import subTableComponent from "../SubLineTagModelViewSet/SubLineTagModelViewSetSub/index.vue";


//此处为crudOptions配置
export default function (object: CreateCrudOptionsProps): CreateCrudOptionsRet {
	
	const {crudRef } = object.crudExpose;
	const { crudExpose } = object;

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
				col: { span: 6 },
				// labelWidth: '100px',
				wrapper: {
					is: 'el-dialog',
					width: '1200px',
				},
				
			},
			columns: {
				id: {
					title: 'ID',
					type: 'number',
					column: { show: false },
					search: { show: false },
					form: { show: false },
				},
				line_num: {
					title: '线编号',
					type: 'number',
					search: { show: true},
					column: {
						// minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '线编号必填' }],
						component: {
							placeholder: '请输入线编号',
						},
					},
				},
				seat_num: {
					title: '卡位编号',
					type: 'number',
					search: { show: true},
					column: {
						// minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '卡位编号必填' }],
						component: {
							placeholder: '请输入卡位编号',
						},
					},
				},
				linetagtype: {
					title: '线路类型',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						url: '/api/LineTagtypeModelViewSet/?limit=999',
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
						minWidth: 120, //最小列宽
						// fixed:true,
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

				description: {
					title: '备注说明',
					type: ["textarea","colspan"],
					search: {show: false},
					form: {
						component: {
							rows:1,   //配置一共默认占用1行的高度的
							// maxlength: 500,
							placeholder: '输入备注',
						},
					},
				},

				// 注释编号:django-vue3-admin-crud514816:代码开始行
				// 功能说明:由这个subTable字段来引用相应子表进来
				subTable: {
					title: "线路接线情况",
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
							// 这个地方要改为拿到ret.res.data，示例中拿到的是ret.res,如果没有拿到值，会出现无法把值传过去窗口，或者传他认为那是一个新的对象
							//如果这里三行代码出现问题，都有可能会导致保存之后，再保存会出现新的对象
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
				// 注释编号:django-vue3-admin-crud514816:代码结束行

			},

		},
	};
}
