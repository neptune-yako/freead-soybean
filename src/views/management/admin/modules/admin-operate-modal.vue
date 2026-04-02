<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';
import { fetchCreateAdmin, fetchUpdateAdmin } from '@/service/api/admin';

defineOptions({
  name: 'AdminOperateModal'
});

interface Props {
  /** 弹窗类型 */
  type: 'add' | 'edit';
  /** 编辑的数据 */
  editingData?: Api.Admin.AdminProfile | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();

const visible = defineModel<boolean>('visible', { default: false });

const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule, createRequiredRule, createConfirmPwdRule, patternRules } = useFormRules();

const title = computed(() => (props.type === 'add' ? '新增管理员' : '编辑管理员'));

type Model = Api.Admin.AdminCreate & { confirmPassword?: string };

const model: Model = reactive(createDefaultModel());

/** 提交状态 */
const loading = ref(false);

function createDefaultModel(): Model {
  return {
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
    role_code: 'operator',
    is_active: true
  };
}

type RuleKey = keyof Model;

const rules: Record<RuleKey, App.Global.FormRule | App.Global.FormRule[]> = {
  username: [createRequiredRule($t('form.userName.required')), patternRules.userName],
  password: [], // 动态更新
  confirmPassword: [], // 动态更新
  full_name: [createRequiredRule('请输入姓名')],
  role_code: [defaultRequiredRule],
  is_active: [defaultRequiredRule]
};

/** 动态校验规则：新增模式下密码必填 */
watch(
  () => props.type,
  () => {
    if (props.type === 'add') {
      rules.password = [createRequiredRule($t('form.pwd.required')), patternRules.pwd];
      rules.confirmPassword = createConfirmPwdRule(computed(() => model.password));
    } else {
      rules.password = [patternRules.pwd];
      rules.confirmPassword = createConfirmPwdRule(computed(() => model.password));
    }
  },
  { immediate: true }
);

/** 初始化表单数据 */
function handleInitModel() {
  Object.assign(model, createDefaultModel());

  if (props.type === 'edit' && props.editingData) {
    Object.assign(model, {
      username: props.editingData.username,
      full_name: props.editingData.full_name,
      role_code: props.editingData.role_code,
      is_active: props.editingData.is_active,
      password: '', // 编辑模式下默认不修改密码
      confirmPassword: ''
    });
  }
}

watch(visible, val => {
  if (val) {
    handleInitModel();
    restoreValidation();
  }
});

const roleOptions: CommonType.Option<Api.Admin.AdminRole>[] = [
  { label: '超级管理员', value: 'super_admin' },
  { label: '运营管理', value: 'operator' }
];

async function handleSubmit() {
  await validate();

  loading.value = true;
  try {
    // 构建提交参数
    const params: Api.Admin.AdminCreate | Api.Admin.AdminUpdate = {
      full_name: model.full_name,
      role_code: model.role_code,
      is_active: model.is_active
    };

    if (props.type === 'add') {
      (params as Api.Admin.AdminCreate).username = model.username;
      (params as Api.Admin.AdminCreate).password = model.password;
    } else if (model.password) {
      (params as Api.Admin.AdminUpdate).password = model.password;
    }

    const { error } =
      props.type === 'add'
        ? await fetchCreateAdmin(params as Api.Admin.AdminCreate)
        : await fetchUpdateAdmin(props.editingData!.id, params as Api.Admin.AdminUpdate);

    if (!error) {
      window.$message?.success($t('common.modifySuccess'));
      closeModal();
      emit('submitted');
    }
  } finally {
    loading.value = false;
  }
}

function closeModal() {
  visible.value = false;
}
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px" :mask-closable="false">
    <NForm ref="formRef" :model="model" :rules="rules" label-placement="left" :label-width="80">
      <NFormItem :label="$t('page.management_admin.userName')" path="username">
        <NInput v-model:value="model.username" :disabled="props.type === 'edit'" placeholder="请输入用户名" />
      </NFormItem>
      <NFormItem label="真实姓名" path="full_name">
        <NInput v-model:value="model.full_name" placeholder="请输入姓名" />
      </NFormItem>
      <NFormItem :label="$t('page.management_admin.role')" path="role_code">
        <NSelect v-model:value="model.role_code" :options="roleOptions" placeholder="请选择角色" />
      </NFormItem>
      <NFormItem label="账户密码" path="password">
        <NInput
          v-model:value="model.password"
          type="password"
          show-password-on="mousedown"
          :placeholder="props.type === 'add' ? '请输入密码' : '留空表示不修改'"
        />
      </NFormItem>
      <NFormItem label="确认密码" path="confirmPassword">
        <NInput
          v-model:value="model.confirmPassword"
          type="password"
          show-password-on="mousedown"
          placeholder="请再次确认密码"
        />
      </NFormItem>
      <NFormItem :label="$t('page.management_admin.status')" path="is_active">
        <NSwitch v-model:value="model.is_active">
          <template #checked>启用</template>
          <template #unchecked>禁用</template>
        </NSwitch>
      </NFormItem>
    </NForm>
    <template #footer>
      <NSpace justify="end" :size="16">
        <NButton @click="closeModal">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" :loading="loading" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
