import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { loadTasks, saveTasks } from '../utils/storage'

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

const STATUS_CYCLE = { todo: 'in-progress', 'in-progress': 'done', done: 'todo' }
const PRIORITY_MAP = { high: 3, medium: 2, low: 1 }

export const useTaskStore = defineStore('tasks', () => {
  const tasks = ref(loadTasks())
  const filter = ref({ status: '', priority: '', category: '', keyword: '' })
  const sort = ref({ field: 'createdAt', order: 'desc' })

  function persist() {
    saveTasks(tasks.value)
  }

  // ---- getters ----
  const filteredTasks = computed(() => {
    let result = [...tasks.value]

    if (filter.value.status) {
      result = result.filter((t) => t.status === filter.value.status)
    }
    if (filter.value.priority) {
      result = result.filter((t) => t.priority === filter.value.priority)
    }
    if (filter.value.category) {
      result = result.filter((t) => t.category === filter.value.category)
    }
    if (filter.value.keyword) {
      const kw = filter.value.keyword.toLowerCase()
      result = result.filter(
        (t) => t.title.toLowerCase().includes(kw) || t.description?.toLowerCase().includes(kw)
      )
    }

    const { field, order } = sort.value
    result.sort((a, b) => {
      let cmp = 0
      if (field === 'priority') {
        cmp = PRIORITY_MAP[a.priority] - PRIORITY_MAP[b.priority]
      } else if (field === 'dueDate') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        cmp = a.dueDate.localeCompare(b.dueDate)
      } else {
        cmp = a[field]?.localeCompare(b[field] ?? '') ?? 0
      }
      return order === 'asc' ? cmp : -cmp
    })

    return result
  })

  const categories = computed(() => {
    const set = new Set(tasks.value.map((t) => t.category).filter(Boolean))
    return [...set].sort()
  })

  const stats = computed(() => {
    const total = tasks.value.length
    const todo = tasks.value.filter((t) => t.status === 'todo').length
    const inProgress = tasks.value.filter((t) => t.status === 'in-progress').length
    const done = tasks.value.filter((t) => t.status === 'done').length
    const high = tasks.value.filter((t) => t.priority === 'high').length
    const overdue = tasks.value.filter(
      (t) => t.dueDate && t.status !== 'done' && new Date(t.dueDate) < new Date()
    ).length

    const statusData = [
      { name: '待办', value: todo },
      { name: '进行中', value: inProgress },
      { name: '已完成', value: done },
    ]
    const priorityData = [
      { name: '高', value: high },
      { name: '中', value: tasks.value.filter((t) => t.priority === 'medium').length },
      { name: '低', value: tasks.value.filter((t) => t.priority === 'low').length },
    ]
    const categoryData = categories.value.map((c) => ({
      name: c,
      value: tasks.value.filter((t) => t.category === c).length,
    }))

    const dayMap = {}
    const sorted = [...tasks.value].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    )
    sorted.forEach((t) => {
      const day = t.createdAt.slice(0, 10)
      dayMap[day] = (dayMap[day] || 0) + 1
    })
    const trendData = Object.entries(dayMap).map(([date, count]) => ({ date, count }))

    return { total, todo, inProgress, done, high, overdue, statusData, priorityData, categoryData, trendData }
  })

  // ---- actions ----
  function addTask(data) {
    const now = new Date().toISOString()
    tasks.value.push({
      id: genId(),
      title: data.title,
      description: data.description || '',
      status: 'todo',
      priority: data.priority || 'medium',
      category: data.category || '',
      dueDate: data.dueDate || '',
      createdAt: now,
      updatedAt: now,
    })
    persist()
  }

  function updateTask(id, data) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      Object.assign(task, data, { updatedAt: new Date().toISOString() })
      persist()
    }
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
    persist()
  }

  function toggleStatus(id) {
    const task = tasks.value.find((t) => t.id === id)
    if (task) {
      task.status = STATUS_CYCLE[task.status]
      task.updatedAt = new Date().toISOString()
      persist()
    }
  }

  function clearCompleted() {
    tasks.value = tasks.value.filter((t) => t.status !== 'done')
    persist()
  }

  function clearAll() {
    tasks.value = []
    persist()
  }

  function setFilter(newFilter) {
    Object.assign(filter.value, newFilter)
  }

  function resetFilter() {
    filter.value = { status: '', priority: '', category: '', keyword: '' }
  }

  function setSort(field, order) {
    sort.value = { field, order }
  }

  function replaceTasks(newTasks) {
    tasks.value = newTasks
    persist()
  }

  return {
    tasks, filter, sort,
    filteredTasks, categories, stats,
    addTask, updateTask, removeTask, toggleStatus,
    clearCompleted, clearAll, setFilter, resetFilter, setSort, replaceTasks,
  }
})
