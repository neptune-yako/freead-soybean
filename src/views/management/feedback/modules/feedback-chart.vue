<script setup lang="ts">
import { watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';
import { useThemeStore } from '@/store/modules/theme';

defineOptions({
  name: 'FeedbackChart'
});

interface Props {
  /** 题目统计数据 */
  stats: Api.Feedback.QuestionStats;
}

const props = defineProps<Props>();
const themeStore = useThemeStore();

const { domRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: themeStore.darkMode ? '#1f1f1f' : '#fff',
    borderColor: themeStore.darkMode ? '#333' : '#eee',
    textStyle: { color: themeStore.darkMode ? '#fff' : '#666' },
    formatter: (params: any) => {
      const { name, value, data } = params;
      const percent = params.percent;
      return `<div class="p-4px">
        <div class="font-bold mb-4px">${name}</div>
        <div class="flex-y-center gap-8px">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${params.color};"></span>
          <span>占比: <b>${percent}%</b></span>
        </div>
        <div class="mt-2px pl-18px text-12px opacity-80">计票: ${value} 票</div>
      </div>`;
    }
  },
  legend: {
    bottom: '2%',
    left: 'center',
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { color: themeStore.darkMode ? '#bbb' : '#888' }
  },
  series: [
    {
      name: props.stats.title,
      type: 'pie',
      radius: ['45%', '75%'],
      center: ['50%', '42%'],
      avoidLabelOverlap: false,
      roseType: 'radius', // 开启玫瑰图模式
      itemStyle: {
        borderRadius: 8,
        borderColor: themeStore.darkMode ? '#18181c' : '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold',
          formatter: '{b}'
        }
      },
      labelLine: { show: false },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

function updateChart() {
  updateOptions(opts => {
    opts.series[0].data = props.stats.options.map(opt => ({
      name: opt.label,
      value: opt.count
    }));
    return opts;
  });
}

/** 监听数据变化，动态更新图表 */
watch(
  () => props.stats,
  () => {
    updateChart();
  },
  { immediate: true, deep: true }
);

/** 监听主题变化，更新图表样式 */
watch(
  () => themeStore.darkMode,
  () => {
    updateOptions(opts => {
      opts.tooltip.backgroundColor = themeStore.darkMode ? '#1f1f1f' : '#fff';
      opts.tooltip.textStyle.color = themeStore.darkMode ? '#fff' : '#666';
      opts.legend.textStyle.color = themeStore.darkMode ? '#bbb' : '#888';
      opts.series[0].itemStyle.borderColor = themeStore.darkMode ? '#18181c' : '#fff';
      return opts;
    });
  }
);
</script>

<template>
  <NCard :title="stats.title" :bordered="false" class="card-wrapper shadow-sm h-full">
    <div ref="domRef" class="h-320px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
