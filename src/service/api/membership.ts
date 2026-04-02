import { adminRequest } from '../request';

/**
 * 获取所有会员等级清单
 *
 * @description 用于列表展示或在创建“会员套餐”时作为下拉选择项
 */
export function fetchGetMembershipTiers() {
  return adminRequest<Api.Membership.MemberTier[]>({
    url: '/membership/tiers',
    method: 'get'
  });
}

/**
 * 获取等级详情
 *
 * @param id 会员等级ID (tier_id)
 */
export function fetchGetMembershipTierDetail(id: number) {
  return adminRequest<Api.Membership.MemberTier>({
    url: `/membership/tiers/${id}`,
    method: 'get'
  });
}

/**
 * 创建新会员等级
 *
 * @param data 会员等级配置信息
 */
export function fetchCreateMembershipTier(data: Api.Membership.TierCreate) {
  return adminRequest<boolean>({
    url: '/membership/tiers',
    method: 'post',
    data
  });
}

/**
 * 更新会员等级配置 (支持局部更新)
 *
 * @param id 会员等级ID
 * @param data 待修改模型
 */
export function fetchUpdateMembershipTier(id: number, data: Api.Membership.TierUpdate) {
  return adminRequest<boolean>({
    url: `/membership/tiers/${id}`,
    method: 'patch',
    data
  });
}

/**
 * 物理删除会员等级
 *
 * @param id 会员等级ID
 */
export function fetchDeleteMembershipTier(id: number) {
  return adminRequest<boolean>({
    url: `/membership/tiers/${id}`,
    method: 'delete'
  });
}

/**
 * 获取会员套餐清单
 *
 * @param params 搜索参数 (only_active)
 */
export function fetchGetMembershipPlans(params?: Api.Membership.PlanSearchParams) {
  return adminRequest<Api.Membership.MembershipPlan[]>({
    url: '/membership/plans',
    method: 'get',
    params
  });
}

/**
 * 获取单个套餐详情
 *
 * @param id 套餐ID (plan_id)
 */
export function fetchGetMembershipPlanDetail(id: number) {
  return adminRequest<Api.Membership.MembershipPlan>({
    url: `/membership/plans/${id}`,
    method: 'get'
  });
}

/**
 * 创建订阅套餐
 *
 * @param data 套餐配置
 */
export function fetchCreateMembershipPlan(data: Api.Membership.PlanRequest) {
  return adminRequest<boolean>({
    url: '/membership/plans',
    method: 'post',
    data
  });
}

/**
 * 更新套餐配置 (支持局部更新)
 *
 * @param id 套餐ID
 * @param data 待修改模型
 */
export function fetchUpdateMembershipPlan(id: number, data: Partial<Api.Membership.PlanRequest>) {
  return adminRequest<boolean>({
    url: `/membership/plans/${id}`,
    method: 'patch',
    data
  });
}

/**
 * 删除订阅套餐
 *
 * @param id 套餐ID
 */
export function fetchDeleteMembershipPlan(id: number) {
  return adminRequest<boolean>({
    url: `/membership/plans/${id}`,
    method: 'delete'
  });
}

/**
 * 手动强制发放订阅 (补发/赠送时长)
 *
 * @param data 发放参数 (user_id, tier_code, days)
 */
export function fetchManualIssueSubscription(data: Api.Membership.ManualSubscriptionCreate) {
  return adminRequest<boolean>({
    url: '/membership/subscriptions',
    method: 'post',
    data
  });
}

/**
 * 手动触发过期降级 (拉起后台扫描任务)
 *
 * @description 集成了 Redis 分布式锁，若任务已在运行则返回 429
 */
export function fetchTriggerDowngradeWorker() {
  return adminRequest<string>({
    url: '/membership/subscriptions/downgrade',
    method: 'post'
  });
}
