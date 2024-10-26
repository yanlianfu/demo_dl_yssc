import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ResourceManagement from '../ResourceManagement.vue'

describe('ResourceManagement.vue', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(ResourceManagement)
  })

  it('renders the main layout correctly', () => {
    expect(wrapper.find('.resource-management').exists()).toBe(true)
    expect(wrapper.html()).toContain('IT项目资源管理系统')
  })

  it('shows add resource dialog when add button is clicked', async () => {
    const addButton = wrapper.find('.el-button--primary')
    await addButton.trigger('click')
    expect(wrapper.vm.dialogVisible).toBe(true)
  })

  it('filters resources based on search query', async () => {
    wrapper.vm.searchQuery = '项目'
    await nextTick()
    expect(wrapper.vm.filteredResources[0].name).toContain('项目')
  })

  it('adds new resource correctly', async () => {
    const newResource = {
      name: '新资源',
      type: '文档',
      description: '测试描述'
    }
    
    Object.assign(wrapper.vm.formData, newResource)
    await wrapper.vm.handleSubmit()
    
    const addedResource = wrapper.vm.resources.find(r => r.name === '新资源')
    expect(addedResource).toBeTruthy()
    expect(addedResource.type).toBe('文档')
  })

  it('handles file upload correctly', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    await wrapper.vm.handleFileUpload({ raw: file })
    expect(wrapper.vm.formData.name).toBe('test.txt')