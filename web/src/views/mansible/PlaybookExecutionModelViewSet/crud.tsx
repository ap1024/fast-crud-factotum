import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet, utils} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import {auth} from "/@/utils/authFunction";
import dayjs from "dayjs";

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
						export:{
                            // 注释编号:django-vue3-admin-crud210716:注意这个auth里面的值，最好是使用index.vue文件里面的name值并加上请求动作的单词
                            show: auth('CrudDemoModelViewSet:Export'),
							text:"导出",//按钮文字
							title:"导出",//鼠标停留显示的信息
                            click(){
                                return exportRequest(crudExpose.getSearchFormData())
								// return exportRequest(crudExpose!.getSearchFormData())    // 注意这个crudExpose!.getSearchFormData()，一些低版本的环境是需要添加!的
                            }
                        },
                        add: {
                            show: auth('CrudDemoModelViewSet:Create'),
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
                        show: auth('CrudDemoModelViewSet:Retrieve')
                    },
                    edit: {
                        type: 'text',
						order: 2,
						show: auth('CrudDemoModelViewSet:Update')
                    },
					copy: {
                        type: 'text',
						order: 3,
						show: auth('CrudDemoModelViewSet:Copy')
                    },
                    remove: {
                        type: 'text',
						order: 4,
						show: auth('CrudDemoModelViewSet:Delete')
                    },
                },
            },
			columns: {
				task_id: {
					title: '任务run_indent',
					type: 'input',
					search: { show: false},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						helper: {
							render() {
								return <div style={"color:blue"}>任务id是必需要填写的</div>;
								}
							},
						rules: [{ required: true, message: '此字段必填，playbook运行生成，测试手工填写' }],
						component: {
							placeholder: '此字段必填，playbook运行生成，测试手工填写',
						},
					},
				},
				playbook: {
                    title: 'Playbook名字',
                    search: {
                        show: true,
                    },
                    type: 'dict-select',
                    dict: dict({
                        url: '/api/PlaybookModelViewSet/',
                        value: 'id',
                        label: 'name',
                    }),
                    column: {
                        minWidth: 100, //最小列宽
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
                            multiple: true,
                            filterable: true,
                            placeholder: '请选择playbook',
                        },
                    },
                },

                private_data_dir: {
					title: '数据目录',
					type: 'text',
					search: { show: false },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '运行数据必填' }],
						component: {
							placeholder: '请输入运行数据目录',
						},
					},
				},
				status: {
					title: '执行状态',
					// type: 'text',
					search: { show: true },
					type: 'dict-select',
                    dict: dict({ //本地数据字典
                        value: "id",
                        label: "text",
                        data: [
                          { id: "success", text: "执行成功", color: "success" },
                          { id: "failed", text: "执行失败", color: "failed" },
                        ]
                      }),
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '执行状态必填' }],
						component: {
							placeholder: '请输入执行状态',
						},
					},
				},
				result: {
					title: '执行结果',
					type: 'text',
					search: { show: false },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '执行结果必填' }],
						component: {
							placeholder: '请输入执行结果',
						},
					},
				},

				Duration_time: {
                    title: '执行时长',
					type: ["time-humanize"],
					search: { show: false },
                    form: {
                      component: {
                            placeholder: '执行时长',
                      }
                    },
                    column: {
						component: {options: {
							largest: 2,
						},
						}
					},

                  },

				execution_time: {
					type: ["datetime", "time-humanize"],
					title: "执行时间",
					column: {
						component: {options: {
						largest: 2
						}
					}
					},
				},
			
			},
		},
	};
}