import { adminRequest } from '../request';

/**
 * 获取管理员列表
 *
 * @param params 分页参数
 */
export function fetchGetAdminList(params?: Api.Admin.AdminSearchParams) {
  return adminRequest<Api.Admin.PaginationData<Api.Admin.AdminProfile>>({
    url: '/',
    method: 'get',
    params
  });
}

/**
 * 新增管理员
 *
 * @param data 管理员信息
 */
export function fetchCreateAdmin(data: Api.Admin.AdminCreate) {
  return adminRequest<boolean>({
    url: '/',
    method: 'post',
    data
  });
}

/**
 * 修改管理员资料/密码 (支持局部更新)
 *
 * @param id 管理员ID
 * @param data 修改信息
 */
export function fetchUpdateAdmin(id: number, data: Api.Admin.AdminUpdate) {
  return adminRequest<boolean>({
    url: `/${id}`,
    method: 'patch',
    data
  });
}

/**
 * 逻辑删除管理员
 *
 * @param id 管理员ID
 */
export function fetchDeleteAdmin(id: number) {
  return adminRequest<boolean>({
    url: `/${id}`,
    method: 'delete'
  });
}
