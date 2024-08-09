import { CrudOptions, AddReq, DelReq, EditReq, dict, CrudExpose, UserPageQuery, CreateCrudOptionsRet, CreateCrudOptionsProps} from '@fast-crud/fast-crud';
import _ from 'lodash-es';
import * as api from './api';
import { request } from '/@/utils/service';
import { dictionary } from '/@/utils/dictionary';
import { useRouter } from "vue-router";
import { successNotification } from '/@/utils/message';







//此处为crudOptions配置
// export default function ({ crudExpose}: { crudExpose: CrudExpose}): CreateCrudOptionsRet {

export default function ({ crudExpose }: CreateCrudOptionsProps): CreateCrudOptionsRet {

const {crudBinding} = crudExpose

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

	

	const router = useRouter();

	return {
		crudOptions: {
			request: {
				pageRequest,
				addRequest,
				editRequest,
				delRequest,
			},
			form: {
				col: { span: 12 },	//配置成一行两个元素
				labelPosition: "left", 
				labelWidth: "auto", //配置成lable的宽为自动
				requireAsteriskPosition:"right", //星号的位置
				row: { gutter: 40 } ,
				async afterSubmit(ctx: any) {   //这里是配置点击保存之后做的操作
					// 增加crud提示
					if (ctx.res.code == 2000) {
						successNotification(ctx.res.msg);
						//刷新页面,重新请求数据回来,如下三个字典都要刷新一下请求
						await ctx.getComponentRef('dictMark').reloadDict()   
						await ctx.getComponentRef('belongSystem').reloadDict()
						await ctx.getComponentRef('belogTable').reloadDict()
						}
					else if (ctx.res.code == 4000){
						return false  //作者已经修复了这个问题 注释编号:django-vue3-admin__settings065210:这里未来fastcrud作者可能会改为直接返回false便可，期待https://github.com/fast-crud/fast-crud/issues/270
						
						}
				},



			},
			actionbar: {
				buttons: {
						export:{
						click(){
							return exportRequest(crudExpose.getSearchFormData())
						}
					}
				}
			},

			columns: {
				belongSystem: {
					title: '归属系统',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({

						value: 'id',
						label: 'dictName',
						getData: async ({ url }: { url: string }) => {
							//这里查询到dictName=sysName的id返回来,再给到下面的request进行拼接请求
							const curId = await request({
								url: '/api/globalDictModelViewSet/?dictName=sysName',
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
					column: {
						minWidth: 100, //最小列宽
					},
				},

				belogTable: {
					title: '归属使用的表格',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						value: 'id',
						label: 'dictName',
						getData: async ({ url }: { url: string }) => {

							const curId = await request({
								url: '/api/globalDictModelViewSet/?dictName=tableName',
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
					column: {
						minWidth: 100, //最小列宽
					},
				},
				dictMark: {
					title: '字典标记',
					search: {
						show: true,
					},
					type: 'dict-select',
					dict: dict({
						value: 'id',
						label: 'dictName',
						getData: async ({ url }: { url: string }) => {
							const curId = await request({
								url: '/api/globalDictModelViewSet/?dictName=dictMark',
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
					column: {
						minWidth: 100, //最小列宽
					},
					form:{
						bottomRender({ value }) {
							return <el-tag type="success" size='large' style="font-size: 16px;">字典标记只能是纯字母(不分大小写)</el-tag>;
						},
					},
				},
				dictNum: {
					title: '字典序列',
					type: 'number',
					search: { show: false },
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ type: 'number', required: true, message: '字典序列必填' }],
						value:0, //配置该字段为的默认值为0，这与后台要搭配使用也是可以的，后端字段配置default=0
						component: {
							placeholder: '请输入字典序列',
						},
					},
				},
				dictName: {
					title: '字典名称',
					type: 'input',
					search: { show: true},
					column: {
						minWidth: 120,
						sortable: 'custom',
					},
					form: {
						rules: [{ required: true, message: '字典名称必填' }],
						component: {
							placeholder: '请输入字典名称',
						},
						bottomRender({ value }) {
							return <el-tag type="success" size='large' style="font-size: 16px;">如录入是为字典标记必须是纯字母</el-tag>;
						},
					},
				},




			},




		},
	};
};
