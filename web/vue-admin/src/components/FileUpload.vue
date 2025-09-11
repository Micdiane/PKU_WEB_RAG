<template>
  <div class="file-upload">
    <n-upload
      ref="uploadRef"
      :default-file-list="fileList"
      :custom-request="customRequest"
      :max="5"
      multiple
      @change="handleChange"
    >
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <archive-icon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          点击或者拖动文件到该区域来上传
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          支持 .pdf 和 .md 文件
        </n-p>
      </n-upload-dragger>
    </n-upload>
    
    <!-- 文件预览 -->
    <div v-if="previewFile" class="preview">
      <h3>文件预览</h3>
      <div v-if="previewFile.type === 'application/pdf'" class="pdf-preview">
        <p>PDF 文件预览功能需要额外的库支持，这里仅显示文件名</p>
        <p>文件名: {{ previewFile.name }}</p>
      </div>
      <div v-else-if="previewFile.type === 'text/markdown'" class="md-preview">
        <n-input
          v-model:value="previewContent"
          type="textarea"
          placeholder="Markdown 内容预览"
          :autosize="{ minRows: 10 }"
          readonly
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo, UploadInst } from 'naive-ui'
import { ArchiveOutline as ArchiveIcon } from '@vicons/ionicons5'
import { authenticatedFetch } from '../utils/auth'

// 定义组件
const uploadRef = ref<UploadInst | null>(null)
const message = useMessage()
const fileList = ref<UploadFileInfo[]>([])
const previewFile = ref<File | null>(null)
const previewContent = ref('')

// 处理文件变化
const handleChange = (data: { fileList: UploadFileInfo[] }) => {
  fileList.value = data.fileList
  
  // 如果有文件，预览第一个文件
  if (data.fileList.length > 0) {
    const file = data.fileList[data.fileList.length - 1]?.file
    if (file) {
      previewFile.value = file
      if (file.type === 'text/markdown') {
        const reader = new FileReader()
        reader.onload = (e) => {
          previewContent.value = e.target?.result as string || ''
        }
        reader.readAsText(file)
      }
    }
  }
}

// 自定义上传请求
const customRequest = (options: any) => {
  const { file, onFinish, onError, onProgress } = options
  
  // 创建 FormData
  const formData = new FormData()
  formData.append('file', file.file as File)
  
  // 发起上传请求
  authenticatedFetch('/file/upload', {
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('上传失败')
      }
    })
    .then(data => {
      onFinish()
      message.success(`文件 ${file.name} 上传成功`)
      console.log('上传成功:', data)
    })
    .catch(error => {
      onError()
      message.error(error.message || '上传失败')
    })
}
</script>

<style scoped>
.file-upload {
  max-width: 600px;
  margin: 0 auto;
}

.preview {
  margin-top: 24px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}
</style>