<template>
  <el-dialog
    :model-value="visible"
    :title="isEdit ? '编辑任务' : '新建任务'"
    width="520px"
    @update:model-value="$emit('update:visible', $event)"
    @open="initForm"
    destroy-on-close
  >
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="标题" prop="title">
        <el-input v-model="form.title" placeholder="任务标题" maxlength="100" />
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="3"
          placeholder="任务描述（可选）"
        />
      </el-form-item>
      <el-form-item label="优先级">
        <el-radio-group v-model="form.priority">
          <el-radio-button value="low">低</el-radio-button>
          <el-radio-button value="medium">中</el-radio-button>
          <el-radio-button value="high">高</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="分类">
        <el-select
          v-model="form.category"
          placeholder="选择或输入分类"
          allow-create
          filterable
          clearable
          style="width: 100%"
        >
          <el-option
            v-for="c in store.categories"
            :key="c"
            :label="c"
            :value="c"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="截止日期">
        <el-date-picker
          v-model="form.dueDate"
          type="date"
          placeholder="选择日期（可选）"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="$emit('update:visible', false)">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useTaskStore } from '../stores/taskStore'

const props = defineProps({
  visible: Boolean,
  task: { type: Object, default: null },
})
const emit = defineEmits(['update:visible'])

const store = useTaskStore()
const formRef = ref(null)

const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  category: '',
  dueDate: '',
})

const isEdit = ref(false)

const rules = {
  title: [
    { required: true, message: '请输入任务标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度 1-100 个字符', trigger: 'blur' },
  ],
}

function initForm() {
  isEdit.value = !!props.task
  if (props.task) {
    form.title = props.task.title
    form.description = props.task.description || ''
    form.priority = props.task.priority
    form.category = props.task.category || ''
    form.dueDate = props.task.dueDate || ''
  } else {
    form.title = ''
    form.description = ''
    form.priority = 'medium'
    form.category = ''
    form.dueDate = ''
  }
}

async function submit() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  if (isEdit.value) {
    store.updateTask(props.task.id, { ...form })
  } else {
    store.addTask({ ...form })
  }
  emit('update:visible', false)
}
</script>
