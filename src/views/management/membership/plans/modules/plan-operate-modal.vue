<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { SelectOption } from 'naive-ui';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCreateMembershipPlan, fetchUpdateMembershipPlan, fetchGetMembershipTiers } from '@/service/api/membership';
import { $t } from '@/locales';

defineOptions({
  name: 'PlanOperateModal'
});

interface Props {
  /** 弹窗类型: add | edit */
  type: NaiveUI.TableOperateType;
  /** 编辑的数据 */
  editingData?: Api.Membership.MembershipPlan | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', {
  default: false
});

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('common.add') + ' ' + $t('route.management_membership_plans'),
    edit: $t('common.edit') + ' ' + $t('route.management_membership_plans')
  };
  return titles[props.type];
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

// 内部使用的表单模型，价格使用“元”
type Model = Omit<Api.Membership.PlanCreate, 'price_cents'> & { 
  id?: number; 
  price_yuan: number;
};

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    tier_id: null as any,
    name: '',
    price_yuan: 0,
    duration_days: 30,
    is_active: true,
    sort_order: 10
  };
}

const rules: Record<string, any> = {
  tier_id: defaultRequiredRule,
  name: defaultRequiredRule,
  price_yuan: defaultRequiredRule,
  duration_days: defaultRequiredRule
};

/** 会员等级选项 */
const tierOptions = ref<SelectOption[]>([]);

async function getTierOptions() {
  const { data } = await fetchGetMembershipTiers();
  if (data) {
    tierOptions.value = data.map(item => ({
      label: item.name,
      value: item.id
    }));
  }
}

function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.type === 'edit' && props.editingData) {
    const { price_cents, ...rest } = props.editingData;
    Object.assign(model, rest);
    model.price_yuan = price_cents / 100;
  }
  
  getTierOptions();
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  // 提交时转换回分
  const submitData: Api.Membership.PlanCreate = {
    tier_id: model.tier_id,
    name: model.name,
    price_cents: Math.round(model.price_yuan * 100),
    duration_days: model.duration_days,
    is_active: model.is_active,
    sort_order: model.sort_order
  };

  const apiRes = props.type === 'add' 
    ? await fetchCreateMembershipPlan(submitData)
    : await fetchUpdateMembershipPlan(model.id!, submitData);

  if (!apiRes.error) {
    window.$message?.success(props.type === 'add' ? $t('common.addSuccess') : $t('common.updateSuccess'));
    closeDrawer();
    emit('submitted');
  }
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-600px">
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="100"
      class="p-4px"
    >
      <NFormItem :label="$t('page.management_membership_plans.planName')" path="name">
        <NInput v-model:value="model.name" :placeholder="$t('page.management_membership_plans.planName')" />
      </NFormItem>

      <NFormItem :label="$t('page.management_membership_tiers.tierName')" path="tier_id">
        <NSelect
          v-model:value="model.tier_id"
          :options="tierOptions"
          :placeholder="$t('page.management_membership_tiers.tierName')"
        />
      </NFormItem>

      <NGrid :cols="24" :x-gap="18">
        <NFormItemGi :span="12" :label="$t('page.management_membership_plans.priceCents')" path="price_yuan">
          <NInputNumber v-model:value="model.price_yuan" :min="0" :precision="2" class="w-full">
            <template #prefix>¥</template>
          </NInputNumber>
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.management_membership_plans.durationDays')" path="duration_days">
          <NInputNumber v-model:value="model.duration_days" :min="1" class="w-full">
            <template #suffix>{{ $t('page.management_membership_plans.durationDays').split('(')[0] }}</template>
          </NInputNumber>
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.management_membership_plans.sortOrder')" path="sort_order">
          <NInputNumber v-model:value="model.sort_order" :min="0" class="w-full" />
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.management_membership_plans.status')" path="is_active">
          <NSwitch v-model:value="model.is_active" />
        </NFormItemGi>
      </NGrid>

      <NSpace justify="end" class="mt-16px">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </NForm>
  </NModal>
</template>

<style scoped></style>
