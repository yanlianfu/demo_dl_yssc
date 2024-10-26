<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  resources: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['delete', 'audit'])

const handleDelete = (resource) => {
  emit('delete', resource)
}

const handleAudit = (resource) => {
  emit('audit', { resource })
}
</script>

<template>
  <el-table
    :data="resources"
    style="width: 100%"
    row-key="id"
    border
    default-expand-all
  >
    <el-table-column prop="name" label="项目名称" min-width="200" />
    <el-table-column prop="documentName" label="文档名称" min-width="200" />
    <el-table-column prop="type" label="类型" width="120" />
    <el-table-column prop="size" label="大小" width="100" />
    <el-table-column prop="uploadDate" label="上传日期" width="120" />
    <el-table-column prop="status" label="状态" width="100">
      <template #default="{ row }">
        <el-tag
          v-if="row.status"
          :type="row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : row.status === 'in_progress' ? 'info' : 'danger'"
        >
          {{ row.status === 'approved' ? '已通过' : row.status === 'pending' ? '待审核' : row.status === 'in_progress' ? '审核中' : '未通过' }}
        </el-tag>
      </template>
    </el-table-column>
    <el-table-column prop="description" label="描述" min-width="200" />
    <el-table-column label="操作" width="200" fixed="right">
      <template #default="{ row }">
        <template v-if="row.status !== undefined">
          <el-button
            v-if="row.status === 'pending'"
            type="primary"
            size="small"
            @click="handleAudit(row)"
          >
            审核
          </el-button>
          <el-button
            v-if="row.status === 'rejected'"
            type="info"
            size="small"
            @click="handleAudit(row)"
          >
            查看审核结果
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(row)"
          >
            删除
          </el-button>
        </template>
      </template>
    </el-table-column>
  </el-table>
</template>