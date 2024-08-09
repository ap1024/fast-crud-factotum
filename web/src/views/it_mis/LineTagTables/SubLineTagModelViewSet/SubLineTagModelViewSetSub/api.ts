import { id } from 'element-plus/es/locale';
import { request,downloadFile } from '/@/utils/service';
import { PageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

export const apiPrefix = '/api/SubLineTagModelViewSet/';


export function GetList(query: PageQuery) {
	return request({
		url: apiPrefix,
		method: 'get',
		params: query,  // 注释编号:django-vue3-admin__api351018:新版本已经把父ID直接放在query里面了不需要再单独传了
	})
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

// 注释编号:django-vue3-admin__api455216:重新写一条数据要匹配上移及下移时提交数据
export function RowUpdateObj(obj: EditReq) {
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
