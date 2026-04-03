import { adminRequest } from '../request';

/**
 * 获取普通用户分页列表
 *
 * @param params 搜索与分页参数
 */
export function fetchGetUserList(params?: Api.User.UserListFilter) {
  return adminRequest<Api.User.UserPaginationData>({
    url: '/user/list',
    method: 'get',
    params
  });
}

/**
 * 获取单个用户资料详情
 *
 * @param id 用户物理 ID
 */
export function fetchGetUserDetail(id: number) {
  return adminRequest<Api.User.UserAdminInfo>({
    url: `/user/${id}`,
    method: 'get'
  });
}

/**
 * 手动强制刷新会员状态
 *
 * @description 触发后端权益重算逻辑，同步缓存字段
 * @param id 用户物理 ID
 */
export function fetchRefreshUserMembership(id: number) {
  return adminRequest<boolean>({
    url: `/v1/user/${id}/refresh-membership`,
    method: 'post'
  });
}
