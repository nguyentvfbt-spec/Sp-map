<template>
  <div class="dashboard">
    <div class="page-header">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-subtitle">Tổng quan hệ thống và thống kê</p>
      </div>
      <a-space>
        <a-range-picker v-model:value="dateRange" />
        <a-button type="primary" @click="refreshData" :loading="loading">
          <template #icon>
            <reload-outlined />
          </template>
          Làm mới
        </a-button>
      </a-space>
    </div>

    <a-row :gutter="[16, 16]" class="stats-row">
      <a-col :xs="24" :sm="12" :md="6" v-for="(stat, index) in stats" :key="stat.key">
        <transition name="slide-up" :style="{ 'transition-delay': `${index * 0.1}s` }">
          <a-card class="stat-card" :class="`stat-card-${stat.color}`" hoverable>
            <div class="stat-content">
              <div class="stat-icon-wrapper">
                <component :is="stat.icon" class="stat-icon" />
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ formatNumber(stat.value) }}</div>
                <div class="stat-label">{{ stat.label }}</div>
              </div>
            </div>
            <div class="stat-trend">
              <component :is="stat.trendIcon" :style="{ color: stat.trendColor }" />
              <span :style="{ color: stat.trendColor, marginLeft: '4px' }">{{ stat.trend }}%</span>
              <span style="margin-left: 8px; color: #8c8c8c">so với tháng trước</span>
            </div>
          </a-card>
        </transition>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 24px">
      <a-col :xs="24" :lg="16">
        <a-card title="Biểu đồ doanh thu" class="chart-card" :loading="loading">
          <template #extra>
            <a-radio-group v-model:value="chartType" size="small">
              <a-radio-button value="day">Ngày</a-radio-button>
              <a-radio-button value="week">Tuần</a-radio-button>
              <a-radio-button value="month">Tháng</a-radio-button>
            </a-radio-group>
          </template>
          <div class="chart-container">
            <div class="chart-placeholder">
              <line-chart-outlined style="font-size: 48px; color: #1890ff; opacity: 0.3" />
              <p style="color: #8c8c8c; margin-top: 16px">Biểu đồ doanh thu 7 ngày qua</p>
              <a-space style="margin-top: 16px">
                <a-tag color="blue">Hôm nay: ${{ formatNumber(revenueToday) }}</a-tag>
                <a-tag color="green">Tăng {{ revenueGrowth }}%</a-tag>
              </a-space>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="8">
        <a-card title="Hoạt động gần đây" class="activity-card">
          <a-timeline>
            <a-timeline-item
              v-for="(activity, index) in recentActivities"
              :key="index"
              :color="activity.color"
            >
              <div class="activity-item">
                <p class="activity-text">{{ activity.text }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </a-timeline-item>
          </a-timeline>
        </a-card>
      </a-col>
    </a-row>

    <a-row :gutter="[16, 16]" style="margin-top: 24px">
      <a-col :xs="24" :lg="12">
        <a-card title="Top sản phẩm bán chạy" class="table-card">
          <a-table
            :columns="productColumns"
            :data-source="topProducts"
            :pagination="false"
            size="small"
            :loading="loading"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'rank'">
                <a-badge
                  :count="record.rank"
                  :number-style="{
                    backgroundColor: record.rank <= 3 ? '#52c41a' : '#1890ff'
                  }"
                />
              </template>
              <template v-if="column.key === 'sales'">
                <span style="font-weight: 600; color: #52c41a">${{ formatNumber(record.sales) }}</span>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :xs="24" :lg="12">
        <a-card title="Thống kê nhanh" class="quick-stats-card">
          <a-list :data-source="quickStats" size="small">
            <template #renderItem="{ item }">
              <a-list-item class="quick-stat-item">
                <a-list-item-meta>
                  <template #title>
                    <span>{{ item.title }}</span>
                  </template>
                  <template #description>
                    <span :style="{ color: item.color, fontWeight: 'bold', fontSize: '16px' }">
                      {{ item.value }}
                    </span>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a-tag :color="item.tagColor">{{ item.tag }}</a-tag>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  FileTextOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ReloadOutlined,
  LineChartOutlined
} from '@ant-design/icons-vue'
import type { Dayjs } from 'dayjs'

const loading = ref(false)
const dateRange = ref<[Dayjs, Dayjs] | null>(null)
const chartType = ref('week')
const revenueToday = ref(12580)
const revenueGrowth = ref(15.3)

const stats = ref([
  {
    key: 'users',
    label: 'Tổng người dùng',
    value: 1234,
    trend: 12.5,
    trendColor: '#52c41a',
    trendIcon: ArrowUpOutlined,
    icon: UserOutlined,
    color: 'blue'
  },
  {
    key: 'orders',
    label: 'Đơn hàng',
    value: 5678,
    trend: 8.2,
    trendColor: '#52c41a',
    trendIcon: ArrowUpOutlined,
    icon: ShoppingCartOutlined,
    color: 'green'
  },
  {
    key: 'revenue',
    label: 'Doanh thu',
    value: 89012,
    trend: 15.3,
    trendColor: '#52c41a',
    trendIcon: ArrowUpOutlined,
    icon: DollarOutlined,
    color: 'orange'
  },
  {
    key: 'products',
    label: 'Sản phẩm',
    value: 2456,
    trend: -3.1,
    trendColor: '#ff4d4f',
    trendIcon: ArrowDownOutlined,
    icon: FileTextOutlined,
    color: 'purple'
  }
])

const recentActivities = ref([
  {
    text: 'Đơn hàng mới #1234 đã được tạo',
    time: '2 phút trước',
    color: 'green'
  },
  {
    text: 'Người dùng mới đã đăng ký',
    time: '15 phút trước',
    color: 'blue'
  },
  {
    text: 'Sản phẩm mới đã được thêm vào kho',
    time: '1 giờ trước',
    color: 'orange'
  },
  {
    text: 'Báo cáo tháng đã được tạo',
    time: '3 giờ trước',
    color: 'purple'
  }
])

const topProducts = ref([
  { key: '1', rank: 1, name: 'Sản phẩm A', sales: 12500, quantity: 250 },
  { key: '2', rank: 2, name: 'Sản phẩm B', sales: 9800, quantity: 196 },
  { key: '3', rank: 3, name: 'Sản phẩm C', sales: 7600, quantity: 152 },
  { key: '4', rank: 4, name: 'Sản phẩm D', sales: 5400, quantity: 108 },
  { key: '5', rank: 5, name: 'Sản phẩm E', sales: 3200, quantity: 64 }
])

const productColumns = [
  { title: 'Hạng', key: 'rank', width: 80 },
  { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
  { title: 'Doanh số', key: 'sales', width: 120 }
]

const quickStats = ref([
  { title: 'Đơn hàng chờ xử lý', value: '23', color: '#faad14', tag: 'Cao', tagColor: 'orange' },
  { title: 'Đơn hàng đang giao', value: '45', color: '#1890ff', tag: 'Bình thường', tagColor: 'blue' },
  { title: 'Đơn hàng hoàn thành', value: '1,234', color: '#52c41a', tag: 'Tốt', tagColor: 'green' },
  { title: 'Đơn hàng đã hủy', value: '12', color: '#ff4d4f', tag: 'Thấp', tagColor: 'red' }
])

const formatNumber = (num: number) => {
  return new Intl.NumberFormat('vi-VN').format(num)
}

const refreshData = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
    message.success('Đã làm mới dữ liệu')
  }, 1000)
}

onMounted(() => {
  // Simulate data loading
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped lang="scss">
.dashboard {
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

.stats-row {
  margin-bottom: 24px;
}

.stat-card {
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  :deep(.ant-card-body) {
    padding: 24px;
  }

  &.stat-card-blue {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &.stat-card-green {
    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &.stat-card-orange {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }
  }

  &.stat-card-purple {
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;

    .stat-icon-wrapper {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.stat-content {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.stat-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  background: rgba(24, 144, 255, 0.1);
  transition: all 0.3s;
}

.stat-icon {
  font-size: 28px;
  color: #1890ff;
}

.stat-card-blue .stat-icon,
.stat-card-green .stat-icon,
.stat-card-orange .stat-icon,
.stat-card-purple .stat-icon {
  color: white;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 32px;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
}

.stat-trend {
  display: flex;
  align-items: center;
  font-size: 12px;
  margin-top: 8px;
}

.chart-card,
.activity-card,
.table-card,
.quick-stats-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: none;
  height: 100%;
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

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-placeholder {
  text-align: center;
}

.activity-item {
  .activity-text {
    margin: 0 0 4px 0;
    color: #262626;
    font-size: 14px;
  }

  .activity-time {
    margin: 0;
    color: #8c8c8c;
    font-size: 12px;
  }
}

.quick-stat-item {
  padding: 12px 0;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
    padding-left: 8px;
    border-radius: 6px;
  }
}

.slide-up-enter-active {
  transition: all 0.5s ease-out;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
</style>
