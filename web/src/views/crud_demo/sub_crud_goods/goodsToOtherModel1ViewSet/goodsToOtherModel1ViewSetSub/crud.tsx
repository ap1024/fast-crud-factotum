import {
    AddReq,
    CreateCrudOptionsProps,
    CreateCrudOptionsRet,
    DelReq,
    dict,
    EditReq,
    UserPageQuery,
    UserPageRes
  } from "@fast-crud/fast-crud";
  import * as api from "./api";
  import { request } from '/@/utils/service';
  export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const { crudBinding } = crudExpose;
    const { parentIdRef } = context;
    const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
      return await api.GetList(query, parentIdRef.value);   //这里要把parentIdRef.value做ID传进去
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

      //这里要进行修改，需要返回ID对行，不行第二次点击新增时，会引发两条数据同时进行编辑
      const result = await api.AddObj(form);
      return { id: result.data.id };
    };
  
    return {
      crudOptions: {
        request: {
          pageRequest,
          addRequest,
          editRequest,
          delRequest
        },
        actionbar: {
          buttons: {
            add: {
              show: false
            },
            addRow: {
              show: true
            }
          }
        },
        search: {
          show: false,
          initialForm: {
            parentId: parentIdRef
          }
        },
        toolbar: {
          buttons: {
            refresh: {
              show: false,
            }
          }
        },
        table: {
          editable: {
            enabled: true,
            mode: "row",
            activeDefault: false,
            addRow: (data: any[], row: any)=>{
              // (data: any[], row: any) => void
              //在最后一行插入数据
              data.push(row)
              },
          }
        },
        
        // pagination: { show: false, pageSize: 9999999 },
        columns: {
          goodstype: {
            title: '商品类型',
            type: 'dict-select',
            dict: dict({
              url: '/api/goodstypeModel1ViewSet/?limit=999',
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
          goodsport: {
            title: '端口',
            type: 'dict-select',
            dict: dict({
              url: '/api/goodsportModel1ViewSet/?limit=999',
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
          //这里改为后端model中对应的外健
          description: {
            title: "备注",
            type: "input",
          },

          goodsName: {
            title: "父Id",
            type: "number",
            form: {
              value: parentIdRef,
              component: {
                disabled: true,
              }
            },
            //在页面隐藏起来，不让用户看到父Id字段
            column: {
              show: false,
            }
          },
        }
      }
    };
  }
  