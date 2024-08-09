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
  import { ref } from "vue";
  import _ from "lodash-es";



  
  export default function ({ crudExpose, context }: CreateCrudOptionsProps): CreateCrudOptionsRet {
    const { crudBinding } = crudExpose;
    const { parentIdRef } = context;

    // 注释编号:django-vue3-admin-crud290016:拿到showStatus的值，并对于!showStatus.value.disabled的值这里如果点查看进来的就会拿到false，如果编辑进来的就会true
    const { showStatus } = context;


    const pageRequest = async (query: any) => {
      // 注释编号:django-vue3-admin__crud312516:这里不再需求把parentIdRef.value做ID传进去，因为新版本已经直接把父ID封装到query里面了
      return await api.GetList(query);   
    };
    const editRequest = async ({ form, row }: EditReq) => {
      if (form.id == null) {
        form.id = row.id;
      }
      return await api.UpdateObj(form);
    };

    // 注释编号:django-vue3-admin__crud585116:重新写一条数据要匹配上移及下移时提交数据
    const rowEditRequest = async ({ row }: EditReq) => {

      return await api.RowUpdateObj(row);
    };
 

    const delRequest = async ({ row }: DelReq) => {
      return await api.DelObj(row.id);
    };
  
    const addRequest = async ({ form }: AddReq) => {

      // 注释编号:django-vue3-admin__crud512516:这里要进行修改，需要返回ID对行，不然第二次点击新增时，会引发两条数据同时进行编辑
      const result = await api.AddObj(form);
      return { id: result.data.id };
    };


    // 注释编号:django-vue3-admin-crud264910:这是是配置一个变量去拿到编辑时，传过来的当前行数据
    let curRowData = ref()


    // 注释编号:django-vue3-admin-crud390616:配合table单选存储的当前行数据
    const curChangeRow = ref()

    const editStatus = ref(false)  // 这里存一个点击编辑按钮的状态，默认为false

    // 注释编号:django-vue3-admin-crud210616:这是单选选中触发的方法
    const onCurrentChange = (row:any) =>{   
        curChangeRow.value = row

    }


    const  device_ownership_dit_ref =  dict({
      isTree:true,
      cache: true, 
      prototype: true,  // 注释编号:django-vue3-admin__crud382417:这里配置每一次记录都单独请求一次，这是必须的，要不后面就无法做懒加载
      value: 'id',
      getData: async ({ row ,value, dict, componentRef}: any) => {// 注释编号:django-vue3-admin-crud150812:传componentRef进来，这样我们可以在当前函数内拿到componentRef传过来的值

        
        // 注释编号:django-vue3-admin-crud085511:let values是为了做懒加载准备的
        let values= [];
        values.push(value)


        if (componentRef && componentRef.url){
          
          const new_url = `${componentRef.url}/?limit=999`    //进行动态拼接路由URL请求地址

          dict.label = componentRef.label // 注释编号:django-vue3-admin__crud181318:不同地请求有不同的label对应字段，label做成动态赋予

          return request({
            url: new_url,
          }).then((ret: any) => {
            return ret.data;
            });
          } else{
            // 注释编号:django-vue3-admin__crud462417:这里就是配置第一次点开，需要去处理的请求,这里看一下是否可以做成懒加载，这样请求才不会请求大量的数据

              if(value){    //这里要判断当前的值是否为真，才进行请求，不为真的情况下，比如点击新增时，就不应该进行请求
                
                if(row&&!editStatus.value){  //这里添加了添加编辑状态，如果点击编辑进来的，那这里就匹配不成功，走else配置

                  const new_url = `${row.device_ownership_url}/getbyIds/`    // 注释编号:django-vue3-admin-crud325511:这里做成了懒加载，加载速度才会明显的快起来。
                  dict.label = row.device_ownership_label

                  //进来正确开始处理数据时，要把判断值重置，防止变量继续存储到数据，影响到其它功能
                  editStatus.value = false

                  return request({
                    url: new_url,
                    method: "post",
                    data: {values},
                  }).then((ret: any) => {
                    return ret.data;
                    });
                } else if(curRowData.value && curRowData.value.device_ownership_url && editStatus.value){  //这里要做个判断，必须要curRowData.value.device_ownership_url有值才能进行请求处理
                  // 注释编号:django-vue3-admin-crud214617:点编辑的时候，才会进到这里进行请求
                  //curRowData是由编辑按钮拿到的值传进来的

                    const new_url = `${curRowData.value.device_ownership_url}/?limit=999`
                    dict.label = curRowData.value.device_ownership_label

                    //进来正确开始处理数据时，要把判断值重置，防止变量继续存储到数据，影响到其它功能
                    curRowData.value = ref()
                    editStatus.value = false

                    return request({
                      url: new_url,
                    }).then((ret: any) => {
                      return ret.data;
                      });

                  } else if(curChangeRow.value && curChangeRow.value.device_ownership_url && editStatus.value){//这里要做个判断，必须要curChangeRow.value.device_ownership_url有值才能进行请求处理
                    //点击复制数据之后，进来这里进行拼接新的URl及label，而curChangeRow是我们选中的当前行数据

                    const new_url = `${curChangeRow.value.device_ownership_url}/?limit=999`
                    dict.label = curChangeRow.value.device_ownership_label

                    //进来正确开始处理数据时，要把判断值重置，防止变量继续存储到数据，影响到其它功能
                    curChangeRow.value = ref()
                    editStatus.value = false

                    return request({
                      url: new_url,
                    }).then((ret: any) => {
                      return ret.data;
                      });

                  }
           

              } 

          }
        },

    })

 
  
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

            // 注释编号:django-vue3-admin-crud243914:代码开始行
            // 功能说明:自定义复制一条线行数据
            copyRow: {
              text:"复制",//按钮文字
              type:"warning",  //修改颜色
              show:!showStatus.value.disabled, // 按查看与编辑的情况下显示或隐藏当前按钮
              async click(){
                try{
                  if(curChangeRow.value){
                    let copyRowData = JSON.parse(JSON.stringify(curChangeRow.value)); // 深拷贝对象

                    //如下是为要排除的字段,每张子表可能有所不同，可以使用console.log("111111111111", copyRowData)查看一下
                    const excludeFields = ['id', 'sortIndex', 'create_datetime', 'update_datetime', 'dept_belong_id', 'modifier', 'creator', '$editable_id', 'modifier_name', 'creator_name'];
                    for(let field of excludeFields) {
                        delete copyRowData[field];
                    }

                    //调用新增方法，并且把调整好的copyRowData传进去，如下我们就一定要配置 crudBinding.value?.table?.editable?.addRow方法
                    crudBinding.value?.table?.editable?.addRow(crudBinding.value.data, copyRowData)

                    //复制数据，相当于引发编辑状态，所以这里要配置editStatus.value = true来引发相应的dict的URl及label的不同加载
                    editStatus.value = true

                    //刷新dict字典
                    device_ownership_dit_ref.reloadDict()

                }

                }catch (error) {
                  console.error('Error editing row:', error);
                }

              },

            },
            // 注释编号:django-vue3-admin-crud243914:代码结束行





            // 注释编号:django-vue3-admin-crud541816:代码开始行
            // 功能说明:上下移动行数据的实现
            sortUp:{
              text:"上移",//按钮文字
              // title:"数据必须先单击选中之后再单击上移",//鼠标停留显示的信息
              type:"success",  //修改为绿色
              show:!showStatus.value.disabled, // 注释编号:django-vue3-admin-crud550115:按查看与编辑的情况下显示或隐藏当前按钮
              async click(){
                try {
                // 注释编号:django-vue3-admin-crud020816:选移动对象时，先去拿到当前table单选之选中的对象（选中的行数据）
                let  row = curChangeRow.value
                
                if (row.sortIndex != 1){   //这里要进行判断如果是选中了第一条的话,那就不再执行上移的操作,防止出错

                  // 注释编号:django-vue3-admin__crud033511:在所有crudBinding.value.data数据当中找到上一个row.sortIndex - 1的对象，并且去除[].shift()返回一个字典对象
                  let anotherRow = crudBinding.value.data?.filter(item => item.sortIndex === row.sortIndex - 1).shift();  //拿到当前单选选中数据的上一条数据

                  anotherRow.sortIndex = anotherRow.sortIndex + 1   //上一条数据减1排序
                  row.sortIndex = row.sortIndex - 1          //当前选中的这一条数据+1排序
  

                  // 注释编号:django-vue3-admin__crud594716:这里自己重新做一条row提交的请求,不要直接使用crudExpose.editable.doSaveRow({row}) ,这样页面就不会存在闪一下的情况
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
              show:!showStatus.value.disabled, // 注释编号:django-vue3-admin-crud252816:按查看与编辑的情况下显示或隐藏当前按钮
              async click(){

                try {
                  const  row = curChangeRow.value
                  const anotherRow = crudBinding.value.data?.filter(item => item.sortIndex === row.sortIndex + 1).shift();
                  if (anotherRow){ //判断他是否还有下一条数据,如果没有了,说明当前这一条数据是最后一条,那就不需要再下移了
  
                    row.sortIndex = row.sortIndex + 1
                    anotherRow.sortIndex = anotherRow.sortIndex - 1
  
                    //先取消所有行的编辑状态
                    crudExpose.editable.cancel()
  
                    // 注释编号:django-vue3-admin__crud594716:这里自己重新做一条row提交的请求,不要直接使用crudExpose.editable.doSaveRow({row}) ,这样页面就不会存在闪一下的情况

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
          // 注释编号:django-vue3-admin-crud300516:代码开始行
          // 功能说明:启用table的单选功能及触发的事件
          highlightCurrentRow:true, //启用单选方法，与onCurrentChange单选事件做配套
          onCurrentChange,//启用单独事件，与highlightCurrentRow单选方法做配套
          // 注释编号:django-vue3-admin-crud300516:代码结束行

          editable: {
            // rowKey:'id',
            // rowKey:'_index',
            enabled: true,
            mode: "row",
            activeDefault: false,

            //排它式激活，限制当前子表行编辑只能同时激活一行,当前mode: "row",状态下不生效
            exclusive: true,
            exclusiveEffect: "save", // "cancel" | "save";


            addRow: (data: any[], row: any)=>{
              // (data: any[], row: any) => void
              //在最后一行插入数据
              data.push(row)
              },
          }
        },
        rowHandle: {

          width:200,   // 注释编号:django-vue3-admin-crud390718:这里要重新定义一个宽度，因为全局定制了170，这里不够使用

          //这个地方才是配置了子表中编辑、取消、保存等按钮的地方
          group: {
             "editRow": { //行编辑模式

              // 注释编号:django-vue3-admin-crud170618:代码开始行
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



                  // 注释编号:django-vue3-admin-crud204810:这里是拿到了当前点击编辑的行数据,并且赋值给curRowData，对标注释编号:django-vue3-admin-crud264910
                  curRowData.value = context.row


                  // editStatus.value = false  //配置一个编辑状态,先把他恢复成
                  editStatus.value = true  //配置一个编辑状态

                 
                  // 注释编号:django-vue3-admin-crud085714:功能说明:对动态的URL及label进行判断及赋值,这里主要是给accessInfo字段使用的
                  // console.log("1111111111", context.row)
                  // if(context.row.device_ownership_url&&context.row.device_ownership_label){
                  //   dynamic_url.value = context.row.url
                  //   dynamic_label.value = context.row.label
                  //  }

                 },
              }, 

              // 注释编号:django-vue3-admin-crud170618:代码结束行
             
              save: {
                click: async (context: ScopeContext) => {
                  const { index, row } = context;

                  // 注释编号:django-vue3-admin__crud463316:代码开始行
                  // 功能说明:这里通过对应的dict的id再拿到url去请求回来对应的label值，当然如果fastcrud后面发现可以直接在页面上拿到对应的dict里面的id及label那最好了，这里就可以直接优化掉了。
                 
                  if (row.device_ownership_url&&row.device_ownership){  //这里一定要先做个判断，防止点击新增之后，什么都没有填写，就直接按保存提交了，从而引发下面request请求的错误
                    const new_url = `${row.device_ownership_url}/${row.device_ownership}`

                    const retdata = await request({
                      url: new_url,
                    }).then((ret: any) => {
                      return ret.data[row.device_ownership_label];
                      });
  
                    row.device_ownership_title = retdata
               
                  }

                  // 注释编号:django-vue3-admin__crud463316:代码结束行


                  

                  // 注释编号:django-vue3-admin__crud075017:代码开始行
                  // 功能说明:在点击保存时，前端对row.sortIndex进行处理
                  if (row.device_ownership_url&&row.device_ownership){
                    //如果当前行没有sortIndex值，说明是新增的对象，那么就要自动给添加sortIndex的值
                    if(!row.sortIndex){
                      const dictLength = Object.keys(crudBinding.value.data).length;   //查询当前整个table有多少条数据，包括点击保存的当前对象
                      row.sortIndex = dictLength

                    }
                  }
                  // 注释编号:django-vue3-admin__crud075017:代码结束行

                  await crudExpose.editable.doSaveRow({ row });    //行数据做保存
                },


              },
            },
          }
        
        },
        pagination: { show: false, pageSize: 9999999 },
        columns: {
        
          // 注释编号:django-vue3-admin-crud532910:代码开始行
          // 功能说明:配置出来fastcrud自带的index索引字段
          _index: {  //把table表索引给显示出来
            title: "线序",
            form: { show: false },
            column: {
              align: "center",
              columnSetDisabled: true, //禁止在列设置中选择
            }
          },
          // 注释编号:django-vue3-admin-crud532910:代码结束行

          sortIndex:{
            title: "排序",
            form: { show: false },
            column: {
              show:false,  //要把这个专门拿来排序的字段进行隐藏显示
              align: "center",
              columnSetDisabled: true, //禁止在列设置中选择

            },

          },

          // 注释编号:django-vue3-admin-crud084317:代码开始行
          // 功能说明:联动选择中主动的select项目，它自己的选择项目会引发被动字典的dict根据新的需求请求重新请求
          lineaccesstype: {
            title: '线路接入类型',
            type: 'dict-select',
            dict: dict({
              // 注释编号:django-vue3-admin-crud274017:这里传&filterUrlAndLabel=yes是让后端判断一下，把url及label过滤掉空的对象，再传给前端，这里要后端在querySet中进行处理
              url: '/api/lineAccessTypeModelViewSet/?limit=999&filterUrlAndLabel=yes',  
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
                // 注释编号:django-vue3-admin__crud165216:代码开始行
                // 功能说明:异步函数的处理，如果不写成异步，那怕是赋值后，也总是拿到变动前的值
              //   async valueChange ({row,getComponentRef}){
              //     row.device_ownership= undefined;  //把row.device_ownership的值置空，因为它可能会被先选择了值，所以要置空它，接下来的代码便是再重新加载一下字典

              //     //把当前字段线路接入类型的值给传到getComponentRef("device_ownership")字典中的data拿到

              //     if (row.lineaccesstype){
              //       const data = getComponentRef("lineaccesstype").dict._data   
              //       //根据当前选中的id值去字典data里面拿到对应的url
              //       let new_data = data.find(obj => obj.id === row.lineaccesstype)
              //       let id_url = new_data.url;  
              //       let label = new_data.label
              //       //把对应的url传给设备归属device_ownership
              //       getComponentRef("device_ownership").url = id_url
              //       getComponentRef("device_ownership").label = label

              //       row.device_ownership_url = id_url   //这里把当前设备归属对应的url进行填充至当前row里面的device_ownership_url
              //       row.device_ownership_label = label   //这里要把label同步给新对象赋值
                    
              //       //重新刷新device_ownership字段的dict字典请求
              //       await getComponentRef("device_ownership").reloadDict();
              //     }



              // },
               // 注释编号:django-vue3-admin__crud165216:代码结束行
              },
  
            form:{
              rules: [{required: true, message: "线路接入类型为必选项"},],
              component:{
                filterable: true,
                on:{

                  // 注释编号:django-vue3-admin-crud233216:代码开始行
                  // 功能说明:选中值之后，再进行device_ownership字段的处理，这里要比在async valueChange ({row,getComponentRef})里面处理更灵活一点
                  onSelectedChange({$event, row, getComponentRef}:{$event:any, row:any, getComponentRef:any}){

                    if ($event.url&&$event.label){

                      row.device_ownership= undefined;//把row.device_ownership的值置空，因为它可能会被先选择了值，所以要置空它，接下来的代码便是再重新加载一下字典

                      //把当前字段线路接入类型的值给传到getComponentRef("device_ownership")字典中的data拿到
                      getComponentRef("device_ownership").url = $event.url
                      getComponentRef("device_ownership").label = $event.label

                      row.device_ownership_url = $event.url  //这里把当前设备归属对应的url进行填充至当前row里面的device_ownership_url
                      row.device_ownership_label = $event.label   //这里要把label同步给新对象赋值


                      //重新刷新device_ownership字段的dict字典请求
                      getComponentRef("device_ownership").reloadDict();

                    }



                  }
                  // 注释编号:django-vue3-admin-crud233216:代码结束行

                },



              },
            },
          },
          // 注释编号:django-vue3-admin-crud084317:代码结束行

          // 注释编号:django-vue3-admin-crud264117:代码开始行
          // 功能说明:联动选择中被动的字典，他的dict是由主的select引发传过来的url及label之后再展现数据的
        
          device_ownership: {  //测试懒加载
            title: "设备归属",
            type: "dict-select",
            search: {
              show: true
            },
            dict: device_ownership_dit_ref,
            form: {
              component: {filterable: true,},
              rules: [{required: true, message: "设备归属为必选项"},],
              
            },
            column: {
              rules: [{required: true, message: "设备归属为必选项"},],
            },


          },
          // 注释编号:django-vue3-admin-crud264117:代码结束行
          
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
              valueChange({row}){   // 注释编号:django-vue3-admin-crud482915:这里使用valueChange，取消select选择之后，拿到了""空值传给后端，会导致出错，这里做了判断，重置为null就不会出错了
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
          },
          device_ownership_url: {
            title: '设备归属之URL',
            type: 'input',
            column: {
              show: false,
            },
          },
          device_ownership_title: {
            title: '设备归属的显示名称',
            type: 'input',
            column: {
              show: false,
            },
          },
          device_ownership_id: {
            title: '设备归属之ID',
            type: 'input',
            column: {
              show: false,
            },
          },
          parentId: {
            title: "父Id-线路编码",
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
  
