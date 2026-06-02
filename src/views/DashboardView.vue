<template>
  <div class="dashboard">
    <h2 class="page-title">仪表盘</h2>

    <el-row :gutter="16">
      <el-col :xs="12" :sm="6" v-for="card in statCards" :key="card.label">
        <el-card shadow="never" class="stat-card">
          <div class="stat-value" :style="{ color: card.color }">{{ card.value }}</div>
          <div class="stat-label">{{ card.label }}</div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" class="dashboard-rows">
      <el-col :xs="24" :lg="14">
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <div class="quick-actions">
            <el-button type="primary" :icon="Plus" @click="showForm = true">
              新建任务
            </el-button>
            <el-button :icon="List" @click="$router.push('/tasks')">
              查看全部
            </el-button>
            <el-button :icon="DataAnalysis" @click="$router.push('/stats')">
              统计详情
            </el-button>
          </div>
        </el-card>

        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-header">
              <span>近期任务</span>
            </div>
          </template>
          <div v-if="recentTasks.length === 0" class="empty">暂无任务</div>
          <TaskCard
            v-for="t in recentTasks"
            :key="t.id"
            :task="t"
            @edit="editTask"
          />
        </el-card>
      </el-col>

      <el-col :xs="24" :lg="10">
        <el-card shadow="never" class="section-card">
          <template #header>
            <div class="card-header">
              <span>任务概览</span>
            </div>
          </template>
          <div class="overview-chart">
            <v-chart :option="pieOption" autoresize style="height: 300px" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <TaskForm v-model:visible="showForm" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, List, DataAnalysis } from '@element-plus/icons-vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

const store = useTaskStore()
const showForm = ref(false)

const statCards = computed(() => [
  { label: '总任务', value: store.stats.total, color: 'var(--el-color-primary)' },
  { label: '进行中', value: store.stats.inProgress, color: 'var(--el-color-warning)' },
  { label: '已完成', value: store.stats.done, color: 'var(--el-color-success)' },
  { label: '已逾期', value: store.stats.overdue, color: 'var(--el-color-danger)' },
])

const recentTasks = computed(() => store.filteredTasks.slice(0, 5))

const pieOption = computed(() => ({
  tooltip: { trigger: 'item' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],
    center: ['50%', '45%'],
    avoidLabelOverlap: true,
    itemStyle: { borderRadius: 6, borderColor: 'var(--el-bg-color)', borderWidth: 2 },
    label: { show: false },
    emphasis: {
      label: { show: true, fontSize: 14, fontWeight: 'bold' },
    },
    data: store.stats.statusData,
  }],
}))

function editTask(task) {
  // from dashboard, clicking edit should navigate to tasks page
}
</script>

<style scoped>
.page-title {
  font-size: 22px;
  margin: 0 0 20px;
}
.stat-card {
  text-align: center;
  margin-bottom: 16px;
}
.stat-value {
  font-size: 32px;
  font-weight: 700;
}
.stat-label {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-top: 4px;
}
.dashboard-rows {
  margin-top: 4px;
}
.section-card {
  margin-bottom: 16px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.quick-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
.empty {
  text-align: center;
  color: var(--el-text-color-placeholder);
  padding: 40px 0;
}
.overview-chart {
  width: 100%;
}
</style>
