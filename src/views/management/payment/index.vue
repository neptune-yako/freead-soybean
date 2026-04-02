<script setup lang="ts">
import { NCard, NGrid, NGridItem, NStatistic, NButton, NPopconfirm, NSpace, NTabs, NTabPane, NSpin } from 'naive-ui';
import { $t } from '@/locales';
import { usePaymentTrends } from './modules/use-payment-trends';
import PaymentTrendChart from './modules/payment-trend-chart.vue';
import { fetchTriggerRevenuePersist } from '@/service/api/payment';

defineOptions({
  name: 'PaymentManagement'
});

const { days, loading, stats, chartData, updateData } = usePaymentTrends();

/** 手动触发财务持久化 */
async function handleTriggerPersist() {
  const { error } = await fetchTriggerRevenuePersist();
  if (!error) {
    window.$message?.success($t('common.modifySuccess'));
    // 持久化后刷新趋势数据
    updateData();
  }
}
</script>

<template>
  <div class="flex-col gap-16px h-full">
    <!-- 顶部操作栏与指标预览 -->
    <NCard :bordered="false" size="small" class="shadow-sm card-wrapper">
      <div class="flex-y-center justify-between">
        <NSpace :size="32">
          <NStatistic :label="$t('page.management_payment.totalRevenue')" :value="stats.totalRevenueYuan.toFixed(2)">
            <template #prefix>¥</template>
          </NStatistic>
          <NStatistic :label="$t('page.management_payment.totalOrders')" :value="stats.totalOrderCount" />
        </NSpace>
        
        <NPopconfirm @positive-click="handleTriggerPersist" placement="bottom-right">
          <template #trigger>
            <NButton type="primary" :loading="loading">
              <template #icon>
                <icon-ant-design:sync-outlined :class="{ 'animate-spin': loading }" />
              </template>
              {{ $t('page.management_payment.triggerPersist') }}
            </NButton>
          </template>
          确定要立即生成最新的财务快照吗？
        </NPopconfirm>
      </div>
    </NCard>

    <!-- 趋势分析图表区 -->
    <NCard :bordered="false" class="flex-1 shadow-sm card-wrapper overflow-hidden">
      <template #header>
        <div class="flex-y-center gap-12px">
          <div class="w-4px h-18px bg-primary rounded-2px"></div>
          <span class="text-16px font-bold">{{ $t('page.management_payment.statistics') }}</span>
        </div>
      </template>
      <template #header-extra>
        <NTabs v-model:value="days" type="segment" size="small" :style="{ width: '160px' }">
          <NTabPane :name="7" :tab="$t('page.management_payment.lastSevenDays')" />
          <NTabPane :name="30" :tab="$t('page.management_payment.lastThirtyDays')" />
        </NTabs>
      </template>
      
      <NSpin :show="loading">
        <div class="min-h-500px">
          <PaymentTrendChart :data="chartData" :loading="loading" />
        </div>
      </NSpin>
    </NCard>
  </div>
</template>

<style scoped>
:deep(.n-tabs-tab) {
  padding: 4px 12px;
}
</style>
