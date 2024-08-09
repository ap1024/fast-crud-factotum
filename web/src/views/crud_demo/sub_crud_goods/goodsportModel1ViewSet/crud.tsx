import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery } from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { dictionary } from '/@/utils/dictionary';
import {inject} from "vue";
import { useRouter } from "vue-router";
interface CreateCrudOptionsTypes {
	crudOptions: CrudOptions;
}


//此处为crudOptions配置
export const createCrudOptions = function ({ crudExpose, rolePermission }: { crudExpose: CrudExpose; rolePermission: any }): CreateCrudOptionsTypes {
	
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


	//实例路由
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
					add: {
						show: hasPermissions('LicenceViewSet:Create')
						// show:true
					},
					export:{
						text:"导出",//按钮文字
						title:"导出",//鼠标停留显示的信息
						click(){
							return exportRequest(crudExpose.getSearchFormData())
						}
					}
				}
			},

			rowHandle: {
				//固定右侧
				fixed: 'right',
				width: 200,
				buttons: {
					view: {
						type: 'text',
						show: true,
						style:{color: "#67C23A"},
						order: 1,
					},
					edit: {
						type: 'text',
						style:{color: "#E6A23C"},
						order: 2,
						show:hasPermissions('LicenceViewSet:Update')
					},
					copy: {
						text: '复制',	//按钮显示名称
						type: 'text',	//按钮类型
						order: 3,		//排序，这个看自己喜欢排在什么位置了
						style:{color: "#606266"},
						title: '复制',
						show:hasPermissions('LicenceViewSet:Copy'),	
					},
					remove: {
						type: 'text',
						style:{color: "#F56C6C"},
						order: 4,
						show:hasPermissions('LicenceViewSet:Delete')
					},
					custom: {
						text: '权限',
						title: '权限',
						type: 'text',
						order: 5,
						style:{color: "#409EFF"},
						show:hasPermissions('LicenceViewSet:Update'),
						click: (context: any): void => {
							const { row } = context;
							// eslint-disable-next-line no-mixed-spaces-and-tabs
							rolePermission.value.drawer = true;
							rolePermission.value.editedRoleInfo = row;
							rolePermission.value.initGet();
						},
					},
				},
			},
			form: {
				col: { span: 12 },	//配置成一行两个元素
				labelPosition: "left", 
				labelWidth: "auto", //配置成lable的宽为自动
				requireAsteriskPosition:"right", //星号的位置
				row:{ gutter: 20},  //配置同一行内，两个元素之间空隙20px

			},
			
			columns: {
				title: {
					title: '商品端口',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						component: {
							placeholder: '请输入商品端口',
						},
					},
				},
			},
		},
	};
};
