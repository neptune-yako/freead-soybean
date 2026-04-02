<script setup lang="ts">
import { ref } from 'vue';
import { NCard, NDataTable } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import TableHeaderOperation from '@/components/advanced/table-header-operation.vue';
import { usePlanTable } from './modules/use-plan-table';
import PlanOperateModal from './modules/plan-operate-modal.vue';

defineOptions({
  name: 'MembershipPlans'
});

const { bool: visible, setTrue: openModal } = useBoolean();

const operateType = ref<NaiveUI.TableOperateType>('add');
const editingData = ref<Api.Membership.MembershipPlan | null>(null);

function handleAdd() {
  operateType.value = 'add';
  editingData.value = null;
  openModal();
}

function handleEdit(row: Api.Membership.MembershipPlan) {
  operateType.value = 'edit';
  editingData.value = { ...row };
  openModal();
}

const {
  loading,
  data,
  columns,
  columnChecks,
  getData
} = usePlanTable(handleEdit);
</script>

<template>
  <div class="min-h-full">
    <NCard :border="false" class="card-wrapper shadow-sm">
      <template #header>
        <div class="flex-y-center gap-16px">
          <span class="text-18px font-bold">会员套餐管理</span>
        </div>
      </template>

      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :loading="loading"
          @add="handleAdd"
          @refresh="getData"
        />
      </template>

      <NDataTable
        :columns="columns"
        :data="data"
        :loading="loading"
        remote
        :row-key="row => row.id"
        class="flex-1-hidden"
      />
    </NCard>

    <PlanOperateModal
      v-model:visible="visible"
      :type="operateType"
      :editing-data="editingData"
      @submitted="getData"
    />
  </div>
</template>

<style scoped></style>
