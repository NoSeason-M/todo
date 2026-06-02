<template>
  <div class="settings">
    <h2 class="page-title">设置</h2>

    <el-card shadow="never" class="section-card">
      <template #header>
        <span>主题设置</span>
      </template>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">深色模式</div>
          <div class="setting-desc">切换应用的颜色主题</div>
        </div>
        <el-switch
          :model-value="themeStore.theme === 'dark'"
          inline-prompt
          active-text="暗"
          inactive-text="亮"
          @change="toggleTheme"
        />
      </div>
    </el-card>

    <el-card shadow="never" class="section-card">
      <template #header>
        <span>数据管理</span>
      </template>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">导出数据</div>
          <div class="setting-desc">将任务数据导出为 JSON 文件</div>
        </div>
        <el-button :icon="Download" @click="handleExport">导出</el-button>
      </div>
      <el-divider />
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">导入数据</div>
          <div class="setting-desc">从 JSON 文件导入任务数据</div>
        </div>
        <el-button :icon="Upload" @click="triggerImport">导入</el-button>
        <input
          ref="fileInput"
          type="file"
          accept=".json"
          style="display: none"
          @change="handleImport"
        />
      </div>
    </el-card>

    <el-card shadow="never" class="section-card">
      <template #header>
        <span>清理操作</span>
      </template>
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">清除已完成任务</div>
          <div class="setting-desc">删除所有状态为「已完成」的任务</div>
        </div>
        <el-popconfirm title="确认清除所有已完成任务？" @confirm="store.clearCompleted()">
          <template #reference>
            <el-button type="warning" :icon="Delete">清除已完成</el-button>
          </template>
        </el-popconfirm>
      </div>
      <el-divider />
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-label">清除全部数据</div>
          <div class="setting-desc">删除所有任务数据，此操作不可恢复</div>
        </div>
        <el-popconfirm title="确认清除所有数据？此操作不可恢复！" @confirm="store.clearAll()">
          <template #reference>
            <el-button type="danger" :icon="Delete">清除全部</el-button>
          </template>
        </el-popconfirm>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Download, Upload, Delete } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useTaskStore } from '../stores/taskStore'
import { useThemeStore } from '../stores/themeStore'
import { exportData, importData } from '../utils/storage'

const store = useTaskStore()
const themeStore = useThemeStore()
const fileInput = ref(null)

function toggleTheme(val) {
  themeStore.setTheme(val ? 'dark' : 'light')
}

function handleExport() {
  exportData(store.tasks)
  ElMessage.success('数据已导出')
}

function triggerImport() {
  fileInput.value.click()
}

async function handleImport(e) {
  const file = e.target.files[0]
  if (!file) return
  try {
    const data = await importData(file)
    store.replaceTasks(data)
    ElMessage.success(`成功导入 ${data.length} 个任务`)
  } catch {
    ElMessage.error('导入失败，请检查文件格式')
  }
  fileInput.value.value = ''
}
</script>

<style scoped>
.page-title {
  font-size: 22px;
  margin: 0 0 20px;
}
.section-card {
  margin-bottom: 16px;
}
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.setting-label {
  font-weight: 600;
  margin-bottom: 2px;
}
.setting-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
}
</style>
