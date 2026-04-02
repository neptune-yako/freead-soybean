<script setup lang="ts">
import { h, ref } from 'vue';
import { NButton, NCard, NDataTable, NGrid, NGridItem, NInput, NSelect, NSpace, NTabPane, NTabs } from 'naive-ui';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import { useBoolean } from '@sa/hooks';
import { $t } from '@/locales';
import { useRedeemTable, useRedeemRecordTable, getPlanOptions } from './modules/use-redeem-table';
import RedeemOperateModal from './modules/redeem-operate-modal.vue';

defineOptions({
  name: 'RedeemManagement'
});

const { bool: visible, setTrue: openModal } = useBoolean();
const editingData = ref<Api.Redeem.RedeemCode | null>(null);

function handleEdit(row: Api.Redeem.RedeemCode) {
  editingData.value = { ...row };
  openModal();
}

function handleAdd() {
  editingData.value = null;
  openModal();
}

/** 激活码表格 */
const {
  searchParams: codeParams,
  data: codeData,
  loading: codeLoading,
  columns: codeColumns,
  columnChecks: codeChecks,
  pagination: codePagination,
  getData: getCodeData,
  handleBatchInvalidate
} = useRedeemTable(handleEdit);

/** 流水审计表格 */
const {
  searchParams: recordParams,
  data: recordData,
  loading: recordLoading,
  columns: recordColumns,
  columnChecks: recordChecks,
  pagination: recordPagination,
  getData: getRecordData
} = useRedeemRecordTable();

/** 套餐选项 */
const planOptions = ref<{ label: string; value: number }[]>([]);
async function initOptions() {
  planOptions.value = await getPlanOptions();
}

initOptions();
</script>

<template>
  <div class="min-h-full flex-col-stretch gap-16px">
    <NCard :title="$t('route.management_redeem')" :border="false" class="card-wrapper shadow-sm">
      <NTabs type="line" animated>
        <!-- 兑换码管理标签页 -->
        <NTabPane name="code" :tab="$t('page.management_redeem.tabCode')">
          <NSpace vertical :size="16">
            <!-- 搜索栏 -->
            <NCard :bordered="false" class="bg-gray-50/50">
              <NGrid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4" responsive="screen">
                <NGridItem>
                  <div class="flex-y-center gap-8px">
                    <span class="w-80px flex-shrink-0">{{ $t('page.management_redeem.planName') }}</span>
                    <NSelect
                      v-model:value="codeParams.plan_id"
                      :options="planOptions"
                      clearable
                      placeholder="请选择所属套餐"
                    />
                  </div>
                </NGridItem>
                <NGridItem>
                  <div class="flex-y-center gap-8px">
                    <span class="w-80px flex-shrink-0">{{ $t('page.management_redeem.status') }}</span>
                    <NSelect
                      :value="codeParams.is_active === undefined ? null : (codeParams.is_active ? 1 : 0)"
                      :options="[
                        { label: '启用', value: 1 },
                        { label: '禁用', value: 0 }
                      ]"
                      clearable
                      placeholder="请选择状态"
                      @update:value="(val: any) => codeParams.is_active = val === null ? undefined : Boolean(val)"
                    />
                  </div>
                </NGridItem>
                <NGridItem>
                  <NSpace>
                    <NButton type="primary" secondary @click="getCodeData">
                      <template #icon>
                        <icon-ic-round-search />
                      </template>
                      {{ $t('common.search') }}
                    </NButton>
                    <NButton @click="() => { codeParams.plan_id = undefined; codeParams.is_active = undefined; getCodeData(); }">
                      {{ $t('common.reset') }}
                    </NButton>
                  </NSpace>
                </NGridItem>
              </NGrid>
            </NCard>

            <!-- 操作栏 -->
            <NSpace justify="space-between">
              <NSpace align="center">
                <NButton type="error" ghost @click="handleBatchInvalidate">
                  <template #icon>
                    <icon-ic-round-cleaning-services />
                  </template>
                  {{ $t('page.management_redeem.batchInvalidate') }}
                </NButton>
              </NSpace>
              <TableHeaderOperation
                v-model:columns="codeChecks"
                :loading="codeLoading"
                @add="handleAdd"
                @refresh="getCodeData"
              />
            </NSpace>

            <!-- 表格 -->
            <NDataTable
              remote
              :loading="codeLoading"
              :columns="codeColumns"
              :data="codeData"
              :pagination="codePagination"
              :bordered="false"
              class="flex-1-hidden"
            />
          </NSpace>
        </NTabPane>

        <!-- 兑换审计流水标签页 -->
        <NTabPane name="record" :tab="$t('page.management_redeem.tabRecord')">
          <NSpace vertical :size="16">
            <!-- 搜索栏 -->
            <NCard :bordered="false" class="bg-gray-50/50">
              <NGrid :x-gap="12" :y-gap="12" cols="1 s:2 m:3 l:4" responsive="screen">
                <NGridItem>
                  <div class="flex-y-center gap-8px">
                    <span class="w-80px flex-shrink-0">用户ID</span>
                    <NInput
                      :value="recordParams.user_id?.toString() || ''"
                      placeholder="请输入用户ID"
                      clearable
                      @update:value="(val) => recordParams.user_id = val ? Number(val) : undefined"
                    />
                  </div>
                </NGridItem>
                <NGridItem>
                  <div class="flex-y-center gap-8px">
                    <span class="w-80px flex-shrink-0">兑换码ID</span>
                    <NInput
                      :value="recordParams.code_id?.toString() || ''"
                      placeholder="请输入兑换码ID"
                      clearable
                      @update:value="(val) => recordParams.code_id = val ? Number(val) : undefined"
                    />
                  </div>
                </NGridItem>
                <NGridItem>
                  <NSpace>
                    <NButton type="primary" secondary @click="getRecordData">
                      <template #icon>
                        <icon-ic-round-search />
                      </template>
                      {{ $t('common.search') }}
                    </NButton>
                  </NSpace>
                </NGridItem>
              </NGrid>
            </NCard>

            <!-- 操作栏 (流水审计) -->
            <NSpace justify="end" align="center">
              <TableHeaderOperation
                v-model:columns="recordChecks"
                :loading="recordLoading"
                :disabled-delete="true"
                @refresh="getRecordData"
              >
                <!-- 审计流水不支持新增与批量删除 -->
                <template #default />
              </TableHeaderOperation>
            </NSpace>

            <NDataTable
              remote
              :loading="recordLoading"
              :columns="recordColumns"
              :data="recordData"
              :pagination="recordPagination"
              :bordered="false"
              class="flex-1-hidden"
            />
          </NSpace>
        </NTabPane>
      </NTabs>
    </NCard>

    <!-- 兑换码编辑弹窗 -->
    <RedeemOperateModal
      v-model:visible="visible"
      :operate-type="editingData ? 'edit' : 'add'"
      :editing-data="editingData"
      @submitted="getCodeData"
    />
  </div>
</template>

<style scoped></style>
