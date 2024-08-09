import {
  CrudOptions,
  AddReq,
  DelReq,
  EditReq,
  dict,
  CrudExpose,
  UserPageQuery,
  CreateCrudOptionsRet,
  CreateCrudOptionsProps
} from '@fast-crud/fast-crud';
import * as textTableApi from './api';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { auth } from "/@/utils/authFunction";
import {shallowRef} from "vue";
import createCrudOptionsText from "../Inventory/crud";

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
            show: auth('PlaybookModelViewSet:Export'),
            text: "导出",
            title: "导出",
            click() {
              return exportRequest(crudExpose.getSearchFormData());
            }
          },
          add: {
            show: auth('PlaybookModelViewSet:Create'),
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
            show: auth('PlaybookModelViewSet:Update')
          },
          copy: {
            type: 'text',
            order: 3,
            show: auth('PlaybookModelViewSet:Copy')
          },
          remove: {
            type: 'text',
            order: 4,
            show: auth('PlaybookModelViewSet:Delete')
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
        name: {
          title: 'Playbook名字',
          type: 'input',
          search: { show: true },
          column: {
            minWidth: 120,
            sortable: 'custom',
          },
          form: {
            helper: {
              render() {
                return <div style={"color:blue"}>Playbook名字是必需要填写的</div>;
              }
            },
            rules: [{ required: true, message: 'Playbook名字必填' }],
            component: {
              placeholder: '请输入Playbook名字',
            },
          },
        },
        description: {
          title: 'Playbook名字描述',
          type: 'input',
          search: { show: false },
          column: {
            minWidth: 120,
            sortable: 'custom',
          },
          form: {
            rules: [{ required: true, message: 'Playbook名字描述必填' }],
            component: {
              placeholder: '请输入Playbook名字描述',
            },
          },
        },
        file_path: {
          title: 'Playbook路径',
          type: 'input',
          search: { show: true },
          column: {
            component: {
              name: "fs-button",
              vModel: "text",
              type: "link",
              on: {
                onClick(ctx) {
                  const { row } = ctx;
                  context.handleFileDialogOpen(row.file_path);
                }
              }
            },
          },
          form: {
            rules: [{ required: true, message: 'Playbook路径必填' }],
            component: {
              placeholder: '请输入Playbook路径',
            },
          },
        },
        project: {
          title: '项目名称',
          search: {
            show: true,
          },
          type: 'dict-tree',
          dict: dict({
            isTree: true,
            url: '/api/ProjectModelViewSet/',
            value: 'id',
            label: 'name'
          }),
          column: {
            minWidth: 150,
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