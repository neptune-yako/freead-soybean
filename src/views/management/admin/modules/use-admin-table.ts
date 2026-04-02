import { h, reactive, ref } from 'vue';
import { NButton, NPopconfirm, NSpace, NSwitch, NTag } from 'naive-ui';
import type { FlatResponseData } from '@sa/axios';
import { fetchGetAdminList, fetchDeleteAdmin, fetchUpdateAdmin } from '@/service/api/admin';
import { useNaivePaginatedTable } from '@/hooks/common/table';
import { $t } from '@/locales';

export function useAdminTable() {
  /** 内部状态：分页参数 */
  const queryParams = reactive<Api.Admin.AdminSearchParams>({
    page: 1,
    size: 10
  });

  /** 弹窗状态管理 */
  const visible = ref(false);
  const operateType = ref<'add' | 'edit'>('add');
  const editingData = ref<Api.Admin.AdminProfile | null>(null);

  /** 状态更新队列 */
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
  } = useNaivePaginatedTable<
    FlatResponseData<Api.Admin.PaginationData<Api.Admin.AdminProfile>, any>,
    Api.Admin.AdminProfile
  >({
    api: () => fetchGetAdminList(queryParams),
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
        type: 'selection',
        align: 'center',
        width: 48
      },
      {
        key: 'id',
        title: 'ID',
        align: 'center',
        width: 60
      },
      {
        key: 'username',
        title: $t('page.management_admin.userName'),
        align: 'center',
        minWidth: 100
      },
      {
        key: 'full_name',
        title: $t('page.management_admin.userNickName'),
        align: 'center',
        minWidth: 100
      },
      {
        key: 'role_code',
        title: $t('page.management_admin.role'),
        align: 'center',
        width: 120,
        render: row => {
          if (row.role_code === 'super_admin') {
            return h(NTag, { type: 'error' }, { default: () => '超级管理员' });
          }
          return h(NTag, { type: 'primary' }, { default: () => '运营管理' });
        }
      },
      {
        key: 'is_active',
        title: $t('page.management_admin.status'),
        align: 'center',
        width: 80,
        render: row => {
          return h(NSwitch, {
            value: row.is_active,
            loading: statusLoadingIds.value.has(row.id),
            onUpdateValue: (val: boolean) => handleUpdateStatus(row.id, val)
          });
        }
      },
      {
        key: 'created_at',
        title: $t('page.management_admin.createdAt'),
        align: 'center',
        minWidth: 160
      },
      {
        key: 'operate',
        title: $t('common.action'),
        align: 'center',
        width: 200,
        render: row => (
          h(NSpace, { align: 'center', justify: 'center' }, {
            default: () => [
              h(
                NButton,
                {
                  type: 'primary',
                  ghost: true,
                  size: 'small',
                  onClick: () => handleEdit(row)
                },
                { default: () => $t('common.edit') }
              ),
              h(
                NButton,
                {
                  type: 'info',
                  ghost: true,
                  size: 'small',
                  onClick: () => handleResetPassword(row.id)
                },
                { default: () => '重置密码' }
              ),
              h(
                NPopconfirm,
                {
                  onPositiveClick: () => handleDelete(row.id)
                },
                {
                  default: () => '确认逻辑删除该账号吗？',
                  trigger: () => h(
                    NButton,
                    {
                      type: 'error',
                      ghost: true,
                      size: 'small'
                    },
                    { default: () => $t('common.delete') }
                  )
                }
              )
            ]
          })
        )
      }
    ]
  });

  function openModal() {
    visible.value = true;
  }

  function closeModal() {
    visible.value = false;
  }

  function handleAdd() {
    operateType.value = 'add';
    editingData.value = null;
    openModal();
  }

  /** 编辑管理员 */
  function handleEdit(row: Api.Admin.AdminProfile) {
    operateType.value = 'edit';
    editingData.value = { ...row };
    openModal();
  }

  /** 更新状态 */
  async function handleUpdateStatus(id: number, is_active: boolean) {
    statusLoadingIds.value.add(id);
    try {
      const { error } = await fetchUpdateAdmin(id, { is_active });
      if (!error) {
        window.$message?.success('状态更新成功');
        const item = data.value.find(i => i.id === id);
        if (item) {
          item.is_active = is_active;
        }
      }
    } finally {
      statusLoadingIds.value.delete(id);
    }
  }

  /** 重置密码 */
  function handleResetPassword(id: number) {
    window.$dialog?.warning({
      title: '重置密码',
      content: '确认要将该账号的密码重置为默认值 "123456" 吗？',
      positiveText: '确认',
      negativeText: '取消',
      onPositiveClick: async () => {
        const { error } = await fetchUpdateAdmin(id, { password: '默认密码' });
        if (!error) {
          window.$notification?.success({
            title: '重置成功',
            content: '该账号密码已重置为默认值 "123456"，请告知相关人员及时修改。',
            duration: 5000
          });
        }
      }
    });
  }

  /** 逻辑删除 */
  async function handleDelete(id: number) {
    const { error } = await fetchDeleteAdmin(id);
    if (!error) {
      window.$message?.success($t('common.deleteSuccess'));
      getData();
    }
  }

  return {
    data,
    loading,
    columns,
    columnChecks,
    reloadColumns,
    pagination,
    mobilePagination,
    visible,
    operateType,
    editingData,
    handleAdd,
    handleEdit,
    handleDelete,
    getData
  };
}
