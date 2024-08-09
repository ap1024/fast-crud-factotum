import * as api from "./api";
import { dict, compute, CreateCrudOptionsProps, CreateCrudOptionsRet, UserPageQuery, UserPageRes, EditReq, DelReq, AddReq} from "@fast-crud/fast-crud";

import EditableRowSub from "../goodsToOtherModel1ViewSet/goodsToOtherModel1ViewSetSub/index.vue";
export default function (props: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { crudBinding,crudRef } = props.crudExpose;
  const { crudExpose } = props;

  const pageRequest = async (query: UserPageQuery): Promise<UserPageRes> => {
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

  return {
    crudOptions: {
      request: {
        pageRequest,
        addRequest,
        editRequest,
        delRequest
      },
      form: {
        wrapper: {
          width: "80%"
        },
      },
      columns: {
        // id: {
        //   title: "ID",
        //   type: "number",
        //   form: {
        //     show: false
        //   },
        //   column: { width: 80, align: "center" }
        // },
				goods: {
					title: '商品',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						helper: {
							render() {
								return <div style={"color:blue"}>商品是必需要填写的</div>;
								}
							},
						rules: [{ required: true, message: '商品名称必填' }],
						component: {
							placeholder: '请输入商品名称',
						},
					},
				},
        inventory: {
					title: '库存量',
					type: 'number',
					search: { show: false },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '库存量必填' }],
						component: {
							placeholder: '请输入库存量',
						},
					},
				},
        goods_price: {
					title: '商品定价',
					type: 'text',
					search: { show: false },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '商品定价必填' }],
						component: {
							placeholder: '请输入商品定价',
						},
					},
				},
        purchase_goods_date: {
          title: '进货时间',
					type: 'date',
					search: { show: false },
                    form: {
                      component: {
                            //显示格式化
                            format: "YYYY-MM-DD",
                            //输入值格式
                            valueFormat: "YYYY-MM-DD",
                            placeholder: '请输入进货时间',
                      }
                    },
                    column: {
                      align: "center",
                      width: 120,
                      component: { name: "fs-date-format", format: "YYYY-MM-DD" }
                    }
        },	
        subTable: {
          title: "子表格",
          type: "text",
          form: {
            component: {
              name: EditableRowSub,
              id:compute(({form})=>{
                return form.id
                // return form.id ? form.id : true; //传个true进去，可以让页面显示出来
              }),
              on:{
                //可以传进form进去async saveMain({form})
                async saveMain(){
                  //保存主表
                  const formRef = crudExpose.getFormRef()
                  const ret = await formRef.submit()
                  //将form改为编辑模式
                  let formWrapperRef = crudExpose.getFormWrapperRef();
                  // 这个地方要改为拿到ret.res.data，示例中拿到的是ret.res
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
        }
      }
    }
  };
}
