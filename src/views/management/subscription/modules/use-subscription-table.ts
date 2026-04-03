import { h, reactive } from 'vue';
import { NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetSubscriptionList } from '@/service/api/subscription';
import { useNaivePaginatedTable } from '@/hooks/common/table';

export function useSubscriptionTable() {
  /** 内部状态：分页与查询参数 */
  const queryParams = reactive<Api.Subscription.SubscriptionListFilter>({
    page: 1,
    size: 10,
    user_id: null,
    tier_code: null,
    status: null
  });

  const {
    data,
    loading,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    getData,
    getDataByPage
  } = useNaivePaginatedTable({
    api: () => {
      // 物理删除 null/undefined 字段，确保后端不报错，UI 能清空
      const filteredParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, v]) => v !== null && v !== undefined)
      );
      return fetchGetSubscriptionList(filteredParams);
    },
    transform: res => {
      const { items = [], total = 0, page = 1, size = 10 } = res.data || {};

      return {
        data: items,
        pageNum: page,
        pageSize: size,
        total
      };
    },
    onPaginationParamsChange: params => {
      queryParams.page = params.page;
      queryParams.size = params.pageSize;
    },
    columns: () => [
      {
        key: 'id',
        title: 'ID',
        align: 'center',
        width: 80
      },
      {
        key: 'user_id',
        title: '用户 ID',
        align: 'center',
        width: 100,
        render: row => h(NTag, { quaternary: true, type: 'info', size: 'small' }, { default: () => `UID: ${row.user_id}` })
      },
      {
        key: 'tier_code',
        title: '会员等级',
        align: 'center',
        width: 150,
        render: row => {
          const tierMap: Record<string, { type: 'default' | 'primary' | 'warning'; label: string }> = {
            free: { type: 'default', label: '普通用户 (free)' },
            vip: { type: 'primary', label: '专业版 (pro)' },
            svip: { type: 'warning', label: '尊享版 (primeAI)' }
          };
          const { type, label } = tierMap[row.tier_code] || { type: 'default', label: row.tier_code };
          return h(NTag, { type, bordered: false }, { default: () => label });
        }
      },
      {
        key: 'start_time',
        title: '生效时间',
        align: 'center',
        minWidth: 160,
        render: row => dayjs(row.start_time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        key: 'expire_time',
        title: '到期时间',
        align: 'center',
        minWidth: 160,
        render: row => dayjs(row.expire_time).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        key: 'status',
        title: '订阅状态',
        align: 'center',
        width: 120,
        render: row => {
          const statusMap: Record<Api.Subscription.SubscriptionStatus, { type: 'success' | 'default' | 'error'; label: string }> = {
            active: { type: 'success', label: '生效中 (Active)' },
            expired: { type: 'default', label: '已到期 (Expired)' },
            cancelled: { type: 'error', label: '已取消 (Cancelled)' }
          };
          const { type, label } = statusMap[row.status] || { type: 'default', label: '未知' };
          return h(NTag, { type }, { default: () => label });
        }
      },
      {
        key: 'created_at',
        title: '创建时间',
        align: 'center',
        width: 160,
        render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
      }
    ]
  });

  /** 重置查询参数 */
  function resetQueryParams() {
    Object.assign(queryParams, {
      page: 1,
      user_id: null,
      tier_code: null,
      status: null
    });
  }

  return {
    queryParams,
    resetQueryParams,
    data,
    loading,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    getData,
    getDataByPage
  };
}
