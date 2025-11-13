<template>
  <div class="new-page">
    <a-space direction="vertical" size="large" style="width: 100%">
      <!-- Card 1 -->
      <a-card title="Bộ lọc và Tổng quan">
        <div class="split-box">
          <a-row :gutter="[16, 16]" class="card1-row">
          <!-- Trái 60%: Bộ lọc + Tabs -->
          <a-col :xs="24" :lg="14" class="left-pane">
            <FilterBar
              :category-options="categoryOptions"
              :status-options="statusOptions"
              :range-options="rangeOptions"
              :channel-options="channelOptions"
              v-model:selectedCategory="selectedCategory1"
              v-model:selectedStatus="selectedStatus1"
              v-model:selectedRange="selectedRange1"
              v-model:selectedChannel="selectedChannel1"
              @search="handleSearchClick"
            />

            <a-tabs
              v-model:activeKey="activeTab"
              type="card"
              size="small"
              :tabBarGutter="8"
              class="mt-8 card-tabs"
            >
              <a-tab-pane key="1" tab="Tổng quan">
                <a-row :gutter="[16, 16]">
                  <a-col :xs="24" :md="12">
                    <a-card size="small" title="Mô tả" :bordered="true">
                      <div class="text-block">
                        {{ overviewText }}
                      </div>
                    </a-card>
                  </a-col>
                  <a-col :xs="24" :md="12">
                    <a-card size="small" title="Pie Chart" :bordered="true">
                      <v-chart class="chart" :option="pieOptions" autoresize />
                    </a-card>
                  </a-col>
                </a-row>
              </a-tab-pane>
              <a-tab-pane key="2" tab="Bảng dữ liệu">
                <a-card size="small" :bordered="true">
                  <a-table
                    :columns="columns"
                    :data-source="pagedData"
                    :pagination="paginationConfig"
                    :scroll="{ y: 240 }"
                    row-key="id"
                  />
                </a-card>
              </a-tab-pane>
              <a-tab-pane key="3" tab="Line Chart">
                <a-card size="small" :bordered="true">
                  <v-chart class="chart" :option="lineOptions" autoresize />
                </a-card>
              </a-tab-pane>
            </a-tabs>
          </a-col>

          <!-- Phải 40%: Giao diện Trends -->
          <a-col :xs="24" :lg="10" class="right-pane">
            <a-card size="small" title="Xu hướng" :bordered="true">
              <div class="trend-header">
                <a-segmented
                  v-model:value="trendRange"
                  :options="trendRangeOptions"
                  size="small"
                />
              </div>
              <TrendList :items="trendStrings" />
            </a-card>
          </a-col>
          </a-row>
        </div>
      </a-card>

      <!-- Card 2 -->
      <a-card title="Card 2">
        <FilterBar
          :category-options="categoryOptions"
          :status-options="statusOptions"
          :range-options="rangeOptions"
          :channel-options="channelOptions"
          v-model:selectedCategory="selectedCategory2"
          v-model:selectedStatus="selectedStatus2"
          v-model:selectedRange="selectedRange2"
          v-model:selectedChannel="selectedChannel2"
          @search="handleSearchClick"
        />
        <div class="placeholder">
          Nội dung card 2 (bạn có thể cập nhật theo nhu cầu).
        </div>
      </a-card>

      <!-- Card 3 -->
      <a-card title="Card 3">
        <FilterBar
          :category-options="categoryOptions"
          :status-options="statusOptions"
          :range-options="rangeOptions"
          :channel-options="channelOptions"
          v-model:selectedCategory="selectedCategory3"
          v-model:selectedStatus="selectedStatus3"
          v-model:selectedRange="selectedRange3"
          v-model:selectedChannel="selectedChannel3"
          @search="handleSearchClick"
        />
        <div class="placeholder">
          Nội dung card 3 (bạn có thể cập nhật theo nhu cầu).
        </div>
      </a-card>
    </a-space>
  </div>
  </template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import FilterBar from '@/components/common/FilterBar.vue'
import TrendList from '@/components/common/TrendList.vue'
import { useNewPage } from '@/composables/useNewPage'

use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent])

const activeTab = ref('1')

const {
  categoryOptions,
  statusOptions,
  rangeOptions,
  channelOptions,
  pieOptions,
  columns,
  pagedData,
  paginationConfig,
  lineOptions,
  trendRange,
  trendRangeOptions,
  trendStrings,
  handleSearchClick
} = useNewPage()

// Separate filter states for each FilterBar instance
const selectedCategory1 = ref<string | undefined>(undefined)
const selectedStatus1 = ref<string | undefined>(undefined)
const selectedRange1 = ref<string | undefined>(undefined)
const selectedChannel1 = ref<string | undefined>(undefined)

const selectedCategory2 = ref<string | undefined>(undefined)
const selectedStatus2 = ref<string | undefined>(undefined)
const selectedRange2 = ref<string | undefined>(undefined)
const selectedChannel2 = ref<string | undefined>(undefined)

const selectedCategory3 = ref<string | undefined>(undefined)
const selectedStatus3 = ref<string | undefined>(undefined)
const selectedRange3 = ref<string | undefined>(undefined)
const selectedChannel3 = ref<string | undefined>(undefined)

const overviewText = computed(() => {
  const parts: string[] = []
  parts.push(`Danh mục: ${selectedCategory1.value ?? '—'}`)
  parts.push(`Trạng thái: ${selectedStatus1.value ?? '—'}`)
  parts.push(`Khoảng thời gian: ${selectedRange1.value ?? '—'}`)
  return `Bộ lọc hiện tại — ${parts.join(' | ')}`
})
</script>

<script lang="ts">
export default {
  components: {
    VChart
  }
}
</script>

<style scoped lang="scss">
.new-page {
  .card1-row {
    align-items: stretch;
  }

  .split-box {
    border: 1px solid #d9d9d9;
    border-radius: 10px;
    padding: 12px;
    background: #fff;
  }

  .left-pane {
    padding-right: 16px;
    border-right: 3px solid #e4e2e2;
  }

  .right-pane {
    padding-left: 16px;
  }

  .mt-16 {
    margin-top: 16px;
  }

  .mt-8 {
    margin-top: 8px;
  }

  .filters-card {
    margin-bottom: 12px;
    background: #f7fbff;
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #d6e8ff;

    .filters-grid {
      width: 100%;
    }

    :deep(.ant-form-item) {
      margin-bottom: 0; // gọn hàng
      width: 100%;
    }
    :deep(.ant-form-item-label) {
      padding-right: 8px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      display: block;
      width: 120px;
    }
    :deep(.ant-select) {
      width: 100%;
    }
    :deep(.ant-form-item-control) {
      flex: 1;
    }
    :deep(.ant-select-selector) {
      align-items: center;
      display: flex;
    }
  }

  .filters-actions-col {
    display: flex;
    align-items: stretch;
  }
  .filters-actions-vcenter {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  // Elevate and beautify all cards on the page
  :deep(.ant-card) {
    border: 1px solid #e6ebf1;
    border-radius: 12px;
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.08);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
  :deep(.ant-card:hover) {
    border-color: #91caff;
    box-shadow: 0 10px 24px rgba(24, 144, 255, 0.12);
  }
  :deep(.ant-card-head) {
    padding: 0 16px;
    min-height: 44px;
    background: linear-gradient(180deg, #fafcff 0%, #ffffff 100%);
    border-bottom: 1px solid #eef2f7;
    border-top-left-radius: 12px;
    border-top-right-radius: 12px;
  }
  :deep(.ant-card-head-title) {
    font-weight: 600;
    color: #1f2d3d;
    letter-spacing: 0.2px;
  }
  :deep(.ant-card-body) {
    padding: 16px;
  }

  .text-block {
    min-height: 120px;
    display: flex;
    align-items: center;
    padding: 12px;
    background: #fafafa;
    border: 1px dashed #e8e8e8;
    border-radius: 6px;
  }

  .chart {
    width: 100%;
    height: 300px;
  }

  .card-tabs :deep(.ant-tabs-nav) {
    margin-bottom: 12px;
  }
  .card-tabs :deep(.ant-tabs-card .ant-tabs-tab) {
    border-radius: 6px 6px 0 0;
  }

  .placeholder {
    min-height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafafa;
    border: 1px dashed #e8e8e8;
    border-radius: 6px;
  }

  // Trends
  .trend-header {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #f0f0f0;
  }

  .trend-simple-list {
    max-height: 420px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .trend-row {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    transition: all 0.2s;

    &:hover {
      border-color: #91caff;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
      transform: translateY(-1px);
    }

    .dot {
      width: 8px;
      height: 8px;
      background: #1890ff;
      border-radius: 50%;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .text {
      color: #262626;
      font-weight: 500;
    }
  }
}
</style>


