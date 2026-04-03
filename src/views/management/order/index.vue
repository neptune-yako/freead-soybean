<script setup lang="ts">
import { ref } from 'vue';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import { useOrderTable } from './modules/use-order-table';
import OrderSearch from './modules/order-search.vue';
import OrderDetailModal from './modules/order-detail-modal.vue';

/** 审计详情弹窗控制 */
const detailVisible = ref(false);
const detailOrderId = ref<string>();

/** 查看详情回调 */
function handleViewDetail(row: Api.Order.AdminOrderInfo) {
  detailOrderId.value = row.id;
  detailVisible.value = true;
}

const {
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
} = useOrderTable(handleViewDetail);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <OrderSearch
      :model="queryParams"
      @reset="
        () => {
          resetQueryParams();
          getDataByPage(1);
        }
      "
      @search="getDataByPage(1)"
    />

    <NCard title="订单支付流水" :bordered="false" size="small" class="sm:flex-1-hidden card-wrapper shadow-sm">
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
      <OrderDetailModal v-model:visible="detailVisible" :order-id="detailOrderId" />
    </NCard>
  </div>
</template>

<style scoped></style>
