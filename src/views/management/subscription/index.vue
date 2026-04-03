<script setup lang="ts">
import { nextTick } from 'vue';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import { useSubscriptionTable } from './modules/use-subscription-table';
import SubscriptionSearch from './modules/subscription-search.vue';

const {
  queryParams,
  resetQueryParams,
  data,
  loading,
  columns,
  columnChecks,
  pagination,
  getData,
  getDataByPage
} = useSubscriptionTable();

async function handleReset() {
  resetQueryParams();
  await nextTick();
  getDataByPage(1);
}

function handleSearch() {
  getDataByPage(1);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <SubscriptionSearch :model="queryParams" @reset="handleReset" @search="handleSearch" />

    <NCard title="用户订阅流水" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper shadow-sm">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-column-keys="['id']"
          :loading="loading"
          @refresh="getData"
        />
      </template>
      <NDataTable
        remote
        style="height: 100%"
        flex-height
        :loading="loading"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :row-key="row => row.id"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
