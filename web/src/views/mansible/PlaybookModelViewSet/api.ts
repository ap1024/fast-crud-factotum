import { request, downloadFile } from '/@/utils/service';
import { PageQuery, AddReq, DelReq, EditReq, InfoReq } from '@fast-crud/fast-crud';

export const apiPrefix = '/api/PlaybookModelViewSet/';



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

export function exportData(params: any) {
  return downloadFile({
    url: apiPrefix + 'export_data/',
    params: params,
    method: 'get'
  });
}

export function ReadFile(filePath: string) {
  return request({
    url: apiPrefix + 'read_file/',
    method: 'get',
    params: { file_path: filePath }
  });
}



// eslint-disable-next-line no-dupe-args, @typescript-eslint/no-redeclare
export function SaveFile(filePath: string, content: string) {
  return request({
    url: apiPrefix + 'save_file/',
    method: 'post',
    data: { file_path: filePath,content: content }
  });
}