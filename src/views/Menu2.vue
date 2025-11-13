<template>
  <div class="menu2">
    <div class="page-header">
      <div>
        <h1 class="page-title">Menu 2 - Danh sách dữ liệu</h1>
        <p class="page-subtitle">Quản lý và xem danh sách chi tiết</p>
      </div>
      <a-space>
        <a-input-search
          v-model:value="searchText"
          placeholder="Tìm kiếm..."
          style="width: 250px"
          @search="handleSearch"
          allow-clear
        />
        <a-button type="primary" size="large" @click="showAddModal">
          <template #icon>
            <plus-outlined />
          </template>
          Thêm mới
        </a-button>
        <a-button @click="refreshData" :loading="loading">
          <template #icon>
            <reload-outlined />
          </template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-card class="table-card" :loading="loading">
      <template #title>
        <div class="card-title">
          <database-outlined />
          <span style="margin-left: 8px">Danh sách người dùng</span>
          <a-badge :count="filteredDataSource.length" :number-style="{ backgroundColor: '#52c41a' }" />
        </div>
      </template>
      <template #extra>
        <a-space>
          <a-select
            v-model:value="statusFilter"
            placeholder="Lọc theo trạng thái"
            style="width: 150px"
            allow-clear
            @change="handleFilterChange"
          >
            <a-select-option value="Hoạt động">Hoạt động</a-select-option>
            <a-select-option value="Tạm khóa">Tạm khóa</a-select-option>
            <a-select-option value="Chờ duyệt">Chờ duyệt</a-select-option>
          </a-select>
          <a-button @click="exportData">
            <template #icon>
              <download-outlined />
            </template>
            Xuất file
          </a-button>
        </a-space>
      </template>

      <a-table
        :columns="columns"
        :data-source="filteredDataSource"
        :pagination="{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: pagination.total,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} bản ghi`,
          showQuickJumper: true
        }"
        :loading="loading"
        row-key="key"
        @change="handleTableChange"
        :scroll="{ x: 1000 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar :src="record.avatar" :size="40" class="user-avatar">
              {{ record.name.charAt(0) }}
            </a-avatar>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag :color="getStatusColor(record.status)" class="status-tag">
              {{ record.status }}
            </a-tag>
          </template>
          <template v-if="column.key === 'email'">
            <a href="mailto:{{ record.email }}" class="email-link">{{ record.email }}</a>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a-button type="link" size="small" @click="handleView(record)">
                <template #icon>
                  <eye-outlined />
                </template>
                Xem
              </a-button>
              <a-button type="link" size="small" @click="handleEdit(record)">
                <template #icon>
                  <edit-outlined />
                </template>
                Sửa
              </a-button>
              <a-popconfirm
                title="Bạn có chắc chắn muốn xóa?"
                ok-text="Xóa"
                cancel-text="Hủy"
                @confirm="handleDelete(record)"
              >
                <a-button type="link" size="small" danger>
                  <template #icon>
                    <delete-outlined />
                  </template>
                  Xóa
                </a-button>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- Add/Edit Modal -->
    <a-modal
      v-model:open="modalVisible"
      :title="modalTitle"
      :confirm-loading="submitting"
      @ok="handleModalOk"
      width="600px"
      @cancel="handleModalCancel"
    >
      <a-form :model="formData" layout="vertical" ref="formRef">
        <a-form-item label="Tên" name="name" :rules="[{ required: true, message: 'Vui lòng nhập tên' }]">
          <a-input v-model:value="formData.name" placeholder="Nhập tên" />
        </a-form-item>
        <a-form-item
          label="Email"
          name="email"
          :rules="[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' }
          ]"
        >
          <a-input v-model:value="formData.email" placeholder="Nhập email" />
        </a-form-item>
        <a-form-item label="Tuổi" name="age" :rules="[{ required: true, message: 'Vui lòng nhập tuổi' }]">
          <a-input-number v-model:value="formData.age" :min="1" :max="100" style="width: 100%" />
        </a-form-item>
        <a-form-item label="Địa chỉ" name="address">
          <a-input v-model:value="formData.address" placeholder="Nhập địa chỉ" />
        </a-form-item>
        <a-form-item label="Trạng thái" name="status">
          <a-select v-model:value="formData.status" placeholder="Chọn trạng thái">
            <a-select-option value="Hoạt động">Hoạt động</a-select-option>
            <a-select-option value="Tạm khóa">Tạm khóa</a-select-option>
            <a-select-option value="Chờ duyệt">Chờ duyệt</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- View Modal -->
    <a-modal v-model:open="viewModalVisible" title="Chi tiết người dùng" :footer="null" width="500px">
      <a-descriptions :column="1" bordered v-if="selectedRecord">
        <a-descriptions-item label="Avatar">
          <a-avatar :src="selectedRecord.avatar" :size="64">
            {{ selectedRecord.name.charAt(0) }}
          </a-avatar>
        </a-descriptions-item>
        <a-descriptions-item label="Tên">{{ selectedRecord.name }}</a-descriptions-item>
        <a-descriptions-item label="Email">{{ selectedRecord.email }}</a-descriptions-item>
        <a-descriptions-item label="Tuổi">{{ selectedRecord.age }}</a-descriptions-item>
        <a-descriptions-item label="Địa chỉ">{{ selectedRecord.address }}</a-descriptions-item>
        <a-descriptions-item label="Trạng thái">
          <a-tag :color="getStatusColor(selectedRecord.status)">{{ selectedRecord.status }}</a-tag>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { message } from 'ant-design-vue'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DatabaseOutlined,
  DownloadOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons-vue'
import type { TableProps } from 'ant-design-vue'
import type { FormInstance } from 'ant-design-vue'

interface UserRecord {
  key: string
  name: string
  email: string
  age: number
  address: string
  status: string
  avatar: string
}

const loading = ref(false)
const searchText = ref('')
const statusFilter = ref<string | undefined>(undefined)
const modalVisible = ref(false)
const viewModalVisible = ref(false)
const submitting = ref(false)
const isEditMode = ref(false)
const editingKey = ref<string | null>(null)
const selectedRecord = ref<UserRecord | null>(null)
const formRef = ref<FormInstance>()

const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0
})

const formData = reactive({
  name: '',
  email: '',
  age: undefined as number | undefined,
  address: '',
  status: 'Hoạt động'
})

const columns = [
  {
    title: 'Avatar',
    key: 'avatar',
    width: 80,
    fixed: 'left'
  },
  {
    title: 'Tên',
    dataIndex: 'name',
    key: 'name',
    sorter: (a: UserRecord, b: UserRecord) => a.name.localeCompare(b.name),
    width: 200
  },
  {
    title: 'Email',
    dataIndex: 'email',
    key: 'email',
    width: 250
  },
  {
    title: 'Tuổi',
    dataIndex: 'age',
    key: 'age',
    sorter: (a: UserRecord, b: UserRecord) => a.age - b.age,
    width: 100
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    key: 'address',
    width: 250
  },
  {
    title: 'Trạng thái',
    key: 'status',
    width: 120,
    filters: [
      { text: 'Hoạt động', value: 'Hoạt động' },
      { text: 'Tạm khóa', value: 'Tạm khóa' },
      { text: 'Chờ duyệt', value: 'Chờ duyệt' }
    ],
    onFilter: (value: string, record: UserRecord) => record.status === value
  },
  {
    title: 'Hành động',
    key: 'action',
    width: 200,
    fixed: 'right'
  }
]

const dataSource = ref<UserRecord[]>([
  {
    key: '1',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    age: 28,
    address: 'Hà Nội, Việt Nam',
    status: 'Hoạt động',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1'
  },
  {
    key: '2',
    name: 'Trần Thị B',
    email: 'tranthib@example.com',
    age: 32,
    address: 'Hồ Chí Minh, Việt Nam',
    status: 'Hoạt động',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2'
  },
  {
    key: '3',
    name: 'Lê Văn C',
    email: 'levanc@example.com',
    age: 25,
    address: 'Đà Nẵng, Việt Nam',
    status: 'Tạm khóa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=3'
  },
  {
    key: '4',
    name: 'Phạm Thị D',
    email: 'phamthid@example.com',
    age: 35,
    address: 'Cần Thơ, Việt Nam',
    status: 'Hoạt động',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=4'
  },
  {
    key: '5',
    name: 'Hoàng Văn E',
    email: 'hoangvane@example.com',
    age: 29,
    address: 'Hải Phòng, Việt Nam',
    status: 'Chờ duyệt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=5'
  },
  {
    key: '6',
    name: 'Vũ Thị F',
    email: 'vuthif@example.com',
    age: 27,
    address: 'Huế, Việt Nam',
    status: 'Hoạt động',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=6'
  },
  {
    key: '7',
    name: 'Đặng Văn G',
    email: 'dangvang@example.com',
    age: 31,
    address: 'Nha Trang, Việt Nam',
    status: 'Hoạt động',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=7'
  },
  {
    key: '8',
    name: 'Bùi Thị H',
    email: 'buithih@example.com',
    age: 26,
    address: 'Vũng Tàu, Việt Nam',
    status: 'Tạm khóa',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=8'
  },
  {
    key: '9',
    name: 'Lý Văn I',
    email: 'lyvani@example.com',
    age: 33,
    address: 'Quy Nhon, Việt Nam',
    status: 'Hoạt động',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=9'
  },
  {
    key: '10',
    name: 'Trương Thị K',
    email: 'truongthik@example.com',
    age: 30,
    address: 'Phan Thiết, Việt Nam',
    status: 'Chờ duyệt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=10'
  }
])

const filteredDataSource = computed(() => {
  let filtered = dataSource.value

  if (searchText.value) {
    const search = searchText.value.toLowerCase()
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.email.toLowerCase().includes(search) ||
        item.address.toLowerCase().includes(search)
    )
  }

  if (statusFilter.value) {
    filtered = filtered.filter((item) => item.status === statusFilter.value)
  }

  pagination.total = filtered.length
  return filtered
})

const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Hoạt động': 'green',
    'Tạm khóa': 'red',
    'Chờ duyệt': 'orange'
  }
  return colors[status] || 'default'
}

const handleSearch = () => {
  pagination.current = 1
  message.info(`Đang tìm kiếm: ${searchText.value || 'tất cả'}`)
}

const handleFilterChange = () => {
  pagination.current = 1
}

const handleTableChange: TableProps['onChange'] = (pag) => {
  if (pag) {
    pagination.current = pag.current || 1
    pagination.pageSize = pag.pageSize || 10
  }
}

const showAddModal = () => {
  isEditMode.value = false
  editingKey.value = null
  resetForm()
  modalVisible.value = true
}

const handleView = (record: UserRecord) => {
  selectedRecord.value = record
  viewModalVisible.value = true
}

const handleEdit = (record: UserRecord) => {
  isEditMode.value = true
  editingKey.value = record.key
  formData.name = record.name
  formData.email = record.email
  formData.age = record.age
  formData.address = record.address
  formData.status = record.status
  modalVisible.value = true
}

const handleDelete = (record: UserRecord) => {
  const index = dataSource.value.findIndex((item) => item.key === record.key)
  if (index > -1) {
    dataSource.value.splice(index, 1)
    message.success('Xóa thành công!')
  }
}

const handleModalOk = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true

    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (isEditMode.value && editingKey.value) {
      const index = dataSource.value.findIndex((item) => item.key === editingKey.value)
      if (index > -1) {
        dataSource.value[index] = {
          ...dataSource.value[index],
          ...formData,
          age: formData.age || 0
        }
        message.success('Cập nhật thành công!')
      }
    } else {
      const newKey = String(dataSource.value.length + 1)
      dataSource.value.push({
        key: newKey,
        ...formData,
        age: formData.age || 0,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newKey}`
      })
      message.success('Thêm mới thành công!')
    }

    resetForm()
    modalVisible.value = false
  } catch (error) {
    console.error('Validation failed:', error)
  } finally {
    submitting.value = false
  }
}

const handleModalCancel = () => {
  resetForm()
  modalVisible.value = false
}

const resetForm = () => {
  formData.name = ''
  formData.email = ''
  formData.age = undefined
  formData.address = ''
  formData.status = 'Hoạt động'
  formRef.value?.resetFields()
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success('Đã làm mới dữ liệu')
  }, 1000)
}

const exportData = () => {
  message.info('Đang xuất file...')
  // Simulate export
  setTimeout(() => {
    message.success('Xuất file thành công!')
  }, 1500)
}
</script>

<style scoped lang="scss">
.menu2 {
  width: 100%;
  animation: fadeIn 0.5s ease-in;
}

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

.table-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: none;
  transition: all 0.3s;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  }

  .card-title {
    display: flex;
    align-items: center;
    font-size: 16px;
    font-weight: 600;
  }

  :deep(.ant-card-head) {
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 24px;
  }

  :deep(.ant-card-body) {
    padding: 24px;
  }

  :deep(.ant-table) {
    .ant-table-thead > tr > th {
      background: #fafafa;
      font-weight: 600;
    }

    .ant-table-tbody > tr {
      transition: all 0.3s;

      &:hover {
        background: #f5f5f5;
        transform: scale(1.01);
      }
    }
  }
}

.user-avatar {
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
  }
}

.status-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 500;
  transition: all 0.3s;

  &:hover {
    transform: scale(1.1);
  }
}

.email-link {
  color: #1890ff;
  text-decoration: none;
  transition: all 0.3s;

  &:hover {
    color: #40a9ff;
    text-decoration: underline;
  }
}
</style>
