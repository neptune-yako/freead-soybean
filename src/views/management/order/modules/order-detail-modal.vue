<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { NCode, NDescriptions, NDescriptionsItem, NModal, NScrollbar, NSpin, NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { fetchGetOrderDetail } from '@/service/api/order';

defineOptions({
  name: 'OrderDetailModal'
});

interface Props {
  /** 订单 ID */
  orderId?: string;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', { default: false });

const loading = ref(false);
const detail = ref<Api.Order.AdminOrderDetail | null>(null);

/** 解析原始报文为格式化 JSON */
const formattedRawData = computed(() => {
  if (!detail.value?.notify_raw_data) return '无原始回调数据';
  return JSON.stringify(detail.value.notify_raw_data, null, 2);
});

async function getDetail() {
  if (!props.orderId) return;
  loading.value = true;
  const { data, error } = await fetchGetOrderDetail(props.orderId);
  if (!error && data) {
    detail.value = data;
  }
  loading.value = false;
}

watch(visible, val => {
  if (val) {
    getDetail();
  } else {
    detail.value = null;
  }
});

/** 状态标签映射 */
type TagType = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'error';
const statusMap: Record<Api.Order.OrderStatus, { type: TagType; label: string }> = {
  pending: { type: 'default', label: '待支付' },
  paid: { type: 'success', label: '已支付' },
  failed: { type: 'error', label: '支付失败' },
  closed: { type: 'default', label: '已关闭' },
  refunded: { type: 'warning', label: '已退款' },
  pending_error_recovery: { type: 'error', label: '异常待恢复' }
};

const statusInfo = computed(() => {
  if (!detail.value) return { type: 'default' as TagType, label: '未知' };
  return statusMap[detail.value.status] || { type: 'default' as TagType, label: '未知' };
});

function formatDate(date: string | null) {
  if (!date) return '-';
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
}
</script>

<template>
  <NModal v-model:show="visible" preset="card" title="订单支付审计详情" class="w-800px">
    <NSpin :show="loading">
      <div v-if="detail" class="flex-col gap-16px">
        <NDescriptions label-placement="left" :column="2" bordered size="small">
          <NDescriptionsItem label="订单 ID">
            <span class="font-mono">{{ detail.id }}</span>
          </NDescriptionsItem>
          <NDescriptionsItem label="当前状态">
            <NTag :type="statusInfo.type" size="small">{{ statusInfo.label }}</NTag>
          </NDescriptionsItem>
          <NDescriptionsItem label="支付人 IP">
            {{ detail.client_ip || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem label="支付完成时间">
            {{ formatDate(detail.paid_at) }}
          </NDescriptionsItem>
          <NDescriptionsItem label="订单创建时间" :span="2">
            {{ formatDate(detail.created_at) }}
          </NDescriptionsItem>
        </NDescriptions>

        <div class="mt-8px">
          <p class="mb-8px font-bold">微信支付回调原始报文 (notify_raw_data):</p>
          <div class="bg-gray-100 rounded-8px p-12px overflow-hidden border border-gray-200">
            <NScrollbar class="max-h-400px">
              <NCode :code="formattedRawData" language="json" word-wrap />
            </NScrollbar>
          </div>
        </div>
      </div>
      <div v-else-if="!loading" class="flex-center h-200px">
        <NEmpty description="未找到订单详情" />
      </div>
    </NSpin>
  </NModal>
</template>

<style scoped></style>
