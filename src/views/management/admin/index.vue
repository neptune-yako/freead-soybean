<script setup lang="ts">
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import AdminOperateModal from './modules/admin-operate-modal.vue';
import { useAdminTable } from './modules/use-admin-table';

defineOptions({
  name: 'AdminManagement'
});

const {
  loading,
  columns,
  columnChecks,
  data,
  pagination,
  visible,
  operateType,
  editingData,
  handleAdd,
  handleDelete,
  getData
} = useAdminTable();
</script>

<template>
  <div class="min-h-full">
    <!-- 数据表格卡片 -->
    <NCard :border="false" class="card-wrapper shadow-sm">
      <template #header>
        <div class="flex-y-center gap-16px">
          <span class="text-18px font-bold">管理员列表</span>
        </div>
      </template>

      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
          :disabled-delete="true"
        />
      </template>

      <!-- 列表数据 -->
      <NDataTable
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="pagination"
        remote
        :row-key="row => row.id"
        class="flex-1-hidden"
      />
    </NCard>

    <!-- 操作弹窗 -->
    <AdminOperateModal
      v-model:visible="visible"
      :type="operateType"
      :editing-data="editingData"
      @submitted="getData"
    />
  </div>
</template>

<style scoped></style>
