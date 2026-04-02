<script setup lang="ts">
import { computed, watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';
import { $t } from '@/locales';

defineOptions({
  name: 'PaymentTrendChart'
});

interface Props {
  /** 趋势序列数据 */
  data: {
    dates: string[];
    revenues: number[];
    orders: number[];
  };
  /** 是否载入中 */
  loading?: boolean;
}

const props = defineProps<Props>();

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  legend: {
    data: [$t('page.management_payment.revenueTrend'), $t('page.management_payment.orderTrend')],
    bottom: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: 60,
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: [] as string[]
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: $t('page.management_payment.revenueTrend'),
      position: 'left',
      axisLabel: {
        formatter: '{value}'
      }
    },
    {
      type: 'value',
      name: $t('page.management_payment.orderTrend'),
      position: 'right',
      axisLabel: {
        formatter: '{value}'
      },
      splitLine: {
        show: false
      }
    }
  ],
  series: [
    {
      name: $t('page.management_payment.revenueTrend'),
      type: 'line',
      yAxisIndex: 0,
      smooth: true,
      showSymbol: false,
      areaStyle: {
        opacity: 0.1
      },
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      name: $t('page.management_payment.orderTrend'),
      type: 'line',
      yAxisIndex: 1,
      smooth: true,
      showSymbol: false,
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    }
  ]
}));

/** 同步数据到 ECharts */
function updateChart() {
  updateOptions(opts => {
    if (opts.xAxis && Array.isArray(opts.xAxis)) {
      (opts.xAxis[0] as any).data = props.data.dates;
    }
    if (opts.series && Array.isArray(opts.series)) {
      (opts.series[0] as any).data = props.data.revenues;
      (opts.series[1] as any).data = props.data.orders;
    }
    return opts;
  });
}

/** 监听外部数据变化 */
watch(() => props.data, () => {
  updateChart();
}, { deep: true });

</script>

<template>
  <div ref="domRef" class="h-400px w-full"></div>
</template>

<style scoped></style>
