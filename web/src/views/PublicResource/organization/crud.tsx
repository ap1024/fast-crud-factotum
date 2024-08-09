import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
import { useRouter } from "vue-router";
import {inject} from "vue";


// 注释编号:django-vue3-admin-crud372214:导入权限验证函数
import {auth} from '/@/utils/authFunction'




// 注释编号:django-vue3-admin__crud400415:代码开始行
// 功能说明:导入懒加载外键对应的crud进行复用
import it_area  from "../../PublicResource/area/crud";
import  company  from "../../PublicResource/company/crud";
import department from "../../PublicResource/department/crud";

// 注释编号:django-vue3-admin__crud400415:代码结束行


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
			form: {
				col: { span: 12 },	//配置成一行两个元素
				labelPosition: "left", 
				labelWidth: "auto", //配置成lable的宽为自动
				requireAsteriskPosition:"right", //星号的位置
				row: { gutter: 40 } ,
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
						suffixRender() {
							function gotoAddArea() {
								// 这里是跳转至相应的路由
								router.push({ path: "/area/" });
							}
							return (
								// 这里配置一个跳转的按钮及引用函数
								<el-button-group style={"padding-left:5px"}>
								<fs-button color="#e1f3d8" style="color: #67C23A" onClick={gotoAddArea} icon="Pointer">跳转</fs-button>
								</el-button-group>
							);
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

				use: {
					title: '资源名称',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '资源名称必填' }],
						component: {
							placeholder: '请输入资源名称',
						},
					},
				},
				or_use_status: {
					title: '员工状态',
					type: 'dict-select',
					dict: dict({
						value: 'id',
						label: 'dictName',   // 注释编号:django-vue3-admin__crud050016:这里要添加为字典名称的字段
						getData: async ({ url }: { url: string }) => {
							const curId = await request({
								// 注释编号:django-vue3-admin__crud400016:请求回来字典名称为PersonnelStatus对象ID
								url: '/api/globalDictModelViewSet/?dictName=PersonnelStatus',
							}).then((ret: any) => {
								return ret.data[0].id;
							});
							// 注释编号:django-vue3-admin__crud200116:通过上面请求回来的PersonnelStatus对象ID来拼接直正要拿到的字典名称需求
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
                date: {
                    title: '入职时间',
					type: 'date',
					search: { show: false },
                    form: {
                    rules: [{ required: true, message: '入职时间必填' }],
                    component: {
						placeholder: '请输入入职时间',
                      }
                    },
                    column: {
                      align: "center",
                      width: 120,
                    }
                  },




			},




		},
	};
};
