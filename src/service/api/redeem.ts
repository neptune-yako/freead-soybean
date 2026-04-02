import { adminRequest } from '../request';

/**
 * 查询兑换码清单
 *
 * @param params 分页与筛选参数
 */
export function fetchGetRedeemCodes(params?: Api.Redeem.CodeSearchParams) {
  return adminRequest<Api.Admin.PaginationData<Api.Redeem.RedeemCode>>({
    url: '/redeem/codes',
    method: 'get',
    params
  });
}

/**
 * 手动创建兑换码
 *
 * @param data 激活码详细信息
 */
export function fetchCreateRedeemCode(data: Api.Redeem.CodeRequest) {
  return adminRequest<boolean>({
    url: '/redeem/codes',
    method: 'post',
    data
  });
}

/**
 * 更新兑换码规则
 *
 * @param id 激活码ID (code_id)
 * @param data 待更新字段
 */
export function fetchUpdateRedeemCode(id: number, data: Partial<Api.Redeem.CodeRequest>) {
  return adminRequest<boolean>({
    url: `/redeem/codes/${id}`,
    method: 'patch',
    data
  });
}

/**
 * 获取全量兑换流水记录 (审计)
 *
 * @param params 审计查询参数
 */
export function fetchGetRedeemRecords(params?: Api.Redeem.RecordSearchParams) {
  return adminRequest<Api.Admin.PaginationData<Api.Redeem.RedeemRecord>>({
    url: '/redeem/records',
    method: 'get',
    params
  });
}

/**
 * 批量清除过期码 (系统扫描操作)
 *
 * @description 强制将 valid_until 已过的激活码标记为禁用
 */
export function fetchInvalidateExpiredCodes() {
  return adminRequest<number>({
    url: '/redeem/operations/invalidate-expired',
    method: 'post'
  });
}
