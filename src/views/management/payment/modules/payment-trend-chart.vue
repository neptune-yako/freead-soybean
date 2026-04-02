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
    data: [$t('page.management_payment.revenueTrend'), $t('page.management_payment.orderTrend')]
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: $t('page.management_payment.revenueTrend'),
      position: 'left',
      axisLabel: {
        formatter: '{value} 元'
      }
    },
    {
      type: 'value',
      name: $t('page.management_payment.orderTrend'),
      position: 'right',
      axisLabel: {
        formatter: '{value} 笔'
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
        opacity: 0.2
      },
      emphasis: {
        focus: 'series'
      },
      data: []
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
      data: []
    }
  ]
}));

/** 同步数据到 ECharts */
function updateChart() {
  updateOptions(opts => {
    opts.xAxis[0].data = props.data.dates;
    opts.series[0].data = props.data.revenues;
    opts.series[1].data = props.data.orders;
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
