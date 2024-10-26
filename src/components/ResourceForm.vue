<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  formData: {
    type: Object,
    required: true
  },
  resourceTypes: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update:formData', 'fileUpload'])

const handleFileUpload = (event) => {
  emit('fileUpload', event)
}
</script>

<template>
  <el-form :model="formData" label-width="120px">
    <el-form-item label="文件上传">
      <el-upload
        class="upload-demo"
        action="#"
        :auto-upload="false"
        :on-change="handleFileUpload"
        :limit="1"
      >
        <template #trigger>
          <el-button type="primary">选择文件</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            请选择要上传的资源文件
          </div>
        </template>
      </el-upload>
    </el-form-item>
    <el-form-item label="项目名称" required>
      <el-input v-model="formData.name" />
    </el-form-item>
    <el-form-item label="文档名称" required>
      <el-input v-model="formData.documentName" />
    </el-form-item>
    <el-form-item label="类型" required>
      <el-select v-model="formData.type" placeholder="选择类型">
        <el-option
          v-for="type in resourceTypes"
          :key="type"
          :label="type"
          :value="type"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="大小">
      <el-input v-model="formData.size" />
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        v-model="formData.description"
        type="textarea"
        rows="3"
      />
    </el-form-item>
  </el-form>
</template>