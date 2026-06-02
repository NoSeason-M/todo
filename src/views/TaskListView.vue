<template>
  <div class="task-list">
    <div class="page-header">
      <h2 class="page-title">任务列表</h2>
      <el-button type="primary" :icon="Plus" @click="showForm = true">
        新建任务
      </el-button>
    </div>

    <el-card shadow="never" class="filter-bar">
      <el-row :gutter="12" align="middle">
        <el-col :xs="24" :sm="6">
          <el-input
            v-model="store.filter.keyword"
            placeholder="搜索任务..."
            :prefix-icon="Search"
            clearable
          />
        </el-col>
        <el-col :xs="12" :sm="4">
          <el-select
            v-model="store.filter.status"
            placeholder="状态"
            clearable
            style="width: 100%"
          >
            <el-option label="待办" value="todo" />
            <el-option label="进行中" value="in-progress" />
            <el-option label="已完成" value="done" />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="4">
          <el-select
            v-model="store.filter.priority"
            placeholder="优先级"
            clearable
            style="width: 100%"
          >
            <el-option label="高" value="high" />
            <el-option label="中" value="medium" />
            <el-option label="低" value="low" />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="4">
          <el-select
            v-model="store.filter.category"
            placeholder="分类"
            clearable
            style="width: 100%"
          >
            <el-option v-for="c in store.categories" :key="c" :label="c" :value="c" />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="4">
          <el-select
            :model-value="sortValue"
            placeholder="排序"
            style="width: 100%"
            @change="handleSort"
          >
            <el-option label="最新优先" value="createdAt-desc" />
            <el-option label="最早优先" value="createdAt-asc" />
            <el-option label="截止日期 ↑" value="dueDate-asc" />
            <el-option label="截止日期 ↓" value="dueDate-desc" />
            <el-option label="优先级 ↑" value="priority-asc" />
            <el-option label="优先级 ↓" value="priority-desc" />
          </el-select>
        </el-col>
        <el-col :xs="12" :sm="2">
          <el-button text :icon="Refresh" @click="store.resetFilter()">重置</el-button>
        </el-col>
      </el-row>
    </el-card>

    <div class="list-meta">
      <span>共 <strong>{{ store.filteredTasks.length }}</strong> 个任务</span>
    </div>

    <div v-if="store.filteredTasks.length === 0" class="empty-state">
      <el-empty description="暂无匹配的任务" />
    </div>

    <TaskCard
      v-for="t in store.filteredTasks"
      :key="t.id"
      :task="t"
      @edit="editTask"
    />

    <TaskForm v-model:visible="showForm" :task="editingTask" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Plus, Search, Refresh } from '@element-plus/icons-vue'
import { useTaskStore } from '../stores/taskStore'
import TaskCard from '../components/TaskCard.vue'
import TaskForm from '../components/TaskForm.vue'

const store = useTaskStore()
const showForm = ref(false)
const editingTask = ref(null)

const sortValue = computed(() => `${store.sort.field}-${store.sort.order}`)

function handleSort(val) {
  const [field, order] = val.split('-')
  store.setSort(field, order)
}

function editTask(task) {
  editingTask.value = task
  showForm.value = true
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.page-title {
  font-size: 22px;
  margin: 0;
}
.filter-bar {
  margin-bottom: 16px;
}
.list-meta {
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
.empty-state {
  padding: 60px 0;
}
</style>
