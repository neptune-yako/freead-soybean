import { h, reactive, ref } from 'vue';
import { NButton, NSpace, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import type { FlatResponseData } from '@sa/axios';
import { fetchGetUserList, fetchRefreshUserMembership } from '@/service/api/user';
import { useNaivePaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';

export function useUserTable() {
  /** 内部状态：分页与过滤参数 */
  const queryParams = reactive<Api.User.UserListFilter>({
    page: 1,
    size: 10,
    nickname: undefined,
    member_level: undefined
  });

  /** 状态更新队列：用于单个按钮的加载状态 */
  const statusLoadingIds = ref<Set<number>>(new Set());

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
    api: () => fetchGetUserList(queryParams),
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
        key: 'nickname',
        title: '用户昵称',
        align: 'center',
        minWidth: 120,
        render: row => row.nickname || h('span', { class: 'text-gray-400' }, '未设置')
      },
      {
        key: 'openid',
        title: 'OpenID',
        align: 'center',
        minWidth: 200,
        ellipsis: { tooltip: true }
      },
      {
        key: 'member_level',
        title: '会员等级',
        align: 'center',
        width: 120,
        render: row => {
          const levelMap: Record<Api.User.MemberLevel, { type: 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error'; label: string }> = {
            free: { type: 'default', label: '普通用户 (free)' },
            vip: { type: 'primary', label: '专业版 (pro)' },
            svip: { type: 'warning', label: '尊享版 (primeAI)' }
          };
          const { type, label } = levelMap[row.member_level] || { type: 'default', label: '未知' };
          return h(NTag, { type, bordered: false }, { default: () => label });
        }
      },
      {
        key: 'member_expire_at',
        title: '会员到期时间',
        align: 'center',
        minWidth: 160,
        render: row => (row.member_expire_at ? dayjs(row.member_expire_at).format('YYYY-MM-DD HH:mm:ss') : h('span', { class: 'text-gray-400' }, '永久免费'))
      },
      {
        key: 'created_at',
        title: '注册时间',
        align: 'center',
        minWidth: 160,
        render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        key: 'operate',
        title: $t('common.action'),
        align: 'center',
        width: 120,
        render: row => (
          h(NSpace, { align: 'center', justify: 'center' }, {
            default: () => [
              h(
                NButton,
                {
                  type: 'primary',
                  ghost: true,
                  size: 'small',
                  loading: statusLoadingIds.value.has(row.id),
                  onClick: () => handleRefreshMembership(row.id)
                },
                { default: () => '刷新会员' }
              )
            ]
          })
        )
      }
    ]
  });

  /** 手动强制刷新会员状态同步 */
  async function handleRefreshMembership(id: number) {
    statusLoadingIds.value.add(id);
    try {
      const { error } = await fetchRefreshUserMembership(id);
      if (!error) {
        window.$message?.success('权益状态已成功从订阅流水同步');
        // 成功后重新加载当前页数据
        getData();
      }
    } finally {
      statusLoadingIds.value.delete(id);
    }
  }

  return {
    queryParams,
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
