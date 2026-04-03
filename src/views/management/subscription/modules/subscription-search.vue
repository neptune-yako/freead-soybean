<script setup lang="ts">
import { $t } from '@/locales';
import { useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'SubscriptionSearch'
});

interface Props {
  model: Api.Subscription.SubscriptionListFilter;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

/** 会员等级选项 */
const tierOptions: { label: string; value: string }[] = [
  { label: '专业版 (pro)', value: 'pro' },
  { label: '尊享版 (primeAI)', value: 'primeAI' }
];

/** 订阅状态选项 */
const statusOptions: { label: string; value: Api.Subscription.SubscriptionStatus }[] = [
  { label: '生效中 (Active)', value: 'active' },
  { label: '已到期 (Expired)', value: 'expired' },
  { label: '已取消 (Cancelled)', value: 'cancelled' }
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
    <NCollapse :default-expanded-names="['sub-search']">
      <NCollapseItem :title="$t('common.search')" name="sub-search">
        <NForm ref="formRef" :model="props.model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:8" label="用户 ID" path="user_id" class="pr-24px">
              <NInputNumber v-model:value="props.model.user_id" placeholder="请输入用户 ID" class="w-full" clearable @keyup.enter="search" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="等级代码" path="tier_code" class="pr-24px">
              <NSelect
                v-model:value="props.model.tier_code"
                placeholder="请选择会员等级"
                :options="tierOptions"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="订阅状态" path="status" class="pr-24px">
              <NSelect
                v-model:value="props.model.status"
                placeholder="请选择状态"
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
