import { adminRequest } from '../request';

/**
 * 分组拉取阅读器配置清单
 *
 * @param group_name 分组名称
 * @param only_visible 是否只拉取可见配置 (默认需携带 true)
 */
export function fetchGetReaderConfigsByGroup(group_name: string, only_visible = true) {
  return adminRequest<Api.Reader.ConfigItem[]>({
    url: `/reader/configs/${group_name}`,
    method: 'get',
    params: { only_visible }
  });
}

/**
 * 管理端：分页查询配置项
 *
 * @param params 分页参数 (skip, limit)
 */
export function fetchGetReaderConfigList(params?: Api.Reader.ConfigSearchParams) {
  return adminRequest<Api.Admin.PaginationData<Api.Reader.ConfigItem>>({
    url: '/reader/configs',
    method: 'get',
    params
  });
}

/**
 * 管理端：创建新的配置
 *
 * @param data 配置详细信息
 */
export function fetchCreateReaderConfig(data: Api.Reader.ConfigCreate) {
  return adminRequest<boolean>({
    url: '/reader/configs',
    method: 'post',
    data
  });
}

/**
 * 管理端：更新现有配置信息
 *
 * @param id 配置ID (config_id)
 * @param data 待更新字段
 */
export function fetchUpdateReaderConfig(id: number, data: Api.Reader.ConfigUpdate) {
  return adminRequest<boolean>({
    url: `/reader/configs/${id}`,
    method: 'patch',
    data
  });
}

/**
 * 管理端：逻辑移除配置
 *
 * @param id 配置ID
 */
export function fetchDeleteReaderConfig(id: number) {
  return adminRequest<boolean>({
    url: `/reader/configs/${id}`,
    method: 'delete'
  });
}
