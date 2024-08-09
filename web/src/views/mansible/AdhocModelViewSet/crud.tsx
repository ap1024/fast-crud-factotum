import {
  CrudOptions,
  AddReq,
  DelReq,
  EditReq,
  dict,
  CrudExpose,
  UserPageQuery,
  CreateCrudOptionsRet,
  CreateCrudOptionsProps, compute
} from '@fast-crud/fast-crud';
import * as textTableApi from './api';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { auth } from "/@/utils/authFunction";
import {shallowRef} from "vue";
import createCrudOptionsText from "../Inventory/crud";
import {successMessage} from "/@/utils/message";
import {dictionary} from "/@/utils/dictionary";

export const createCrudOptions = function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const pageRequest = async (query: any) => {
    return await api.GetList(query);
  };
  const editRequest = async ({ form, row }: EditReq) => {
      form.id = row.id;
      return await api.UpdateObj(form);
  };
  const delRequest = async ({ row }: DelReq) => {
    return await api.DelObj(row.id);
  };
  const addRequest = async ({ form }: AddReq) => {
    return await api.AddObj(form);
  };

  const exportRequest = async (query: UserPageQuery) => {
    return await api.exportData(query);
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
          export: {
            show: auth('AdhocModelViewSet:Export'),
            text: "导出",
            title: "导出",
            click() {
              return exportRequest(crudExpose.getSearchFormData());
            }
          },
          add: {
            show: auth('AdhocModelViewSet:Create'),
          },
        }
      },
      rowHandle: {
        fixed: 'right',
        width: 200,
        buttons: {
          view: {
            type: 'text',
            order: 1,
            show: false
          },
          edit: {
            type: 'text',
            order: 2,
            show: auth('AdhocModelViewSet:Update')
          },
          copy: {
            type: 'text',
            order: 3,
            show: auth('AdhocModelViewSet:Copy')
          },
          remove: {
            type: 'text',
            order: 4,
            show: auth('AdhocModelViewSet:Delete')
          },
          custom: {
            text: '执行命令',
            type: 'text',
            show: true,
            tooltip: {
              placement: 'top',
              content: '执行命令',
            },
            click: (ctx) => {
              const { row } = ctx;
              // console.log('crud.ts - row:', row);
              if (context && context.handleCustomActionOpen) {
                context.handleCustomActionOpen(row);
              } else {
                // console.error('handleCustomActionOpen is not defined in context');
              }
            },
          },
        },
      },
      columns: {
        module_name: {
          title: '任务名称',
          type: 'input',
          search: { show: true },
          column: {
            minWidth: 70,
            sortable: 'custom',
          },
          form: {
            helper: {
              render() {
                return <div style={"color:blue"}>模块名称是必需要填写的</div>;
              }
            },
            rules: [{ required: true, message: '任务名称必填' }],
            component: {
              placeholder: '请输入任务名称',
            },
          },
        },

        module: {
          title: '模块名称',
          search: {
            show: true,
          },
          type: 'dict-tree',
          dict: dict({
            isTree: true,
            url: '/api/ModuleModelViewSet/',
            value: 'id',
            label: 'name'
          }),
          column: {
            minWidth: 30,
          },
          form: {
            rules: [
              {
                required: true,
                message: '必填项',
              },
            ],
            component: {
              filterable: true,
              placeholder: '请选择',
              props: {
                checkStrictly: true,
                props: {
                  value: 'id',
                  label: 'name',
                },
              },
            },
          },
        },

        params: {
          title: '输入参数',
          type: 'text',
          search: { show: false },
          column: {
            minWidth: 500,
            sortable: 'custom',
          },
          form: {
            helper: {
              render() {
                return <div style={"color:blue"}>输入参数根据模块自行填写</div>;
              }
            },
            rules: [{ required: true, message: '输入参数必填' }],
            component: {
              placeholder: '请输入输入参数',
            },
          },
        },
        is_root_active: {
            title: '切换root',
            search: {show: false},
            type: 'dict-radio',
            column: {
              width: 100,
              component: {
                  name: 'fs-dict-switch',
                  activeText: '',
                  inactiveText: '',
                  style: '--el-switch-on-color: var(--el-color-primary); --el-switch-off-color: #dcdfe6',
                  onChange: compute((context) => {
                      return () => {
                          api.UpdateObj(context.row).then((res: APIResponseData) => {
                              // successMessage(res.msg as string);
                          });
                      };
                  }),
              },
            },
            dict: dict({
                data: dictionary('button_status_bool'),
            }),
                },

        tempip: {
          title: "执行目标",
          search: { show: false },
          type: "table-select",
          dict: dict({
          }),
          form: {
            component: {
              rowKey: "ip",
              multiple: true,
              crossPage: true,
              // filterable: true,
              createCrudOptions: createCrudOptionsText,
              crudOptionsOverride: {
                table: {
                  scroll: {
                    x: 2000,
                    y: 2000
                  }
                },
                rowHandle: {
                  fixed: "right"
                }
              }
            }
          }
        },


      },
    },
  };
}