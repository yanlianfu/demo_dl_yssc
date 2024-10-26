<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  resource: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="audit-dialog">
    <template v-if="resource.status === 'rejected' && resource.auditHistory">
      <div v-for="(audit, index) in resource.auditHistory" :key="index">
        <h3>审核日期：{{ audit.date }}</h3>
        <h4>审核结果：<el-tag type="danger">未通过</el-tag></h4>
        
        <div class="audit-items">
          <div v-for="(item, itemIndex) in audit.failedItems" :key="itemIndex" class="audit-item">
            <h4>{{ item.title }}</h4>
            <el-alert
              type="error"
              :title="item.remarks"
              :description="item.suggestion"
              show-icon
              :closable="false"
              class="mb-3"
            />
            
            <div class="examples">
              <h5>具体问题：</h5>
              <ul>
                <li v-for="(example, exampleIndex) in item.examples" :key="exampleIndex">
                  {{ example }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <el-divider />
        <div class="final-remark">
          <h4>审核总结</h4>
          <p>{{ audit.finalRemark }}</p>
        </div>
      </div>
    </template>
    <template v-else-if="resource.status === 'in_progress'">
      <el-alert
        title="文档正在审核中"
        type="info"
        description="请等待审核完成"
        show-icon
        :closable="false"
      />
    </template>
    <template v-else>
      <el-alert
        title="开始审核流程"
        type="warning"
        description="正在检查文档是否符合验收标准"
        show-icon
        :closable="false"
      />
    </template>
  </div>
</template>

<style scoped>
.audit-dialog {
  padding: 20px;
}

.audit-items {
  margin: 20px 0;
}

.audit-item {
  margin-bottom: 20px;
}

.mb-3 {
  margin-bottom: 15px;
}

.examples {
  background-color: #f8f9fa;
  padding: 15px;
  border-radius: 4px;
  margin-top: 10px;
}

.examples ul {
  margin: 10px 0;
  padding-left: 20px;
}

.examples li {
  margin-bottom: 5px;
}

.final-remark {
  margin-top: 20px;
  padding: 15px;
  background-color: #f8f9fa;
  border-radius: 4px;
}
</style>