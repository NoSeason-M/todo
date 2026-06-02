<template>
  <div class="stats">
    <h2 class="page-title">统计分析</h2>

    <el-row :gutter="16">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>任务状态分布</template>
          <v-chart :option="statusOption" autoresize style="height: 320px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>优先级分布</template>
          <v-chart :option="priorityOption" autoresize style="height: 320px" />
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="16" style="margin-top: 16px">
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>分类统计</template>
          <v-chart :option="categoryOption" autoresize style="height: 320px" />
        </el-card>
      </el-col>
      <el-col :xs="24" :lg="12">
        <el-card shadow="never">
          <template #header>任务趋势</template>
          <v-chart :option="trendOption" autoresize style="height: 320px" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, BarChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import { useTaskStore } from '../stores/taskStore'

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const store = useTaskStore()

const statusOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie',
    radius: ['30%', '60%'],
    center: ['50%', '45%'],
    itemStyle: { borderRadius: 6, borderColor: 'var(--el-bg-color)', borderWidth: 2 },
    label: { formatter: '{b}\n{d}%' },
    data: store.stats.statusData.map((d) => ({
      ...d,
      itemStyle: {
        color: d.name === '待办' ? '#e6a23c' : d.name === '进行中' ? '#409eff' : '#67c23a',
      },
    })),
  }],
}))

const priorityOption = computed(() => ({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie',
    radius: ['30%', '60%'],
    center: ['50%', '45%'],
    itemStyle: { borderRadius: 6, borderColor: 'var(--el-bg-color)', borderWidth: 2 },
    label: { formatter: '{b}\n{d}%' },
    data: store.stats.priorityData.map((d) => ({
      ...d,
      itemStyle: {
        color: d.name === '高' ? '#f56c6c' : d.name === '中' ? '#e6a23c' : '#909399',
      },
    })),
  }],
}))

const categoryOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: { type: 'category', data: store.stats.categoryData.map((d) => d.name) },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    barWidth: '50%',
    itemStyle: { borderRadius: [4, 4, 0, 0], color: '#409eff' },
    data: store.stats.categoryData.map((d) => d.value),
  }],
}))

const trendOption = computed(() => ({
  tooltip: { trigger: 'axis' },
  grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
  xAxis: {
    type: 'category',
    data: store.stats.trendData.map((d) => d.date.slice(5)),
    axisLabel: { rotate: 45 },
  },
  yAxis: { type: 'value' },
  series: [{
    type: 'bar',
    barWidth: '40%',
    itemStyle: { borderRadius: [4, 4, 0, 0], color: '#67c23a' },
    data: store.stats.trendData.map((d) => d.count),
  }],
}))
</script>

<style scoped>
.page-title {
  font-size: 22px;
  margin: 0 0 20px;
}
</style>
