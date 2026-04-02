<script setup lang="ts">
import { computed } from 'vue';
import { NDrawer, NDrawerContent, NDescriptions, NDescriptionsItem, NTag, NCard } from 'naive-ui';
import { $t } from '@/locales';

defineOptions({
  name: 'FeedbackDetailDrawer'
});

interface Props {
  /** 提交记录数据 */
  record: Api.Feedback.RecordItem | null;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

/** 问卷字段与选项映射表 */
const FEEDBACK_MAP: Record<string, { label: string; options?: Record<number, string>; isMulti?: boolean; otherKey?: string }> = {
  q1_channel: { 
    label: '了解渠道', 
    options: { 1: '小红书', 2: '朋友推荐', 3: '搜索引擎', 4: '微信群', 5: '线下媒体', 99: '其他' },
    otherKey: 'q1_channel_other'
  },
  q2_diagnosis: { 
    label: '确诊情况', 
    options: { 1: '无', 2: 'ADHD (多动症)', 3: 'Dyslexia (阅读障碍)', 4: '双重确诊', 5: '不允许/不确定' } 
  },
  q3_difficulty: { 
    label: '阅读困难程度', 
    options: { 1: '无', 2: '轻度', 3: '中度', 4: '重度', 5: '不确定' } 
  },
  q4_demand: { 
    label: '阅读需求量', 
    options: { 1: '较大 (工作/研究需求)', 2: '一般 (兴趣阅读)', 3: '较少 (刷手机娱乐)' } 
  },
  q5_content_types: { 
    label: '常读文章类型', 
    options: { 1: '短文', 2: '中长文', 3: '论文', 4: '小说', 99: '其他' }, 
    isMulti: true,
    otherKey: 'q5_content_types_other'
  },
  q6_scenes: { 
    label: '主要阅读场景', 
    options: { 1: '工作学术', 2: '社交媒体', 3: '电子书', 4: '产品说明', 5: '教科书', 6: '公文', 7: '新闻', 8: '纸质书', 99: '其他' }, 
    isMulti: true,
    otherKey: 'q6_scenes_other'
  },
  q7_platforms: { 
    label: '期望平台', 
    options: { 1: 'iOS', 2: 'Android', 3: '浏览器插件', 4: 'Office插件', 99: '其他' }, 
    isMulti: true,
    otherKey: 'q7_platforms_other'
  },
  q8_features: { label: '个性化建议' }
};

/** 将 JSON payload 转换为语义化数组 */
const payloadFields = computed(() => {
  const payload = props.record?.form_payload;
  if (!payload) return [];
  
  const fields: { label: string; value: string }[] = [];

  Object.entries(FEEDBACK_MAP).forEach(([key, config]) => {
    const rawValue = payload[key];
    if (rawValue === undefined || rawValue === null) return;

    let displayValue = '';

    if (config.options) {
      if (config.isMulti && Array.isArray(rawValue)) {
        // 处理多选
        const labels = rawValue.map(v => config.options![v] || v);
        // 处理“其他”联动
        if (rawValue.includes(99) && config.otherKey && payload[config.otherKey]) {
          const otherIdx = rawValue.indexOf(99);
          labels[otherIdx] = `${config.options![99]} (${payload[config.otherKey]})`;
        }
        displayValue = labels.join('、');
      } else {
        // 处理单选
        displayValue = config.options[rawValue] || rawValue;
        // 处理“其他”联动
        if (rawValue === 99 && config.otherKey && payload[config.otherKey]) {
          displayValue = `${displayValue} (${payload[config.otherKey]})`;
        }
      }
    } else {
      // 纯文本字段
      displayValue = String(rawValue);
    }

    fields.push({
      label: config.label,
      value: displayValue || '未填写'
    });
  });

  return fields;
});
</script>

<template>
  <NDrawer v-model:show="visible" :width="500">
    <NDrawerContent :title="$t('page.management_feedback.payload')" closable>
      <div v-if="record" class="flex-col gap-16px">
        <NCard :bordered="false" size="small" class="bg-gray-50 dark:bg-gray-800">
          <NDescriptions label-placement="left" :column="1" size="small">
            <NDescriptionsItem label="User ID">
              <NTag size="small" :bordered="false">{{ record.user_id }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('common.createdAt')">
              {{ record.created_at }}
            </NDescriptionsItem>
          </NDescriptions>
        </NCard>

        <NDescriptions :title="$t('page.management_feedback.records')" :column="1" label-placement="left" class="mt-20px">
          <NDescriptionsItem v-for="field in payloadFields" :key="field.label" :label="field.label">
            <span class="text-primary font-bold">{{ field.value }}</span>
          </NDescriptionsItem>
        </NDescriptions>
      </div>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped></style>
