<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { NCard, NGrid, NGridItem, NStatistic, NSpin, NDataTable } from 'naive-ui';
import { fetchGetFeedbackOverview } from '@/service/api/feedback';
import { $t } from '@/locales';
import { useBoolean } from '@sa/hooks';
import FeedbackDetailDrawer from './modules/feedback-detail-drawer.vue';
import { useFeedbackTable } from './modules/use-feedback-table';

defineOptions({
  name: 'FeedbackManagement'
});

const loading = ref(false);
const overview = ref<Api.Feedback.Overview | null>(null);

/** 初始化概览数据 (仅保留指标卡所需) */
async function initData() {
  loading.value = true;
  try {
    const res = await fetchGetFeedbackOverview();
    if (!res.error) {
      overview.value = res.data;
    }
  } finally {
    loading.value = false;
  }
}

/** 表格逻辑 */
const {
  loading: feedbackTableLoading,
  data: feedbackTableData,
  columns: feedbackTableColumns,
  getData: getFeedbackTableData,
  pagination: feedbackPagination
} = useFeedbackTable(handleViewDetail);

/** 详情抽屉逻辑 */
const { bool: detailVisible, setTrue: openDetailDrawer } = useBoolean();
const currentRecord = ref<Api.Feedback.RecordItem | null>(null);

function handleViewDetail(row: Api.Feedback.RecordItem) {
  currentRecord.value = { ...row };
  openDetailDrawer();
}

onMounted(() => {
  initData();
});
</script>

<template>
  <div class="flex-col gap-16px h-full">
    <!-- 顶部指标卡 (核心数据预览) -->
    <NGrid :cols="24" :x-gap="16">
      <NGridItem :span="12">
        <NCard class="bg-primary/5 border-primary/20 shadow-sm" size="small">
          <NStatistic :label="$t('page.management_feedback.totalSubmissions')" :value="overview?.total_submissions || 0">
            <template #prefix>
              <icon-ant-design:calculator-outlined class="text-24px text-primary mr-8px" />
            </template>
          </NStatistic>
        </NCard>
      </NGridItem>
      <NGridItem :span="12">
        <NCard class="bg-success/5 border-success/20 shadow-sm" size="small">
          <NStatistic :label="$t('page.management_feedback.todaySubmissions')" :value="overview?.today_submissions || 0">
            <template #prefix>
              <icon-ant-design:file-add-outlined class="text-24px text-success mr-8px" />
            </template>
          </NStatistic>
        </NCard>
      </NGridItem>
    </NGrid>

    <!-- 主体: 答卷明细列表 (全宽展示) -->
    <NCard :title="$t('page.management_feedback.records')" :bordered="false" class="flex-1-hidden shadow-sm card-wrapper">
      <template #header-extra>
        <icon-ant-design:table-outlined class="text-20px opacity-50" />
      </template>
      <div class="flex-1-hidden">
        <NDataTable
          remote
          :loading="feedbackTableLoading"
          :columns="feedbackTableColumns"
          :data="feedbackTableData"
          :row-key="row => row.id"
          :pagination="feedbackPagination"
          class="h-full"
        />
      </div>
    </NCard>

    <FeedbackDetailDrawer
      v-model:visible="detailVisible"
      :record="currentRecord"
    />
  </div>
</template>

<style scoped></style>
