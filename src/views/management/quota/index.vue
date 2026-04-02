<script setup lang="ts">
import { NButton, NCard, NPopconfirm, NSpace, NStatistic, NTabs, NTabPane } from 'naive-ui';
import { useQuotaTrends } from './modules/use-quota-trends';
import QuotaTrendChart from './modules/quota-trend-chart.vue';
import { $t } from '@/locales';

defineOptions({
  name: 'QuotaManagement'
});

const { stats, chartData, loading, days, handleTriggerPersist } = useQuotaTrends();
</script>

<template>
  <div class="flex-col-stretch gap-16px h-full">
    <!-- 指标统计卡片 -->
    <NCard :bordered="false" class="shadow-sm card-wrapper">
      <div class="flex-y-center justify-between">
        <NSpace :size="48">
          <NStatistic :label="$t('page.management_quota.totalWords')" :value="stats.totalOCR" />
          <NStatistic :label="$t('page.management_quota.totalTokens')" :value="stats.totalTokens" />
        </NSpace>
        
        <NPopconfirm @positive-click="handleTriggerPersist" placement="bottom-end">
          <template #trigger>
            <NButton type="primary" :loading="loading">
              <template #icon>
                <icon-ant-design:sync-outlined :class="{ 'animate-spin': loading }" />
              </template>
              {{ $t('page.management_quota.triggerPersist') }}
            </NButton>
          </template>
          确定要依据当前实时消耗数据生成快照吗？这将同步最新的对账状态。
        </NPopconfirm>
      </div>
    </NCard>

    <!-- 趋势分析图表区 -->
    <NCard :bordered="false" class="flex-1 shadow-sm card-wrapper overflow-hidden">
      <template #header>
        <div class="flex-y-center gap-12px">
          <div class="w-4px h-18px bg-primary rounded-2px"></div>
          <span class="text-16px font-bold">{{ $t('page.management_quota.statistics') }}</span>
        </div>
      </template>
      <template #header-extra>
        <NTabs v-model:value="days" type="segment" size="small" :style="{ width: '160px' }">
          <NTabPane :name="7" :tab="$t('page.management_quota.lastSevenDays')" />
          <NTabPane :name="30" :tab="$t('page.management_quota.lastThirtyDays')" />
        </NTabs>
      </template>
      
      <div class="h-full pt-20px">
        <QuotaTrendChart :data="chartData" :loading="loading" />
      </div>
    </NCard>
  </div>
</template>

<style scoped></style>
