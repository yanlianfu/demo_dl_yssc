<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
import ResourceTable from '../components/ResourceTable.vue'
import ResourceForm from '../components/ResourceForm.vue'
import AuditDialog from '../components/AuditDialog.vue'

const dialogVisible = ref(false)
const auditDialogVisible = ref(false)
const currentResource = ref(null)

const formData = reactive({
  name: '',
  documentName: '',
  type: '',
  size: '',
  description: ''
})

const searchQuery = ref('')
const filterType = ref('')

const resourceTypes = [
  '立项文档',
  '需求文档',
  '设计文档',
  '实施文档',
  '验收文档',
  '运维文档'
]

const resources = ref([
  {
    id: 1,
    name: '智慧城市大数据平台',
    documentName: '项目立项申请书',
    type: '立项文档',
    size: '2.5MB',
    uploadDate: '2024-03-15',
    description: '项目立项基础文档',
    status: 'approved'
  },
  {
    id: 2,
    name: '智慧交通管理系统',
    documentName: '所有验收文件',
    type: '验收文档',
    size: '3.2MB',
    uploadDate: '2024-03-18',
    description: '项目验收文档集合',
    status: 'pending'
  },
  {
    id: 3,
    name: '智慧医疗平台',
    documentName: '所有验收文件',
    type: '验收文档',
    size: '4.1MB',
    uploadDate: '2024-03-19',
    description: '项目验收总结文档',
    status: 'approved'
  }
])

const filteredResources = computed(() => {
  return resources.value.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         resource.documentName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesType = !filterType.value || resource.type === filterType.value
    return matchesSearch && matchesType
  })
})

const handleAdd = () => {
  dialogVisible.value = true
}

const handleSubmit = () => {
  if (!formData.name || !formData.documentName || !formData.type) {
    ElMessage.warning('请填写必填字段')
    return
  }

  const newResource = {
    id: Date.now(),
    ...formData,
    uploadDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  }

  resources.value.push(newResource)
  ElMessage.success('资源添加成功')
  dialogVisible.value = false
  Object.keys(formData).forEach(key => formData[key] = '')
}

const handleDelete = (resource) => {
  const index = resources.value.findIndex(r => r.id === resource.id)
  if (index > -1) {
    resources.value.splice(index, 1)
    ElMessage.success('资源删除成功')
  }
}

const handleAudit = ({ resource }) => {
  currentResource.value = resource
  auditDialogVisible.value = true
  
  if (resource.status === 'pending') {
    const index = resources.value.findIndex(r => r.id === resource.id)
    if (index > -1) {
      resources.value[index] = { ...resources.value[index], status: 'in_progress' }

      setTimeout(() => {
        resources.value[index] = {
          ...resources.value[index],
          status: 'rejected',
          auditHistory: [{
            date: new Date().toISOString().split('T')[0],
            result: 'rejected',
            failedItems: [
              {
                title: '项目验收申请表',
                remarks: '项目基本信息和进度说明不完整',
                suggestion: '需要补充：\n1. 项目关键里程碑完成情况\n2. 具体验收时间安排\n3. 项目组成员签字确认\n4. 用户代表确认签字',
                examples: [
                  '缺少项目经理对项目进度的确认说明',
                  '验收时间安排过于简单，未包含具体的验收项目和时间节点',
                  '未附带用户部门的验收确认函'
                ]
              },
              {
                title: '项目总结报告',
                remarks: '项目成果和技术方案说明不充分',
                suggestion: '建议补充：\n1. 详细的技术架构说明\n2. 核心功能实现方案\n3. 性能优化措施\n4. 项目创新点说明',
                examples: [
                  '系统架构图过于简单，未体现各组件之间的交互关系',
                  '性能指标只有结论没有具体测试数据支撑',
                  '未说明与原有系统的集成方案'
                ]
              }
            ],
            finalRemark: '经审核，多个关键文档内容存在重大缺失，需要按照验收标准和审核意见逐项完善后重新提交。'
          }]
        }
        
        ElMessage.warning('审核未通过，请查看审核结果')
      }, 5000)
    }
  }
}

const handleExport = () => {
  const data = JSON.stringify(resources.value, null, 2)
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'resources.json'
  link.click()
  URL.revokeObjectURL(url)
  ElMessage.success('资源导出成功')
}

const handleFileUpload = (event) => {
  const file = event.raw
  if (file) {
    formData.documentName = file.name
    formData.size = (file.size / 1024 / 1024).toFixed(2) + 'MB'
    ElMessage.success('文件上传成功')
  }
}
</script>

<template>
  <div class="resource-management">
    <el-container>
      <el-header>
        <div class="header-content">
          <h2>IT项目资源管理系统</h2>
        </div>
      </el-header>
      
      <el-main>
        <div class="toolbar">
          <el-row :gutter="20" class="mb-4">
            <el-col :span="8">
              <el-input
                v-model="searchQuery"
                placeholder="搜索资源..."
                prefix-icon="Search"
              />
            </el-col>
            <el-col :span="6">
              <el-select
                v-model="filterType"
                placeholder="按类型筛选"
                clearable
                style="width: 100%"
              >
                <el-option
                  v-for="type in resourceTypes"
                  :key="type"
                  :label="type"
                  :value="type"
                />
              </el-select>
            </el-col>
            <el-col :span="10" style="text-align: right">
              <el-button type="primary" @click="handleAdd">
                <el-icon><Plus /></el-icon>添加资源
              </el-button>
              <el-button type="success" @click="handleExport">
                <el-icon><Download /></el-icon>导出
              </el-button>
            </el-col>
          </el-row>
        </div>

        <ResourceTable 
          :resources="filteredResources"
          @delete="handleDelete"
          @audit="handleAudit"
        />

        <el-dialog
          v-model="dialogVisible"
          title="添加新资源"
          width="500px"
        >
          <ResourceForm
            :form-data="formData"
            :resource-types="resourceTypes"
            @file-upload="handleFileUpload"
          />
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleSubmit">提交</el-button>
            </span>
          </template>
        </el-dialog>

        <el-dialog
          v-model="auditDialogVisible"
          title="文档审核"
          width="800px"
        >
          <AuditDialog
            v-if="currentResource"
            :resource="currentResource"
          />
        </el-dialog>
      </el-main>
    </el-container>
  </div>
</template>

<style scoped>
.resource-management {
  height: 100%;
}

.el-container {
  height: 100%;
}

.el-header {
  background-color: #409EFF;
  color: white;
  padding: 0;
  height: auto !important;
  min-height: 60px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
}

.header-content h2 {
  margin: 0;
  font-size: 1.5rem;
  white-space: nowrap;
}

.toolbar {
  margin-bottom: 20px;
}

.el-main {
  padding: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>