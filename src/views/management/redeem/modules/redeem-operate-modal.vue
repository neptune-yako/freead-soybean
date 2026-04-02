<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import type { FormInst, FormRules } from 'naive-ui';
import dayjs from 'dayjs';
import { $t } from '@/locales';
import { fetchCreateRedeemCode, fetchUpdateRedeemCode } from '@/service/api/redeem';
import { getPlanOptions } from './use-redeem-table';

defineOptions({
  name: 'RedeemOperateModal'
});

interface Props {
  operateType: NaiveUI.TableOperateType;
  editingData: Api.Redeem.RedeemCode | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const formRef = ref<FormInst | null>(null);

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: '新增兑换码',
    edit: '编辑兑换码'
  };
  return titles[props.operateType] || '兑换码操作';
});

type Model = Api.Redeem.CodeRequest & { id?: number };

const model = reactive<Model>(createDefaultModel());

function createDefaultModel(): Model {
  return {
    code_string: '',
    plan_id: null as any,
    valid_from: undefined,
    valid_until: '',
    max_uses: 1,
    is_active: true
  };
}

const rules: FormRules = {
  code_string: [{ required: true, message: '请输入或生成兑换码', trigger: 'blur' }],
  plan_id: [{ required: true, message: '请选择关联套餐', trigger: 'blur', type: 'number' }],
  max_uses: [{ required: true, message: '请输入最大使用次数', trigger: 'blur', type: 'number' }]
};

/** 生成 12 位随机兑换码 */
function generateRandomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 排除易混淆字符
  let result = '';
  for (let i = 0; i < 12; i += 1) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  model.code_string = result;
}

/** 有效期时间戳范围 */
const validRange = ref<[number, number] | null>(null);

/** 套餐选项 */
const planOptions = ref<{ label: string; value: number }[]>([]);

async function initOptions() {
  planOptions.value = await getPlanOptions();
}

function handleUpdateModelWhenVisible() {
  if (visible.value) {
    if (props.operateType === 'add') {
      Object.assign(model, createDefaultModel());
      validRange.value = null;
      generateRandomCode(); // 默认生成一个
    } else if (props.operateType === 'edit' && props.editingData) {
      Object.assign(model, {
        id: props.editingData.id,
        code_string: props.editingData.code_string,
        plan_id: props.editingData.plan_id,
        valid_from: props.editingData.valid_from,
        valid_until: props.editingData.valid_until,
        max_uses: props.editingData.max_uses,
        is_active: props.editingData.is_active
      });
      validRange.value = props.editingData.valid_from && props.editingData.valid_until
        ? [dayjs(props.editingData.valid_from).valueOf(), dayjs(props.editingData.valid_until).valueOf()]
        : null;
    }
    initOptions();
  }
}

watch(visible, () => {
  handleUpdateModelWhenVisible();
});

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await formRef.value?.validate();

  // 处理日期转换
  if (validRange.value) {
    model.valid_from = dayjs(validRange.value[0]).format('YYYY-MM-DD HH:mm:ss');
    model.valid_until = dayjs(validRange.value[1]).format('YYYY-MM-DD HH:mm:ss');
  } else {
    model.valid_from = undefined;
    model.valid_until = ''; // 后端 valid_until 是必需的
  }

  const { error } = props.operateType === 'add' 
    ? await fetchCreateRedeemCode(model)
    : await fetchUpdateRedeemCode(model.id!, model);

  if (!error) {
    window.$message?.success($t('common.updateSuccess'));
    closeDrawer();
    emit('submitted');
  }
}
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-600px shadow-sm">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="100">
      <NFormItem label="兑换码" path="code_string">
        <NInputGroup>
          <NInput v-model:value="model.code_string" :disabled="operateType === 'edit'" placeholder="请输入或生成兑换码" />
          <NButton v-if="operateType === 'add'" type="primary" ghost @click="generateRandomCode">生成</NButton>
        </NInputGroup>
      </NFormItem>
      <NFormItem label="关联套餐" path="plan_id">
        <NSelect v-model:value="model.plan_id" :options="planOptions" :disabled="operateType === 'edit'" placeholder="请选择所属套餐" />
      </NFormItem>
      <NFormItem label="有效期" path="valid_range">
        <NDatePicker v-model:value="validRange" type="datetimerange" clearable class="w-full" />
      </NFormItem>
      <NFormItem label="最多次数" path="max_uses">
        <NInputNumber v-model:value="model.max_uses" :min="0" placeholder="0 代表无限次" class="w-full" />
      </NFormItem>
      <NFormItem label="启用状态" path="is_active">
        <NSwitch v-model:value="model.is_active" />
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace justify="end">
        <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
