<script setup lang="ts">
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import UserSearch from './modules/user-search.vue';
import { useUserTable } from './modules/use-user-table';

defineOptions({
  name: 'UserManagement'
});

const {
  queryParams,
  resetQueryParams,
  loading,
  columns,
  columnChecks,
  data,
  pagination,
  getData,
  getDataByPage
} = useUserTable();
</script>

<template>
  <div class="flex-col gap-16px min-h-full">
    <!-- 搜索栏 -->
    <UserSearch
      :model="queryParams"
      @reset="
        () => {
          resetQueryParams();
          getDataByPage(1);
        }
      "
      @search="getDataByPage(1)"
    />

    <!-- 数据表格卡片 -->
    <NCard :border="false" class="card-wrapper shadow-sm flex-1-hidden">
      <template #header>
        <div class="flex-y-center gap-16px">
          <span class="text-18px font-bold">用户列表</span>
        </div>
      </template>

      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          @refresh="getData"
          :disabled-delete="true"
          :disabled-add="true"
        />
      </template>

      <!-- 列表数据 -->
      <div class="flex-1-hidden">
        <NDataTable
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="pagination"
          remote
          :row-key="row => row.id"
          class="h-full"
        />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
