<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { fetchHealthCheck } from '@/service/api/system';
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';

const appStore = useAppStore();

const gap = computed(() => (appStore.isMobile ? 0 : 16));

const loading = ref(false);

async function handleHealthCheck() {
  loading.value = true;
  try {
    const data = await fetchHealthCheck();
    if (data) {
      window.$message?.success(`后端连通成功！响应：${JSON.stringify(data)}`);
    }
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <NSpace vertical :size="16">
    <NAlert :title="$t('common.tip')" type="warning">
      {{ $t('page.home.branchDesc') }}
    </NAlert>

    <!-- 连通性测试卡片 -->
    <NCard title="后端服务测试" :bordered="false" class="card-wrapper shadow-sm">
      <template #header-extra>
        <NTag type="info">Local: 8000</NTag>
      </template>
      <div class="flex-center flex-col gap-16px py-16px">
        <p class="text-16px text-gray-500">点击下方按钮测试前端与本地后端的连通性（/api/health）</p>
        <NButton type="primary" :loading="loading" size="large" @click="handleHealthCheck">
          <template #icon>
            <icon-mdi-api />
          </template>
          立即进行连通性测试
        </NButton>
      </div>
    </NCard>

    <HeaderBanner />
    <CardData />
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart />
        </NCard>
      </NGi>
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart />
        </NCard>
      </NGi>
    </NGrid>
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
