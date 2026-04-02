import { h, reactive } from 'vue';
import { NButton } from 'naive-ui';
import dayjs from 'dayjs';
import type { FlatResponseData } from '@sa/axios';
import { useNaivePaginatedTable } from '@/hooks/common/table';
import { fetchGetFeedbackRecords } from '@/service/api/feedback';
import { $t } from '@/locales';

export function useFeedbackTable(onViewDetail: (row: Api.Feedback.RecordItem) => void) {
  const queryParams = reactive<Api.Feedback.RecordSearchParams>({
    skip: 0,
    limit: 10
  });

  const {
    data,
    loading,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    pagination: feedbackPagination
  } = useNaivePaginatedTable<
    FlatResponseData<Api.Admin.PaginationData<Api.Feedback.RecordItem> | Api.Feedback.RecordItem[]>,
    Api.Feedback.RecordItem
  >({
    api: () => fetchGetFeedbackRecords(queryParams) as any,
    onPaginationParamsChange: params => {
      queryParams.skip = ((params.page ?? 1) - 1) * (params.pageSize ?? 10);
      queryParams.limit = params.pageSize ?? 10;
    },
    transform: (res: any) => {
      // 兼容逻辑：处理后端直接返回数组或返回分页对象的情况
      let list: Api.Feedback.RecordItem[] = [];
      let total = 0;
      let pageNum = 1;
      let pageSize = 10;

      if (Array.isArray(res.data)) {
        list = res.data;
        total = res.data.length;
        pageSize = res.data.length || 10;
      } else if (res.data) {
        list = res.data.items || [];
        total = res.data.total || 0;
        pageNum = res.data.page || 1;
        pageSize = res.data.size || 10;
      }
      
      return {
        data: list,
        total,
        pageNum,
        pageSize
      };
    },
    columns: () => [
      {
        key: 'id',
        title: 'ID',
        align: 'center',
        width: 80
      },
      {
        key: 'user_nickname',
        title: $t('page.management_admin.userNickName'),
        align: 'center',
        minWidth: 150
      },
      {
        key: 'user_id',
        title: 'User ID',
        align: 'center',
        width: 100
      },
      {
        key: 'created_at',
        title: $t('common.createdAt'),
        align: 'center',
        width: 180,
        render: row => h('span', { class: 'font-mono' }, dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss'))
      },
      {
        key: 'operate',
        title: $t('common.action'),
        align: 'center',
        width: 120,
        render: row => h(NButton, {
          type: 'primary',
          ghost: true,
          size: 'small',
          onClick: () => onViewDetail(row)
        }, { default: () => $t('page.management_feedback.viewDetail') })
      }
    ]
  });

  return {
    loading,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData,
    pagination: feedbackPagination
  };
}
