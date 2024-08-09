import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, compute, UserPageQuery, asyncCompute } from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
// import { successMessage } from '../../../utils/message';
import {inject} from "vue";
// import context from '@fast-crud/ui-interface/dist/d/context';
import { url } from 'inspector';
import { useRouter } from "vue-router";
import { successMessage } from '/@/utils/message';

interface CreateCrudOptionsTypes {
	crudOptions: CrudOptions;
}

// export default function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {

// export const createCrudOptions = function({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
	export const createCrudOptions = function ({ crudExpose, rolePermission, context}: { crudExpose: CrudExpose; rolePermission: any; context: any}): CreateCrudOptionsTypes {

  const router = useRouter();

  const { getFormRef, getFormData } = crudExpose;
  
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
        delRequest
      },
      actionbar: {
        buttons: {
          add: {
            click() {
				// 配置0时为新增需求状态
				router.push({name:'FormNewPageEdit',params:{id:0}})
            }
          }
        }
      },
      rowHandle: {
        buttons: {
          edit: {
            click(context) {
				// 拿到当前行的ID传至后端
				const rowId = context.row.id
				router.push({name:'FormNewPageEdit',params:{id:rowId}})
            }
          }
        }
      },
			columns: {


				goods: {
					title: '商品',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
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
                    rules: [{ required: true, message: '进货时间必填' }],
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




			},
    }
  };
}
