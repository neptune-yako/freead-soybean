import { adminRequest } from '../request';

/**
 * 问卷运营概览 (指标卡片)
 *
 * @description 展示全站累计总数与今日新增数
 */
export function fetchGetFeedbackOverview() {
  return adminRequest<Api.Feedback.Overview>({
    url: '/feedback/overview',
    method: 'get'
  });
}

/**
 * 问卷选项聚合统计 (直连图表)
 *
 * @description 后端已预计算百分比，可作为 ECharts 饼图等数据源
 */
export function fetchGetFeedbackStats() {
  return adminRequest<Api.Feedback.QuestionStats[]>({
    url: '/feedback/stats',
    method: 'get'
  });
}

/**
 * 获取全量问卷提交记录 (明细查询)
 *
 * @param params 分页参数
 */
export function fetchGetFeedbackRecords(params?: Api.Feedback.RecordSearchParams) {
  return adminRequest<Api.Admin.PaginationData<Api.Feedback.RecordItem>>({
    url: '/feedback/records',
    method: 'get',
    params
  });
}
