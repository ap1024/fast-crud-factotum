import { AddReq, DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';


//此处为crudOptions配置
export default function ({ crudExpose}: { crudExpose: CrudExpose}): CreateCrudOptionsRet {
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
				delRequest,
			},
			actionbar: {
				buttons: {
						add:{
							show:false
						},
						export:{
                            click(){
                                return exportRequest(crudExpose.getSearchFormData())
                            }
					}
				}
			},
			rowHandle:{

				buttons:{
					edit:{
						show:false
					},
					copy:{
						show:false
					},
					remove:{
						show:false
					}
				}
			},
			columns: {
				parentId: {
					title: '线编号',
					type: 'dict-select',
					search: { 
						component: {
							placeholder: '请输入设备归属查询',
							clearable: true,
							filterable:true,
						},
						show: true
					},
					dict: dict({
						url: '/api/LineTagModelViewSet/?limit=999',
						value: 'id',
						label: 'line_num',
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
						sortable: 'custom',
					},

				},


				lineaccesstype: {
					title: '线路接入类型',
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
						minWidth: 80, //最小列宽

						},
					},

					device_ownership: {  //测试懒加载
						title: "设备归属",
						type: "dict-select",
						// search: {
						// 	show: true     // 注释编号:django-vue3-admin-crud550616:为什么要取消这个搜索，因为当前页面的设备归属搜索其实是搜索device_ownership_title字段
						// },
						dict: dict({
							prototype: true, // 注释编号:django-vue3-admin-crud463016:这里配置每一次记录都单独请求一次，要不然每一条数据无法都根据URL再去请求相差的对象回来
							value: 'id',
							getData: async ({ form ,value, dict}: any) => {
							let values= [];
							values.push(value)
							if(value){    //这里要判断当前的值是否为真，才进行请求
								if(form){
									const new_url = `${form.device_ownership_url}/getbyIds/`  //这里做成了懒加载，加载速度才会明显的快起来。
									dict.label = form.device_ownership_label
									return request({
									url: new_url,
									method: "post",
									data: {values},
									}).then((ret: any) => {
									return ret.data;
									});
								} 							

							} 
			
							},
							
						}),
						column: {
							// minWidth: 120,
							sortable: 'custom',
						},
						},
					device_ownership_url: {
						title: '设备归属之URL',
						type: 'input',
						// search: { show: true},
						readonly:true,
						column: {
							// minWidth: 120,
							sortable: 'custom',
						},
						form: {
							// show:false,
							component: {
								placeholder: '请输入设备归属之URL',
							},
						},
					},
					device_ownership_title: {  // 注释编号:django-vue3-admin-crud170816:这个字段要全部隐藏，因为他只是拿到作搜索使用的，并无实际作用
						title: '设备归属',
						type: 'input',
						search: { 
							component: {
								placeholder: '请输入设备归属查询',
								clearable: true,
							},
							show: true
						},

						column: {
							show:false,
						},
						form: {
							show:false,
							component: {
								placeholder: '请输入设备归属',
							},
						},
					},
					port_direction: {
						title: '端口方向',
						type: 'dict-select',
						dict: dict({
							value: 'dictNum',
							label: 'dictName',
							getData: async () => {
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
							minWidth: 80, //最小列宽
							sortable: 'custom',
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

			},

		},
	};
}
