<template>
  <div class="menu1">
    <div class="page-header">
      <div>
        <h1 class="page-title">Menu 1 - Quản lý dữ liệu</h1>
        <p class="page-subtitle">Thêm và quản lý thông tin hệ thống</p>
      </div>
      <a-button type="primary" size="large" @click="showAddModal">
        <template #icon>
          <plus-outlined />
        </template>
        Thêm mới
      </a-button>
    </div>

    <a-row :gutter="[16, 16]">
      <a-col :xs="24" :lg="12">
        <a-card title="Thông tin cơ bản" class="form-card" :loading="formLoading">
          <a-form
            :model="formData"
            :rules="rules"
            layout="vertical"
            @finish="handleSubmit"
            ref="formRef"
          >
            <a-form-item label="Tên dự án" name="projectName">
              <a-input
                v-model:value="formData.projectName"
                placeholder="Nhập tên dự án"
                size="large"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="Mô tả" name="description">
              <a-textarea
                v-model:value="formData.description"
                :rows="4"
                placeholder="Nhập mô tả dự án"
                show-count
                :maxlength="500"
              />
            </a-form-item>
            <a-form-item label="Trạng thái" name="status">
              <a-select
                v-model:value="formData.status"
                placeholder="Chọn trạng thái"
                size="large"
                allow-clear
              >
                <a-select-option value="active">Đang hoạt động</a-select-option>
                <a-select-option value="pending">Đang chờ</a-select-option>
                <a-select-option value="inactive">Tạm dừng</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item label="Ngày bắt đầu" name="startDate">
              <a-date-picker
                v-model:value="formData.startDate"
                style="width: 100%"
                size="large"
                format="DD/MM/YYYY"
              />
            </a-form-item>
            <a-form-item label="Mức độ ưu tiên" name="priority">
              <a-slider
                v-model:value="formData.priority"
                :marks="priorityMarks"
                :min="1"
                :max="5"
              />
            </a-form-item>
            <a-form-item>
              <a-space>
                <a-button type="primary" html-type="submit" :loading="submitting" size="large">
                  <template #icon>
                    <save-outlined />
                  </template>
                  Lưu thông tin
                </a-button>
                <a-button @click="handleReset" size="large">
                  <template #icon>
                    <reload-outlined />
                  </template>
                  Đặt lại
                </a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card title="Thống kê nhanh" class="info-card">
          <a-row :gutter="[16, 16]">
            <a-col :span="12" v-for="(info, index) in infoStats" :key="info.key">
              <transition name="scale" :style="{ 'transition-delay': `${index * 0.1}s` }">
                <div class="info-item" :class="`info-item-${info.color}`">
                  <div class="info-icon-wrapper">
                    <component :is="info.icon" class="info-icon" />
                  </div>
                  <div class="info-content">
                    <div class="info-value">{{ info.value }}</div>
                    <div class="info-label">{{ info.label }}</div>
                  </div>
                </div>
              </transition>
            </a-col>
          </a-row>
        </a-card>

        <a-card title="Hoạt động gần đây" class="activity-card" style="margin-top: 16px">
          <a-list :data-source="activities" size="small" :loading="activityLoading">
            <template #renderItem="{ item, index }">
              <transition name="slide-left" :style="{ 'transition-delay': `${index * 0.1}s` }">
                <a-list-item class="activity-list-item">
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :style="{ backgroundColor: item.color }" :size="40">
                        {{ item.icon }}
                      </a-avatar>
                    </template>
                    <template #title>{{ item.title }}</template>
                    <template #description>{{ item.time }}</template>
                  </a-list-item-meta>
                </a-list-item>
              </transition>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>

    <!-- Add Modal -->
    <a-modal
      v-model:open="addModalVisible"
      title="Thêm dự án mới"
      :confirm-loading="submitting"
      @ok="handleAddProject"
      width="600px"
    >
      <a-form :model="newProject" layout="vertical">
        <a-form-item label="Tên dự án" required>
          <a-input v-model:value="newProject.name" placeholder="Nhập tên dự án" />
        </a-form-item>
        <a-form-item label="Mô tả">
          <a-textarea v-model:value="newProject.description" :rows="3" />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  SaveOutlined,
  ReloadOutlined,
  PlusOutlined,
  FileAddOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'
import type { FormInstance } from 'ant-design-vue'

const formRef = ref<FormInstance>()
const formLoading = ref(false)
const submitting = ref(false)
const activityLoading = ref(false)
const addModalVisible = ref(false)

const formData = reactive({
  projectName: '',
  description: '',
  status: undefined,
  startDate: null as Dayjs | null,
  priority: 3
})

const newProject = reactive({
  name: '',
  description: ''
})

const rules = {
  projectName: [{ required: true, message: 'Vui lòng nhập tên dự án', trigger: 'blur' }],
  status: [{ required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }]
}

const priorityMarks = {
  1: 'Thấp',
  3: 'Trung bình',
  5: 'Cao'
}

const infoStats = ref([
  {
    key: 'running',
    label: 'Dự án đang chạy',
    value: 156,
    icon: FileAddOutlined,
    color: 'blue'
  },
  {
    key: 'completed',
    label: 'Hoàn thành',
    value: 89,
    icon: CheckCircleOutlined,
    color: 'green'
  },
  {
    key: 'pending',
    label: 'Đang chờ',
    value: 34,
    icon: ClockCircleOutlined,
    color: 'orange'
  },
  {
    key: 'cancelled',
    label: 'Đã hủy',
    value: 12,
    icon: CloseCircleOutlined,
    color: 'red'
  }
])

const activities = ref([
  {
    icon: '✓',
    title: 'Dự án mới đã được tạo',
    time: '2 giờ trước',
    color: '#52c41a'
  },
  {
    icon: '✎',
    title: 'Cập nhật thông tin dự án',
    time: '5 giờ trước',
    color: '#1890ff'
  },
  {
    icon: '✓',
    title: 'Dự án đã hoàn thành',
    time: '1 ngày trước',
    color: '#52c41a'
  },
  {
    icon: '⚠',
    title: 'Cảnh báo dự án sắp hết hạn',
    time: '2 ngày trước',
    color: '#faad14'
  }
])

const handleSubmit = async () => {
  submitting.value = true
  try {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    message.success('Lưu thông tin thành công!')
    handleReset()
  } catch (error) {
    message.error('Có lỗi xảy ra!')
  } finally {
    submitting.value = false
  }
}

const handleReset = () => {
  formRef.value?.resetFields()
  formData.priority = 3
  message.info('Đã đặt lại form')
}

const showAddModal = () => {
  addModalVisible.value = true
}

const handleAddProject = () => {
  if (!newProject.name) {
    message.warning('Vui lòng nhập tên dự án')
    return
  }
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    addModalVisible.value = false
    newProject.name = ''
    newProject.description = ''
    message.success('Thêm dự án thành công!')
  }, 1000)
}
</script>

<style scoped lang="scss">
.menu1 {
  width: 100%;
  animation: fadeIn 0.5s ease-in;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;

  .page-title {
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 8px 0;
    color: #262626;
  }

  .page-subtitle {
    color: #8c8c8c;
    margin: 0;
    font-size: 14px;
  }
}

.form-card,
.info-card,
.activity-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  :deep(.ant-card-head) {
    border-bottom: 1px solid #f0f0f0;
  }

  :deep(.ant-card-body) {
    padding: 24px;
  }
}

.info-item {
  display: flex;
  align-items: center;
  padding: 20px;
  background: #fafafa;
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    background: #f0f0f0;
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &.info-item-blue .info-icon-wrapper {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  &.info-item-green .info-icon-wrapper {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  }

  &.info-item-orange .info-icon-wrapper {
    background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  }

  &.info-item-red .info-icon-wrapper {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  }
}

.info-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  transition: all 0.3s;
}

.info-icon {
  font-size: 24px;
  color: white;
}

.info-content {
  flex: 1;
}

.info-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1;
  margin-bottom: 4px;
}

.info-label {
  font-size: 12px;
  color: #8c8c8c;
}

.activity-list-item {
  padding: 12px 0;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
    padding-left: 8px;
    border-radius: 6px;
  }
}

// Animations
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scale-enter-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.scale-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.slide-left-enter-active {
  transition: all 0.5s ease-out;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
