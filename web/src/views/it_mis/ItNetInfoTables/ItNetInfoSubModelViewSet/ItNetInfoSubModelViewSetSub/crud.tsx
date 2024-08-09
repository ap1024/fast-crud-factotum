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
  import { dictionary } from '/@/utils/dictionary';
  
  export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const { crudBinding } = crudExpose;
    const { parentIdRef } = context;
    const pageRequest = async (query: any) => {
      return await api.GetList(query);   // 注释编号:django-vue3-admin__crud312516:取消传入父ID做参数的功能，fastcrud官方已经直接把父ID放在query里面了
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

      // 注释编号:django-vue3-admin__crud512516:这里要进行修改，需要返回ID对行，不然第二次点击新增时，会引发两条数据同时进行编辑
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
          show: false,
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
            exclusive: true,
            exclusiveEffect: "save", // "cancel" | "save";
            addRow: (data: any[], row: any)=>{
              // (data: any[], row: any) => void
              //在最后一行插入数据
              data.push(row)
              },
          }
        },
        
        pagination: { show: false, pageSize: 9999999 },
        columns: {
          itnetinfo: {
            title: '网络资源信息',
            type: 'dict-select',
            dict: dict({
              // prototype: true,  //这里不建议开启prototype,因为在prototype模式下,每一条数据都会进行单独的请求一次,如果有100条数据就得单独的请求100次.
              isTree: true,
              url: '/api/ItNetInfoSubModelStatuViewSet/status/',
              value: 'id',
              label: 'title',
              getData: async ({ url}: { url: string}) => {
                // 这里专门传了当前的form进来，是为了拿到他的值form.soft_licence然后再进行拼接路由，这样后端就可以拿到当前form的某个值进行筛选了。
                // 注意这里要想拿到form.soft_licence字段是根据自己的model表解决了，要根本使用情况而修改
                let pkid = 0   //这时初始设置为0，配置拿不到值的情况
                
                if (parentIdRef.value){
                  pkid = parentIdRef.value //这是配置拿到值的情况
                }
                return request({
                    url: url + pkid + "/?limit=999", //这是做了一个拼接路由URL地址
                }).then((ret: any) => {
                  return ret.data;
                });
              },

            }),
            column: {
              minWidth: 140, //最小列宽
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
              minWidth: 80, //最小列宽
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
            // readonly:true,  // 只读的开关
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
            title: "备注说明",
            type: "input",
          },

          // 注释编号:django-vue3-admin__crud192716:代码开始行
          // 功能说明:这里要注意配置父ID的外键对应的字段,并且设置他的值value: parentIdRef,注意,这里的parentIdRef是由子表对应的index计算拿到之后传过来的.
          
          // 注释编号:django-vue3-admin__crud192716:代码结束行
          //这里改为后端model中对应的外健
          parentId: {
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
  