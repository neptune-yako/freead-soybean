import { h, reactive } from 'vue';
import { NButton, NSpace, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetOrderList } from '@/service/api/order';
import { useNaivePaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';

export function useOrderTable(onViewDetail: (row: Api.Order.AdminOrderInfo) => void) {
  /** 内部状态：分页与查询参数 */
  const queryParams = reactive<Api.Order.OrderListFilter>({
    page: 1,
    size: 10,
    order_id: undefined,
    user_id: undefined,
    status: undefined
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
    api: () => fetchGetOrderList(queryParams),
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
        title: '订单 ID',
        align: 'center',
        width: 220,
        ellipsis: { tooltip: true },
        render: row => h(NSpace, { align: 'center', justify: 'center' }, {
          default: () => [
            h('code', { class: 'bg-gray-100 px-4px py-2px rounded text-primary font-mono text-12px' }, row.id),
            h(NButton, {
              quaternary: true,
              circle: true,
              size: 'tiny',
              onClick: () => {
                navigator.clipboard.writeText(row.id);
                window.$message?.success('订单号已复制');
              }
            }, { icon: () => h('div', { class: 'i-ic-round-content-copy text-14px text-gray-400' }) })
          ]
        })
      },
      {
        key: 'user_id',
        title: '用户 ID',
        align: 'center',
        width: 100,
        render: row => h(NTag, { quaternary: true, type: 'info', size: 'small' }, { default: () => `UID: ${row.user_id}` })
      },
      {
        key: 'plan_name',
        title: '套餐名称',
        align: 'center',
        minWidth: 100
      },
      {
        key: 'amount_fen',
        title: '支付金额',
        align: 'center',
        width: 100,
        render: row => {
          const yuan = (row.amount_fen / 100).toFixed(2);
          return h('span', { class: 'text-14px font-bold text-red-500' }, `￥${yuan}`);
        }
      },
      {
        key: 'status',
        title: '订单状态',
        align: 'center',
        width: 120,
        render: row => {
          const statusMap: Record<Api.Order.OrderStatus, { type: 'default' | 'success' | 'error' | 'warning'; label: string }> = {
            pending: { type: 'default', label: '待支付' },
            paid: { type: 'success', label: '已支付' },
            failed: { type: 'error', label: '支付失败' },
            closed: { type: 'default', label: '已关闭' },
            refunded: { type: 'warning', label: '已退款' },
            pending_error_recovery: { type: 'error', label: '异常待恢复' }
          };
          const { type, label } = statusMap[row.status] || { type: 'default', label: '未知' };
          return h(NTag, { type, bordered: false }, { default: () => label });
        }
      },
      {
        key: 'transaction_id',
        title: '微信单号',
        align: 'center',
        width: 200,
        ellipsis: { tooltip: true },
        render: row => row.transaction_id || h('span', { class: 'text-gray-400' }, '-')
      },
      {
        key: 'created_at',
        title: '下单时间',
        align: 'center',
        width: 160,
        render: row => dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss')
      },
      {
        key: 'operate',
        title: $t('common.action'),
        align: 'center',
        width: 100,
        render: row => (
          h(NSpace, { align: 'center', justify: 'center' }, {
            default: () => [
              h(
                NButton,
                {
                  type: 'primary',
                  ghost: true,
                  size: 'small',
                  onClick: () => onViewDetail(row)
                },
                { default: () => '审计详情' }
              )
            ]
          })
        )
      }
    ]
  });

  /** 重置查询参数 */
  function resetQueryParams() {
    Object.assign(queryParams, {
      page: 1,
      order_id: undefined,
      user_id: undefined,
      status: undefined
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
