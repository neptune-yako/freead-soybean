import { h, reactive } from 'vue';
import { NButton, NPopconfirm, NProgress, NSpace, NSwitch, NTag } from 'naive-ui';
import { useNaivePaginatedTable } from '@/hooks/common/table';
import { fetchGetRedeemCodes, fetchGetRedeemRecords, fetchUpdateRedeemCode, fetchInvalidateExpiredCodes } from '@/service/api/redeem';
import { fetchGetMembershipPlans } from '@/service/api/membership';
import { $t } from '@/locales';

/** 兑换码列表逻辑 */
export function useRedeemTable(onEdit: (row: Api.Redeem.RedeemCode) => void) {
  const searchParams = reactive<Api.Redeem.CodeSearchParams>({
    is_active: undefined,
    plan_id: undefined
  });

  const {
    data,
    loading,
    empty,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    getData
  } = useNaivePaginatedTable<
    Api.Admin.PaginationData<Api.Redeem.RedeemCode>,
    Api.Redeem.RedeemCode
  >({
    api: async () => {
      const res = await fetchGetRedeemCodes(searchParams);
      return res as any; // 这里的类型转换是为了适配 useTable 的内部推导，后续可通过细化 @sa/hooks 解决
    },
    columns: () => [
      {
        key: 'id',
        title: 'ID',
        align: 'center',
        width: 60
      },
      {
        key: 'code_string',
        title: $t('page.management_redeem.code'),
        align: 'center',
        minWidth: 150,
        render: row => h(NSpace, { align: 'center', justify: 'center' }, {
          default: () => [
            h('code', { class: 'bg-gray-100 px-4px py-2px rounded text-primary font-mono' }, row.code_string),
            h(NButton, {
              quaternary: true,
              circle: true,
              size: 'tiny',
              onClick: () => {
                navigator.clipboard.writeText(row.code_string);
                window.$message?.success('已复制到剪贴板');
              }
            }, { icon: () => h('div', { class: 'i-ic-round-content-copy text-14px' }) })
          ]
        })
      },
      {
        key: 'plan_name',
        title: $t('page.management_redeem.planName'),
        align: 'center',
        minWidth: 100,
        render: row => h(NTag, { type: 'info', ghost: true }, { default: () => row.plan_name })
      },
      {
        key: 'valid_time',
        title: $t('page.management_redeem.validTime'),
        align: 'center',
        width: 200,
        render: row => h('div', { class: 'text-12px' }, [
          h('div', `起: ${row.valid_from || '-'}`),
          h('div', `止: ${row.valid_until || '-'}`)
        ])
      },
      {
        key: 'current_uses',
        title: $t('page.management_redeem.currentUses'),
        align: 'center',
        width: 150,
        render: row => {
          const percentage = row.max_uses > 0 ? Math.round((row.current_uses / row.max_uses) * 100) : 0;
          const status = percentage >= 100 ? 'success' : 'default';
          return h(NSpace, { vertical: true, itemStyle: 'line-height:1' }, {
            default: () => [
              h(NProgress, {
                type: 'line',
                percentage,
                indicatorPlacement: 'inside',
                processing: row.is_active && percentage < 100,
                status: status as any
              }),
              h('div', { class: 'text-12px text-gray-400 font-mono' }, `${row.current_uses} / ${row.max_uses === 0 ? '∞' : row.max_uses}`)
            ]
          });
        }
      },
      {
        key: 'is_active',
        title: $t('page.management_redeem.status'),
        align: 'center',
        width: 80,
        render: row => h(NSwitch, {
          value: row.is_active,
          onUpdateValue: () => toggleStatus(row)
        })
      },
      {
        key: 'operate',
        title: $t('common.action'),
        align: 'center',
        width: 100,
        render: row => h(NSpace, { align: 'center', justify: 'center' }, {
          default: () => [
            h(NButton, {
              type: 'primary',
              ghost: true,
              size: 'small',
              onClick: () => onEdit(row)
            }, { default: () => $t('common.edit') })
          ]
        })
      }
    ],
    transform: (res: any) => {
      const data = res?.data || [];
      return {
        data,
        pageNum: 1,
        pageSize: data.length || 10,
        total: data.length
      };
    }
  });

  /** 更新状态 */
  async function toggleStatus(row: Api.Redeem.RedeemCode) {
    const { error } = await fetchUpdateRedeemCode(row.id, { is_active: !row.is_active });
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      await getData();
    }
  }

  /** 批量失效过期码 */
  async function handleBatchInvalidate() {
    window.$dialog?.warning({
      title: $t('common.tip'),
      content: $t('page.management_redeem.confirmInvalidate'),
      positiveText: $t('common.confirm'),
      negativeText: $t('common.cancel'),
      onPositiveClick: async () => {
        const { error, data: count } = await fetchInvalidateExpiredCodes();
        if (!error) {
          window.$message?.success(`${$t('common.updateSuccess')} (清理了 ${count} 条)`);
          await getData();
        }
      }
    });
  }

  return {
    searchParams,
    data,
    loading,
    empty,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    getData,
    toggleStatus,
    handleBatchInvalidate
  };
}

/** 兑换流水审计逻辑 */
export function useRedeemRecordTable() {
  const searchParams = reactive<Api.Redeem.RecordSearchParams>({
    user_id: undefined,
    code_id: undefined
  });

  const {
    data,
    loading,
    empty,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    getData
  } = useNaivePaginatedTable<Api.Admin.PaginationData<Api.Redeem.RedeemRecord>, Api.Redeem.RedeemRecord>({
    api: async () => {
      const res = await fetchGetRedeemRecords(searchParams);
      return res as any;
    },
    columns: () => [
      {
        key: 'id',
        title: 'ID',
        align: 'center',
        width: 60
      },
      {
        key: 'user_id',
        title: $t('page.management_redeem.user'),
        align: 'center',
        minWidth: 100,
        render: row => h(NTag, { type: 'primary', ghost: true }, { default: () => `UID: ${row.user_id}` })
      },
      {
        key: 'code_string',
        title: $t('page.management_redeem.code'),
        align: 'center',
        minWidth: 150,
        render: row => h(NSpace, { align: 'center', justify: 'center' }, {
          default: () => [
            h('code', { class: 'bg-gray-100 px-4px py-2px rounded text-primary font-mono' }, row.code_string),
            h(NButton, {
              quaternary: true,
              circle: true,
              size: 'tiny',
              onClick: () => {
                navigator.clipboard.writeText(row.code_string);
                window.$message?.success('已复制到剪贴板');
              }
            }, { icon: () => h('div', { class: 'i-ic-round-content-copy text-14px' }) })
          ]
        })
      },
      {
        key: 'created_at',
        title: $t('page.management_redeem.redeemedAt'),
        align: 'center',
        minWidth: 160
      }
    ],
    transform: (res: any) => {
      const data = res?.data || [];
      return {
        data,
        pageNum: 1,
        pageSize: data.length || 10,
        total: data.length
      };
    }
  });

  return {
    searchParams,
    data,
    loading,
    empty,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    getData
  };
}

/** 获取套餐选项用于下拉框 */
export async function getPlanOptions() {
  const { data } = await fetchGetMembershipPlans();
  return (data || []).map(item => ({
    label: item.name,
    value: item.id
  }));
}
