<script setup lang="ts">
import { computed, reactive, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { fetchCreateMembershipTier, fetchUpdateMembershipTier } from '@/service/api/membership';
import { $t } from '@/locales';

defineOptions({
  name: 'TierOperateModal'
});

interface Props {
  /** 弹窗类型: add | edit */
  type: NaiveUI.TableOperateType;
  /** 编辑的数据 */
  editingData?: Api.Membership.MemberTier | null;
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
    add: $t('common.add') + ' ' + $t('page.management_membership_tiers.tierName'),
    edit: $t('common.edit') + ' ' + $t('page.management_membership_tiers.tierName')
  };
  return titles[props.type];
});

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

type Model = Api.Membership.TierCreate & { id?: number };

const model: Model = reactive(createDefaultModel());

function createDefaultModel(): Model {
  return {
    tier_code: '',
    name: '',
    weight: 1,
    is_default: false,
    remark: '',
    quota_config: {
      max_words_count: 1000,
      daily_tokens_limit: 50000,
      daily_upload_count: 5,
      max_file_size_mb: 10,
      bookshelf_capacity: 10,
      bookshelf_enabled: true
    }
  };
}

const rules: Record<string, any> = {
  tier_code: defaultRequiredRule,
  name: defaultRequiredRule,
  weight: defaultRequiredRule
};

function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.type === 'edit' && props.editingData) {
    Object.assign(model, props.editingData);
    // 确保 quota_config 也被深度拷贝
    if (props.editingData.quota_config) {
      model.quota_config = { ...props.editingData.quota_config };
    }
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();

  const apiRes = props.type === 'add' 
    ? await fetchCreateMembershipTier(model)
    : await fetchUpdateMembershipTier(model.id!, model);

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
  <NModal v-model:show="visible" :title="title" preset="card" class="w-800px">
    <NForm
      ref="formRef"
      :model="model"
      :rules="rules"
      label-placement="left"
      label-width="120"
      class="p-4px"
    >
      <NGrid :cols="24" :x-gap="18">
        <!-- 基础信息 -->
        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.tierName')" path="name">
          <NInput v-model:value="model.name" :placeholder="$t('page.management_membership_tiers.tierName')" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.tierCode')" path="tier_code">
          <NInput v-model:value="model.tier_code" :placeholder="$t('page.management_membership_tiers.tierCode')" :disabled="type === 'edit'" />
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.weight')" path="weight">
          <NInputNumber v-model:value="model.weight" :min="1" :max="100" class="w-full" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.isDefault')" path="is_default">
          <NSwitch v-model:value="model.is_default" />
        </NFormItemGi>

        <!-- 权益配额配置 -->
        <NGi :span="24">
          <NDivider title-placement="left">{{ $t('page.management_membership_tiers.quotaConfig') }}</NDivider>
        </NGi>

        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.maxWords')" path="quota_config.max_words_count">
          <NInputNumber v-model:value="model.quota_config.max_words_count" :min="0" class="w-full" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.dailyTokens')" path="quota_config.daily_tokens_limit">
          <NInputNumber v-model:value="model.quota_config.daily_tokens_limit" :min="0" :step="1000" class="w-full" />
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.uploadCount')" path="quota_config.daily_upload_count">
          <NInputNumber v-model:value="model.quota_config.daily_upload_count" :min="0" class="w-full" />
        </NFormItemGi>
        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.maxFileSize')" path="quota_config.max_file_size_mb">
          <NInputNumber v-model:value="model.quota_config.max_file_size_mb" :min="1" class="w-full">
            <template #suffix>MB</template>
          </NInputNumber>
        </NFormItemGi>

        <NFormItemGi :span="12" :label="$t('page.management_membership_tiers.bookshelfCapacity')" path="quota_config.bookshelf_capacity">
          <NInputNumber v-model:value="model.quota_config.bookshelf_capacity" :min="0" class="w-full" />
        </NFormItemGi>
        <NFormItemGi :span="12" label="启用书架" path="quota_config.bookshelf_enabled">
          <NSwitch v-model:value="model.quota_config.bookshelf_enabled" />
        </NFormItemGi>

        <NFormItemGi :span="24" :label="$t('page.management_membership_tiers.remark')" path="remark">
          <NInput v-model:value="model.remark" type="textarea" :placeholder="$t('page.management_membership_tiers.remark')" />
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
