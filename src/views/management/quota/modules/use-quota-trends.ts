import { ref, computed, watch } from 'vue';
import { useBoolean } from '@sa/hooks';
import { fetchGetQuotaTrends, fetchTriggerQuotaPersist } from '@/service/api/quota';
import { $t } from '@/locales';

export function useQuotaTrends() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();
  
  /** 查询天数 (7 | 30) */
  const days = ref<number>(7);
  
  /** 原始响应数据 */
  const trendData = ref<Api.Quota.QuotaTrendResponse | null>(null);

  /** 汇总指标 (用于顶部 NStatistic) */
  const stats = computed(() => ({
    totalOCR: trendData.value?.period_total_upload || 0,
    totalTokens: trendData.value?.period_total_tokens || 0
  }));

  /** 图表数据序列 (用于 QuotaTrendChart) */
  const chartData = computed(() => {
    if (!trendData.value?.items) return { dates: [], ocr: [], tokens: [] };
    
    return {
      dates: trendData.value.items.map(item => item.date),
      ocr: trendData.value.items.map(item => item.total_daily_upload_count),
      tokens: trendData.value.items.map(item => item.total_tokens_count)
    };
  });

  /** 获取数据 */
  async function getData() {
    startLoading();
    const { data, error } = await fetchGetQuotaTrends({ days: days.value });
    if (!error && data) {
      trendData.value = data;
    }
    endLoading();
  }

  /** 手动触发持久化快照 */
  async function handleTriggerPersist() {
    startLoading();
    const { error } = await fetchTriggerQuotaPersist();
    if (!error) {
      window.$message?.success($t('common.modifySuccess'));
      await getData();
    }
    endLoading();
  }

  // 监听天数变化自动刷新
  watch(days, () => {
    getData();
  }, { immediate: true });

  return {
    days,
    loading,
    stats,
    chartData,
    handleTriggerPersist,
    updateData: getData
  };
}
