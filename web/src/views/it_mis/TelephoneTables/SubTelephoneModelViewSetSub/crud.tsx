import {
    AddReq,
    CreateCrudOptionsProps,
    CreateCrudOptionsRet,
    DelReq,
    dict,
    EditReq,
    ScopeContext,
    EditableRow,
  } from "@fast-crud/fast-crud";

import * as api from "./api";
import { request } from '/@/utils/service';
import _ from "lodash-es";
import { ref } from "vue";



  export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const { crudBinding } = crudExpose;
    const { parentIdRef } = context;

    // 拿到showStatus的值，并对于!showStatus.value.disabled的值这里如果点查看进来的就会拿到false，如果编辑进来的就会true
    const { showStatus } = context;

    const pageRequest = async (query: any) => {
      return await api.GetList(query);
    };

    const editRequest = async ({ form, row }: EditReq) => {
      if (form.id == null) {
        form.id = row.id;
      }
      return await api.UpdateObj(form);
    };

    // 重新写一条数据要匹配上移及下移时提交数据
    const rowEditRequest = async ({ row }: EditReq) => {

      return await api.RowUpdateObj(row);
    };
 

    const delRequest = async ({ row }: DelReq) => {
      return await api.DelObj(row.id);
    };
  
    const addRequest = async ({ form }: AddReq) => {

      // 这里要进行修改，需要返回ID对行，不然第二次点击新增时，会引发两条数据同时进行编辑
      const result = await api.AddObj(form);
      return { id: result.data.id };
    };


    // 这是是配置一个变量去拿到编辑时，传过来的当前行数据
    let curRowData = {}


    // 配合table单选存储的当前行数据
    const curChangeRow = ref()

    // 这是单选选中触发的方法
    const onCurrentChange = (row:any) =>{   
        curChangeRow.value = row

    }

    // 注释编号:django-vue3-admin-crud395810:代码开始行
    // 功能说明:配置一个动态获取的URL及label
    const dynamic_url = ref()

    //动态获取label
    const dynamic_label = ref()

    // 注释编号:django-vue3-admin-crud395810:代码结束行
  

    

  
    return {
      crudOptions: {
        request: {
          pageRequest,
          addRequest,
          editRequest,
          rowEditRequest,
          delRequest
        },
        actionbar: {
          buttons: {
            add: {
              show: false
            },
            addRow: {
              show: true
            },
            copyRow: {
              //自定义复制一条线行数据
              text:"复制",//按钮文字
              type:"warning",  //修改为绿色
              show:!showStatus.value.disabled, // 按查看与编辑的情况下显示或隐藏当前按钮
              async click(){
                try{
                  if(curChangeRow.value){
                    let copyRowData = JSON.parse(JSON.stringify(curChangeRow.value)); // 深拷贝对象

                    //如下是为要排除的字段
                    const excludeFields = ['id', 'sortIndex', 'create_datetime', 'update_datetime', 'dept_belong_id', 'modifier', 'creator', '$editable_id', 'modifier_name', 'creator_name'];
                    for(let field of excludeFields) {
                        delete copyRowData[field];
                    }

                    //调用新增方法，并且把调整好的copyRowData传进去，如下我们就一定要配置 crudBinding.value?.table?.editable?.addRow方法
                    crudBinding.value?.table?.editable?.addRow(crudBinding.value.data, copyRowData)

                    
                    //当copy一条新数据的时候，必须要对dynamic_url及dynamic_label进行更新，否则会报错
                    dynamic_url.value = copyRowData.url
                    dynamic_label.value = copyRowData.label

                }

                }catch (error) {
                  console.error('Error editing row:', error);
                }

              },

            },

            // 功能说明:上下移动行数据的实现
            sortUp:{
              text:"上移",//按钮文字
              // title:"数据必须先单击选中之后再单击上移",//鼠标停留显示的信息
              type:"success",  //修改为绿色
              show:!showStatus.value.disabled, // 按查看与编辑的情况下显示或隐藏当前按钮
              async click(){
                try {
                // 选移动对象时，先去拿到当前table单选之选中的对象（选中的行数据）
                let  row = curChangeRow.value
                
                if (row.sortIndex != 1){   //这里要进行判断如果是选中了第一条的话,那就不再执行上移的操作,防止出错

                  // 在所有crudBinding.value.data数据当中找到上一个row.sortIndex - 1的对象，并且去除[].shift()返回一个字典对象
                  let anotherRow = crudBinding.value.data?.filter(item => item.sortIndex === row.sortIndex - 1).shift();  //拿到当前单选选中数据的上一条数据

                  anotherRow.sortIndex = anotherRow.sortIndex + 1   //上一条数据减1排序
                  row.sortIndex = row.sortIndex - 1          //当前选中的这一条数据+1排序
  

                  // 这里自己重新做一条row提交的请求,不要直接使用crudExpose.editable.doSaveRow({row}) ,这样页面就不会存在闪一下的情况
                  await rowEditRequest({row})
                  await rowEditRequest({row:anotherRow})
  
                  crudExpose.doRefresh();    //最后刷新页面
                }
                }catch (error) {
                  console.error('Error editing row:', error);
                }

              },

            },
            sortDown:{
              text:"下移",//按钮文字
              // title:"数据必须先单击选中之后再单击下移",//鼠标停留显示的信息
              type:"success",  //修改为绿色
              show:!showStatus.value.disabled, // 按查看与编辑的情况下显示或隐藏当前按钮
              async click(){

                try {
                  const  row = curChangeRow.value
                  const anotherRow = crudBinding.value.data?.filter(item => item.sortIndex === row.sortIndex + 1).shift();
                  if (anotherRow){ //判断他是否还有下一条数据,如果没有了,说明当前这一条数据是最后一条,那就不需要再下移了
  
                    row.sortIndex = row.sortIndex + 1
                    anotherRow.sortIndex = anotherRow.sortIndex - 1
  
                    //先取消所有行的编辑状态
                    crudExpose.editable.cancel()
  
                    // 这里自己重新做一条row提交的请求,不要直接使用crudExpose.editable.doSaveRow({row}) ,这样页面就不会存在闪一下的情况

                    await rowEditRequest({row})
                    await rowEditRequest({row:anotherRow})
  
                    crudExpose.doRefresh();    //最后刷新页面
                }

                }catch (error) {

                  console.error('Error editing row:', error);

                }

              },
            },
            // 注释编号:django-vue3-admin-crud541816:代码结束行
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
          // 功能说明:启用table的单选功能及触发的事件
          highlightCurrentRow:true, //启用单选方法，与onCurrentChange单选事件做配套
          onCurrentChange,//启用单独事件，与highlightCurrentRow单选方法做配套
          editable: {
            // rowKey:'id',
            // rowKey:'_index',
            enabled: true,
            mode: "row",
            activeDefault: false,

            //排它式激活，限制当前子表行编辑只能同时激活一行
            exclusive: true,
            exclusiveEffect: "save", // "cancel" | "save";


            addRow: (data: any[], row: any)=>{           
              // 注释编号:django-vue3-admin-crud232516:代码开始行
              // 功能说明:如果数据里面上一个对象的$editable_id值为负数，那说明前面已经点击了一次新增，就什么都不要操作，不允许点击两次新增

              let pre_obj_editableId = null


              if (data.length > 0) {   //在这种情况下，就说明原来已经有对象存在，那么便可以放心的执行这里面的逻辑了
                pre_obj_editableId = data[data.length - 1].id;
              }else{
                pre_obj_editableId = 1    //直接给一个1做为标识值，引导新增按钮一条新数据
              }
              
             if ( pre_obj_editableId) {   
                //在最后一行插入数据
                data.push(row)
              }

              // 注释编号:django-vue3-admin-crud232516:代码结束行
              
              },
          }
        },
        rowHandle: {

          width:200,   // 这里要重新定义一个宽度，因为全局定制了170，这里不够使用

          //这个地方才是配置了子表中编辑、取消、保存等按钮的地方
          group: {
             "editRow": { //行编辑模式
              // 功能说明:这里对edit按钮进行了定制事件，核心代码是直接使用fastcurd的
              "edit": { //进入编辑
                click: (context: ScopeContext) => {
                  //如下代码是由fastcrut作者写的，拿到了当前行的标识
                  const { index, row } = context;                
                  const editableId = row[crudBinding.value.table?.editable?.rowKey];

                  if (crudBinding.value.table?.editable?.exclusive) {
                    //排他式激活
                    const activeRows: EditableRow[] = crudExpose.editable.getActiveRows();
                    _.forEach(activeRows, (item: EditableRow) => {
                      if (crudBinding.value.table?.editable?.exclusiveEffect === "save") {
                        crudExpose.editable.doSaveRow({ row: item.rowData });
                      } else {
                        crudExpose.editable.doCancelRow({ row: item.rowData });
                      }

                    });
                  }

                  crudExpose.editable.getEditableRow(editableId)?.active();


                 // 这里是拿到了当前点击编辑的行数据,并且赋值给curRowData
                  curRowData = context.row
                  
                  // 注释编号:django-vue3-admin-crud155310:代码开始行
                  // 功能说明:对动态的URL及label进行判断及赋值,这里主要是给accessInfo字段使用的
                  if(context.row.url&&context.row.label){
                    dynamic_url.value = context.row.url
                    dynamic_label.value = context.row.label
                  }

                  // 注释编号:django-vue3-admin-crud155310:代码结束行

                 },
              }, 
             
              save: {
                click: async (context: ScopeContext) => {
                  const { row } = context;
                  if(!row.sortIndex){
                    const dictLength = Object.keys(crudBinding.value.data).length;   //查询当前整个table有多少条数据，包括点击保存的当前对象
                    row.sortIndex = dictLength   //长度是0开始算的
                    }
                  // }
                  await crudExpose.editable.doSaveRow({ row });    //行数据做保存
                },


              },
            },
          }
        
        },
        pagination: { show: false, pageSize: 999},
        columns: {
        
          // 功能说明:配置出来fastcrud自带的index索引字段
          _index: {  //把table表索引给显示出来
            title: "线序",
            form: { show: false },
            column: {
              align: "center",
              columnSetDisabled: true, //禁止在列设置中选择
            }
          },
          sortIndex:{
            title: "排序",
            form: { show: false },
            column: {
              show:false,  //要把这个专门拿来排序的字段进行隐藏显示
              align: "center",
              columnSetDisabled: true, //禁止在列设置中选择

            },

          },

          // 功能说明:联动选择中主动的select项目，它自己的选择项目会引发被动字典的dict根据新的需求请求重新请求
          accesstype: {
            title: '接入类型',
            type: 'dict-select',
            dict: dict({
              url: '/api/lineAccessTypeModelViewSet/?limit=999',
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
                rules: [{required: true, message: "线路接入类型为必选项"},],
                minWidth: 80, //最小列宽
              },
  
            form:{
              // rules: [{required: true, message: "电话接入类型为必选项"},],
              component:{
                filterable: true,
                // 注释编号:django-vue3-admin-crud565610:代码开始行
                // 功能说明:配置选择后触发事件,进行拼接URL及label
                // onSelectedChange(selectedObj:any){
                //   if(selectedObj.url&&selectedObj.label){
                //     dynamic_url.value = selectedObj.url
                //     dynamic_label.value = selectedObj.label
                //   }
                // },

                // 注释编号:django-vue3-admin-crud565610:代码结束行


                // 注释编号:django-vue3-admin-crud513014:代码开始行
                // 功能说明:参考fastcrud官方中component.on.onXxx对原始事件监听http://fast-crud.docmirror.cn/api/common-options.html#component-on-onxxx
                on:{
                  onSelectedChange({$event, row}:{$event:any, row:any}){
                    //如果$event.url&&$event.label有值，则一定要把URl及Label进行赋值，否则会报错
                    if ($event.url&&$event.label){
                      row.url = $event.url
                      row.label = $event.label
                      dynamic_url.value = $event.url
                      dynamic_label.value = $event.label
                    }else{
                      //如果$event.url&&$event.label无值，即是不成立，那也要把dynamic_url.value dynamic_label.value清空
                      dynamic_url.value = $event.url
                      dynamic_label.value = $event.label
                    }
                  }

                },
                // 注释编号:django-vue3-admin-crud513014:代码结束行
              

              },
            },
          },

          // 功能说明:联动选择中被动的字典，他的dict是由主的select引发传过来的url及label之后再展现数据的
        
          accessInfo: { 
            title: "接入信息",
            type: "autocomplete",
            search: {
              show: true
            },
            form: {
              component: {
                filterable: true,  //可清空
                debounce:500,  	//获取输入建议的防抖延时，单位为毫秒,默认300
                props: {
                  placeholder: '请输入接入信息',
                  // queryString就是你输入框的值,即是需要搜索的值,而cb就回调函数
                  // 注释编号:django-vue3-admin-crud190011:代码开始行
                  // 功能说明:这里就是配置autocomplete触发的URL请求数据及过滤
                  fetchSuggestions:async(queryString: string, cb: any) => {
                  

                    // 注释编号:django-vue3-admin-crud163015:代码开始行
                    // 功能说明:需要做个判断是否是点复制进来的，而且editDynamic_url.value是否有值
                    const url = `${dynamic_url.value}/?limit=999`
                    // if(editDynamic_url.value){
                    //    url = `${editDynamic_url.value}/?limit=999`
                    //    console.log("1111111111110000000000", url, queryString)
                    // }else{
                    //   console.log("111111111111222222222", url, queryString)
                    //   url = `${dynamic_url.value}/?limit=999`
                    // }
                    // 注释编号:django-vue3-admin-crud163015:代码结束行
                    // console.log("111111111111", url, queryString)

                    //这里一定要提前判断一下是否有URL及label传进来才行,有传进来,才进行相应的请求数据及过滤操作,如果没有传进不,即是当前的autocomplete便是一个普通的input而以
                    if (dynamic_url.value&&dynamic_label.value){

                        const response = await request({
                            url: url,
                            }).then((ret: any) => {
                              return ret.data;
                              });

                        // 根据实际返回数据格式处理(列表)
                        let fileLists: Array<any> =  response.map((val: any) => ({
                          value: val[dynamic_label.value],  //autocomplete默认的是显示及提交value的值,而不是lable,所以这里要设置为反过来
                          label: val.id,
                        }));

                        const createFilter = (queryString: string) => {

                        /**
                         * (item: any) 表示函数接受一个名为 item 的参数，类型声明为 any，意味着它可以接受任何类型的参数。在实际应用中，你应该尽量明确参数类型，但这里为了通用性使用了 any 类型。
                         * item.value.toLowerCase() 将 item 对象的 value 属性转换为小写字符串。
                         * queryString.toLowerCase() 同样将外部传入的 queryString 变量转换为小写字符串。。
                         * .includes(queryString.toLowerCase()) 在 item.value 转换为小写后的字符串中查找 queryString 转换为小写后的字符串,只要包含在里面就会返回数据
                         */
                          
                        // `${item.value}`是把他先转为字符串,这样才统一queryString及item.value的格式都为字符串string
                        return (item: any) => `${item.value}`.toLowerCase().includes(queryString.toLowerCase());


                        };
                      
                        //这里使用三元运算,这里先判断queryString && queryString !=="null",如果为真,则调用前面的fileLists.filter(createFilter(queryString)),否则直接给fileLists
                        const results = queryString && queryString !=="null" ? fileLists.filter(createFilter(queryString)) : fileLists;

                        cb(results); // 将筛选结果传递给回调函数
                    }else{
                      // 如果没有传进来dynamic_url.value&&dynamic_label.value,则返回空数组,即是不需要搜索
                      let fileLists: Array<any> = []
                      return fileLists

                    }


                  },
                  // 注释编号:django-vue3-admin-crud190011:代码结束行

              },


            },
            column: {
              rules: [{required: true, message: "接入信息必选项"},],
            },


          },
        },

          
          port_direction: {
            title: '端口方向',
            type: 'dict-select',
            
            dict: dict({
                value: 'dictNum',
                label: 'dictName',
                getData: async ({ url }: { url: string }) => {
                    const curId = await request({
                        url: '/api/globalDictModelViewSet/?dictName=lineTagPortDirection',
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

            form: {
                component: {
                    span: 12,

                },
            },
            column: {
              minWidth: 60, //最小列宽
              valueChange({row}){   // 这里使用valueChange，取消select选择之后，拿到了""空值传给后端，会导致出错，这里做了判断，重置为null就不会出错了
                if(row.port_direction == ""){
                  row.port_direction = null
                }

            },

            },
            component: { props: { color: 'auto' } }, // 自动染色
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
              minWidth: 60, //最小列宽
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
          description: {
            title: "备注说明",
            type: "input",
            column: {
              show: true,
            },
          },
          url: {
            title: '设备归属之URL',
            type: 'input',
            column: {
              show: false,
            },

          },
          label: {
            title: '设备归属之label',
            type: 'input',
            column: {
              show: false,
            },

          },
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
  
