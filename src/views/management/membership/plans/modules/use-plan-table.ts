import { h, ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NTag, NSwitch } from 'naive-ui';
import { useNaivePaginatedTable } from '@/hooks/common/table';
import { fetchGetMembershipPlans, fetchUpdateMembershipPlan, fetchDeleteMembershipPlan } from '@/service/api/membership';
import { $t } from '@/locales';

export function usePlanTable(onEdit: (data: Api.Membership.MembershipPlan) => void) {
  const {
    data,
    loading,
    columns,
    columnChecks,
    reloadColumns,
    getData
  } = useNaivePaginatedTable<Api.Membership.MembershipPlan[], Api.Membership.MembershipPlan>({
    api: async () => {
      const res = await fetchGetMembershipPlans();
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
        title: $t('page.management_membership_plans.planName'),
        align: 'center',
        minWidth: 150,
        render: row => h('span', { class: 'font-bold' }, row.name)
      },
      {
        key: 'tier_code',
        title: $t('page.management_membership_tiers.tierCode'),
        align: 'center',
        width: 100,
        render: row => h(NTag, { type: 'info', ghost: true }, { default: () => row.tier_code })
      },
      {
        key: 'price_cents',
        title: $t('page.management_membership_plans.priceCents'),
        align: 'center',
        width: 100,
        render: row => h('span', { class: 'text-error font-bold' }, `¥${(row.price_cents / 100).toFixed(2)}`)
      },
      {
        key: 'duration_days',
        title: $t('page.management_membership_plans.durationDays'),
        align: 'center',
        width: 120,
        render: row => `${row.duration_days} ${$t('page.management_membership_plans.durationDays').split(' ')[0]}`
      },
      {
        key: 'is_active',
        title: $t('page.management_membership_plans.status'),
        align: 'center',
        width: 100,
        render: row => h(NSwitch, {
          value: row.is_active,
          onUpdateValue: (val: boolean) => handleUpdateActive(row.id, val)
        })
      },
      {
        key: 'sort_order',
        title: $t('page.management_membership_plans.sortOrder'),
        align: 'center',
        width: 100
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

  async function handleUpdateActive(id: number, isActive: boolean) {
    const { error } = await fetchUpdateMembershipPlan(id, { is_active: isActive });
    if (!error) {
      window.$message?.success($t('common.updateSuccess'));
      getData();
    }
  }

  async function handleDelete(id: number) {
    const { error } = await fetchDeleteMembershipPlan(id);
    if (!error) {
      window.$message?.success($t('common.deleteSuccess'));
      getData();
    }
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
