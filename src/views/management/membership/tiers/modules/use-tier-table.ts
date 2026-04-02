import { h, ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag, NTooltip } from 'naive-ui';
import dayjs from 'dayjs';
import { useNaivePaginatedTable } from '@/hooks/common/table';
import { fetchGetMembershipTiers, fetchDeleteMembershipTier } from '@/service/api/membership';
import { $t } from '@/locales';

export function useTierTable(onEdit: (data: Api.Membership.MemberTier) => void) {
  const {
    data,
    loading,
    columns,
    columnChecks,
    reloadColumns,
    getData
  } = useNaivePaginatedTable<Api.Membership.MemberTier[], Api.Membership.MemberTier>({
    api: async () => {
      const res = await fetchGetMembershipTiers();
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
        key: 'name',
        title: $t('page.management_membership_tiers.tierName'),
        align: 'center',
        minWidth: 120,
        render: row => h('span', { class: 'font-bold text-primary' }, row.name)
      },
      {
        key: 'tier_code',
        title: $t('page.management_membership_tiers.tierCode'),
        align: 'center',
        width: 100,
        render: row => h(NTag, { type: 'info', ghost: true }, { default: () => row.tier_code })
      },
      {
        key: 'quota_config',
        title: $t('page.management_membership_tiers.quotaConfig'),
        align: 'center',
        minWidth: 250,
        render: row => {
          const quota = row.quota_config;
          return h(NSpace, { size: 4, wrap: true, justify: 'center' }, {
            default: () => [
              renderQuotaTag('W', quota.max_words_count, $t('page.management_membership_tiers.maxWords')),
              renderQuotaTag('T', quota.daily_tokens_limit, $t('page.management_membership_tiers.dailyTokens')),
              renderQuotaTag('B', quota.bookshelf_capacity, $t('page.management_membership_tiers.bookshelfCapacity'))
            ]
          });
        }
      },
      {
        key: 'is_default',
        title: $t('page.management_membership_tiers.isDefault'),
        align: 'center',
        width: 90,
        render: row => row.is_default 
          ? h(NTag, { type: 'success', size: 'small' }, { default: () => 'YES' }) 
          : h('span', { class: 'text-gray-400' }, '-')
      },
      {
        key: 'created_at',
        title: $t('common.createdAt'),
        align: 'center',
        width: 160,
        render: row => h('span', { class: 'font-mono text-12px' }, dayjs(row.created_at).format('YYYY-MM-DD HH:mm:ss'))
      },
      {
        key: 'operate',
        title: $t('common.action'),
        align: 'center',
        width: 150,
        render: row => h(NSpace, { align: 'center', justify: 'center' }, {
          default: () => [
            h(NButton, {
              type: 'primary',
              ghost: true,
              size: 'small',
              onClick: () => onEdit(row)
            }, { default: () => $t('common.edit') }),
            h(NPopconfirm, {
              onPositiveClick: () => handleDelete(row.id)
            }, {
              trigger: () => h(NButton, {
                type: 'error',
                ghost: true,
                size: 'small'
              }, { default: () => $t('common.delete') }),
              default: () => $t('common.confirmDelete')
            })
          ]
        })
      }
    ],
    transform: (res: any) => {
      const list = res?.data || [];
      return {
        data: list,
        pageNum: 1,
        pageSize: list.length || 10,
        total: list.length
      };
    }
  });

  async function handleDelete(id: number) {
    const { error } = await fetchDeleteMembershipTier(id);
    if (!error) {
      window.$message?.success($t('common.deleteSuccess'));
      getData();
    }
  }

  /** 辅助渲染配额 Tag */
  function renderQuotaTag(label: string, value: any, tooltip: string) {
    return h(NTooltip, { trigger: 'hover' }, {
      trigger: () => h(NTag, { size: 'small', round: true, class: 'cursor-help' }, { default: () => `${label}: ${value}` }),
      default: () => tooltip
    });
  }

  return {
    loading,
    data,
    columns,
    columnChecks,
    reloadColumns,
    getData
  };
}
