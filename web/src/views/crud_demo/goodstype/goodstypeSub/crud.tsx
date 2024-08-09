import {
	CreateCrudOptionsProps,
	CreateCrudOptionsRet,
  } from "@fast-crud/fast-crud";
export default function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  const { crudBinding } = crudExpose;

  return {
    crudOptions: {
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
        show: false
      },
      toolbar: {
        show: false,
        buttons: {
          refresh: {
            show: false
          },
          search: {
            show: false
          }
        }
      },
      mode: {
        name: "local",
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true
      },
      table: {
        editable: {
          enabled: true,  //启动编辑功能
          mode: "free"  //自由编辑模式
        }
      },
      pagination: { show: false, pageSize: 9999999 },
      columns: {
		title: {
			title: '商品类型',
			type: 'input',
			column: {
				minWidth: 120,
				sortable: 'custom',
			},
			form: {
				component: {
					placeholder: '请输入商品名称',
				},
			},
		},
      }
    }
  };
}