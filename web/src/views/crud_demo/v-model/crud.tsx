import { CreateCrudOptionsProps, CreateCrudOptionsRet } from "@fast-crud/fast-crud";

export default function ({ expose }: CreateCrudOptionsProps): CreateCrudOptionsRet {
  return {
    crudOptions: {
    //这里是配置本地模式，应该在这里改为远程模式
      mode: {
        name: "local",
        isMergeWhenUpdate: true,
        isAppendWhenAdd: true
      },
      search: {
        show: false
      },
      toolbar: {
        show: false
      },
      pagination: {
        show: false
      },

    //   这里是配置字段
      columns: {
        name: {
          type: "text",
          title: "联系人姓名"
        },
        mobile: {
          type: "text",
          title: "联系人手机号码"
        },
        // mobile1: {
        //     type: "text",
        //     title: "11联系人手机号码"
        //   }
      }
    }
  };
}