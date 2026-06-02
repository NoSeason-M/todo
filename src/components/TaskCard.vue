<template>
  <el-card shadow="hover" class="task-card" :class="`priority-${task.priority}`">
    <div class="task-header">
      <div class="task-title-area">
        <el-checkbox
          v-if="task.status !== 'done'"
          :model-value="false"
          @click="store.toggleStatus(task.id)"
        />
        <el-checkbox
          v-else
          :model-value="true"
          @click="store.toggleStatus(task.id)"
        />
        <span class="task-title" :class="{ 'is-done': task.status === 'done' }">
          {{ task.title }}
        </span>
      </div>
      <div class="task-actions">
        <el-tag
          :type="statusType"
          size="small"
          style="cursor: pointer"
          @click="store.toggleStatus(task.id)"
        >
          {{ statusLabel }}
        </el-tag>
        <el-tag
          :type="priorityType"
          size="small"
          effect="plain"
        >
          {{ priorityLabel }}
        </el-tag>
        <el-button text :icon="Edit" size="small" @click="$emit('edit', task)" />
        <el-popconfirm title="确认删除？" confirm-button-text="删除" @confirm="store.removeTask(task.id)">
          <template #reference>
            <el-button text :icon="Delete" size="small" type="danger" />
          </template>
        </el-popconfirm>
      </div>
    </div>
    <p v-if="task.description" class="task-desc">{{ task.description }}</p>
    <div class="task-meta">
      <span v-if="task.category" class="meta-item">
        <el-icon><Collection /></el-icon>
        {{ task.category }}
      </span>
      <span v-if="task.dueDate" class="meta-item" :class="{ 'is-overdue': isOverdue }">
        <el-icon><Calendar /></el-icon>
        {{ task.dueDate }}
      </span>
      <span class="meta-item">
        <el-icon><Timer /></el-icon>
        {{ dayjs(task.createdAt).format('MM-DD HH:mm') }}
      </span>
    </div>
  </el-card>
</template>

<script setup>
import { computed } from 'vue'
import { Edit, Delete, Collection, Calendar, Timer } from '@element-plus/icons-vue'
import dayjs from 'dayjs'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({ task: { type: Object, required: true } })
defineEmits(['edit'])

const store = useTaskStore()

const statusMap = { todo: ['warning', '待办'], 'in-progress': ['primary', '进行中'], done: ['success', '已完成'] }
const priorityMap = { high: ['danger', '高'], medium: ['warning', '中'], low: ['info', '低'] }

const statusType = computed(() => statusMap[props.task.status][0])
const statusLabel = computed(() => statusMap[props.task.status][1])
const priorityType = computed(() => priorityMap[props.task.priority][0])
const priorityLabel = computed(() => priorityMap[props.task.priority][1])
const isOverdue = computed(() => {
  if (!props.task.dueDate || props.task.status === 'done') return false
  return new Date(props.task.dueDate) < new Date()
})
</script>

<style scoped>
.task-card {
  margin-bottom: 12px;
  transition: transform 0.2s;
}
.task-card:hover {
  transform: translateY(-1px);
}
.task-card.priority-high { border-left: 3px solid var(--el-color-danger); }
.task-card.priority-medium { border-left: 3px solid var(--el-color-warning); }
.task-card.priority-low { border-left: 3px solid var(--el-color-info); }
.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.task-title-area {
  display: flex;
  align-items: center;
  gap: 8px;
}
.task-title {
  font-weight: 600;
  font-size: 15px;
}
.task-title.is-done {
  text-decoration: line-through;
  color: var(--el-text-color-secondary);
}
.task-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.task-desc {
  margin: 8px 0 0 28px;
  color: var(--el-text-color-secondary);
  font-size: 13px;
  line-height: 1.5;
}
.task-meta {
  display: flex;
  gap: 16px;
  margin: 8px 0 0 28px;
  flex-wrap: wrap;
}
.meta-item {
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.meta-item.is-overdue {
  color: var(--el-color-danger);
  font-weight: 600;
}
</style>
