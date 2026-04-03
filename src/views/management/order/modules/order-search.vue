<script setup lang="ts">
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'OrderSearch'
});

interface Props {
  model: Api.Order.OrderListFilter;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

/** 订单状态选项 */
const statusOptions: { label: string; value: Api.Order.OrderStatus }[] = [
  { label: '待支付 (pending)', value: 'pending' },
  { label: '已支付 (paid)', value: 'paid' },
  { label: '支付失败 (failed)', value: 'failed' },
  { label: '已关闭 (closed)', value: 'closed' },
  { label: '已退款 (refunded)', value: 'refunded' },
  { label: '异常待恢复 (error)', value: 'pending_error_recovery' }
];

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper shadow-sm">
    <NCollapse :default-expanded-names="['order-search']">
      <NCollapseItem :title="$t('common.search')" name="order-search">
        <NForm ref="formRef" :model="props.model" label-placement="left" :label-width="100">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:8" label="业务订单号" path="order_id" class="pr-24px">
              <NInput v-model:value="props.model.order_id" placeholder="请输入订单 ID (ULID)" clearable @keyup.enter="search" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="用户 ID" path="user_id" class="pr-24px">
              <NInputNumber v-model:value="props.model.user_id" placeholder="请输入用户 ID" class="w-full" clearable @keyup.enter="search" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="订单状态" path="status" class="pr-24px">
              <NSelect
                v-model:value="props.model.status"
                placeholder="请选择订单状态"
                :options="statusOptions"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>

<style scoped></style>
