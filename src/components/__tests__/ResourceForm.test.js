import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ResourceForm from '../ResourceForm.vue'
import ElementPlus from 'element-plus'

const mockFormData = {
  name: '',
  type: '',
  size: '',
  description: ''
}

const mockResourceTypes = ['文档', '软件', '图片', '视频', '其他']

describe('ResourceForm.vue', () => {
  const wrapper = mount(ResourceForm, {
    global: {
      plugins: [ElementPlus],
      stubs: {
        'el-icon': true
      }
    },
    props: {
      formData: mockFormData,
      resourceTypes: mockResourceTypes
    }
  })

  it('renders form with all required fields', () => {
    const formItems = wrapper.findAll('.el-form-item')
    expect(formItems.length).toBeGreaterThan(0)
    expect(wrapper.html()).toContain('名称')
    expect(wrapper.html()).toContain('类型')
    expect(wrapper.html()).toContain('大小')
    expect(wrapper.html()).toContain('描述')
  })

  it('displays all resource types in select', async () => {
    const select = wrapper.find('.el-select')
    await select.trigger('click')
    mockResourceTypes.forEach(type => {
      expect(wrapper.html()).toContain(type)
    })
  })

  it('emits file upload event when file is selected', async () => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' })
    const upload = wrapper.find('.el-upload input[type="file"]')
    
    const changeEvent = {
      target: {
        files: [file]
      },
      raw: file
    }
    
    await upload.trigger('change', changeEvent)
    expect(wrapper.emitted()).toHaveProperty('fileUpload')
  })
})