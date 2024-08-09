import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import {auth} from "/@/utils/authFunction";
import {shallowRef} from "vue";
import deptFormat from "/@/components/dept-format/index.vue";

//此处为crudOptions配置
export default function ({ crudExpose}: { crudExpose: CrudExpose}): CreateCrudOptionsRet {
	const pageRequest = async (query: any) => {
		return await api.GetList(query);
	};
	const editRequest = async ({ form, row }: EditReq) => {
		if (form.id == null) {
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
                            // 注释编号:django-vue3-admin-crud210716:注意这个auth里面的值，最好是使用index.vue文件里面的name值并加上请求动作的单词
                            show: auth('InventoryhostModelViewSet:Export'),
							text:"导出",//按钮文字
							title:"导出",//鼠标停留显示的信息
                            click(){
                                return exportRequest(crudExpose.getSearchFormData())
								// return exportRequest(crudExpose!.getSearchFormData())    // 注意这个crudExpose!.getSearchFormData()，一些低版本的环境是需要添加!的
                            }
                        },
                        add: {
                            show: auth('InventoryhostModelViewSet:Create'),
                        },
				}
			},
            rowHandle: {
                //固定右侧
                fixed: 'right',
                width: 200,
                buttons: {
                    view: {
                        type: 'text',
						order: 1,
                        show: auth('InventoryhostModelViewSet:Retrieve')
                    },
                    edit: {
                        type: 'text',
						order: 2,
						show: auth('InventoryhostModelViewSet:Update')
                    },
					copy: {
                        type: 'text',
						order: 3,
						show: auth('InventoryhostModelViewSet:Copy')
                    },
                    remove: {
                        type: 'text',
						order: 4,
						show: auth('InventoryhostModelViewSet:Delete')
                    },
                },
            },
			columns: {
                name: {
					title: '名称',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						helper: {
							render() {
								return <div style={"color:blue"}>名称是必需要填写的</div>;
								}
							},
						rules: [{ required: true, message: '名称是必需要填写的' }],
						component: {
							placeholder: '请输入名称是必需要填写的',
						},
					},
				},

				ip: {
					title: '资产组或IP地址',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						helper: {
							render() {
								return <div style={"color:blue"}>IP是必需要填写的</div>;
								}
							},
						rules: [{ required: true, message: 'IP是必需要填写的' }],
						component: {
							placeholder: '请输入IP是必需要填写的',
						},
					},
				},

                // Inventorygroupname: {
                //   title: '分组名称',
                //   search: {
                //     show: true,
                //   },
                //   type: 'dict-tree',
                //   dict: dict({
                //     isTree: true,
                //     url: '/api/InventorygroupModelViewSet/',
                //     value: 'id',
                //     label: 'name'
                //   }),
                //   column: {
                //     minWidth: 150,
                //   },
                //   form: {
                //     rules: [
                //       {
                //         required: true,
                //         message: '必填项',
                //       },
                //     ],
                //     component: {
                //       filterable: true,
                //       placeholder: '请选择',
                //       props: {
                //         checkStrictly: true,
                //         props: {
                //           value: 'id',
                //           label: 'name',
                //         },
                //       },
                //     },
                //   },
                // },

			},
		},
	};
}