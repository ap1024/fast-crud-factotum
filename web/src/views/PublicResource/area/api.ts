import { request,downloadFile } from '/@/utils/service';
import { PageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

// 注释编号:django-vue3-admin__api462215:这里修改配置成当前的api地址便可
export const apiPrefix = '/api/it_area/';


export function GetList(query: PageQuery) {
	return request({
		url: apiPrefix,
		method: 'get',
		params: query,
	});
}
export function GetObj(id: InfoReq) {
	return request({
		url: apiPrefix + id,
		method: 'get',
	});
}

export function AddObj(obj: AddReq) {
	return request({
		url: apiPrefix,
		method: 'post',
		data: obj,
	});
}

export function UpdateObj(obj: EditReq) {
	return request({
		url: apiPrefix + obj.id + '/',
		method: 'put',
		data: obj,
	});
}

export function DelObj(id: DelReq) {
	return request({
		url: apiPrefix + id + '/',
		method: 'delete',
		data: { id },
	});
}

export function exportData(params:any){
    return downloadFile({
        url: apiPrefix + 'export_data/',
        params: params,
        method: 'get'
    })
}


// 注释编号:django-vue3-admin-api070210:代码开始行
// 功能说明:添加一个专门的请求

export function GetPermission() {
	return request({
		url: apiPrefix + 'field_permission/',
		method: 'get',
	});
}

// 注释编号:django-vue3-admin-api070210:代码结束行