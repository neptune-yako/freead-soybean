<script setup lang="ts">
import { computed } from 'vue';
import { $t } from '@/locales';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';

defineOptions({
  name: 'UserSearch'
});

interface Props {
  model: Api.User.UserListFilter;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const memberLevelOptions: { label: string; value: Api.User.MemberLevel }[] = [
  { label: '普通用户 (free)', value: 'free' },
  { label: '专业版 (pro)', value: 'vip' },
  { label: '尊享版 (primeAI)', value: 'svip' }
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
    <NCollapse :default-expanded-names="['user-search']">
      <NCollapseItem :title="$t('common.search')" name="user-search">
        <NForm ref="formRef" :model="props.model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:8" :label="$t('page.management_admin.userNickName')" path="nickname" class="pr-24px">
              <NInput v-model:value="props.model.nickname" placeholder="请输入用户昵称" @keyup.enter="search" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8" label="会员等级" path="member_level" class="pr-24px">
              <NSelect
                v-model:value="props.model.member_level"
                placeholder="请选择会员等级"
                :options="memberLevelOptions"
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:8">
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
