import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResourceTable from '../ResourceTable.vue'
import ElementPlus from 'element-plus'

const mockResources = [
  {
    id: 1,
    name: '测试文档',
    type: '文档',
    size: '1.5MB',
    uploadDate: '2024-03-20',
    description: '测试描述'
  }
]

describe('ResourceTable.vue', () => {
  const wrapper = mount(ResourceTable, {
    global: {
      plugins: [ElementPlus],
      stubs: {
        'el-icon': true
      }
    },
    props: {
      resources: mockResources
    }
  })

  it('renders the table with correct data', () => {
    const cells = wrapper.findAll('.el-table__cell')
    expect(cells.length).toBeGreaterThan(0)
    expect(wrapper.html()).toContain('测试文档')
    expect(wrapper.html()).toContain('文档')
    expect(wrapper.html()).toContain('1.5MB')
  })

  it('emits delete event when delete button is clicked', async () => {
    const deleteButton = wrapper.find('.el-button--danger')
    await deleteButton.trigger('click')
    expect(wrapper.emitted()).toHaveProperty('delete')
    expect(wrapper.emitted('delete')[0]).toEqual([0])
  })

  it('displays all required columns', () => {
    const headers = wrapper.findAll('.el-table__header-wrapper th')
    const columnLabels = ['编号', '名称', '类型', '大小', '上传日期', '描述', '操作']
    columnLabels.forEach(label => {
      expect(wrapper.html()).toContain(label)
    })
  })
})