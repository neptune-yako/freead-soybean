import { ref, computed, watch } from 'vue';
import { useBoolean } from '@sa/hooks';
import { fetchGetRevenueTrends } from '@/service/api/payment';

export function usePaymentTrends() {
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean();
  
  /** 查询天数 (7 | 30) */
  const days = ref<number>(7);
  
  /** 原始响应数据 */
  const trendData = ref<Api.Payment.TrendResponse | null>(null);

  /** 汇总指标 */
  const stats = computed(() => ({
    totalRevenueYuan: (trendData.value?.total_revenue_fen || 0) / 100,
    totalOrderCount: trendData.value?.total_order_count || 0
  }));

  /** 图表数据序列 */
  const chartData = computed(() => {
    if (!trendData.value?.items) return { dates: [], revenues: [], orders: [] };
    
    return {
      dates: trendData.value.items.map(item => item.date),
      revenues: trendData.value.items.map(item => item.total_amount_fen / 100),
      orders: trendData.value.items.map(item => item.paid_order_count)
    };
  });

  /** 获取数据 */
  async function getData() {
    startLoading();
    const { data, error } = await fetchGetRevenueTrends({ days: days.value });
    if (!error && data) {
      trendData.value = data;
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
    updateData: getData
  };
}
