<template>
  <div class="filters-card">
    <a-row :gutter="[16, 16]" align="middle" class="filters-grid">
      <a-col :xs="24" :lg="18">
        <a-form
          layout="horizontal"
          :model="{ selectedCategory, selectedStatus, selectedRange, selectedChannel }"
          labelAlign="left"
          :label-col="{ flex: '120px' }"
          :wrapper-col="{ flex: 'auto' }"
        >
          <a-row :gutter="[16, 16]">
            <a-col :xs="12" :sm="12" :md="12">
              <a-form-item label="Danh mục">
                <a-select
                  :value="selectedCategory"
                  :options="categoryOptions"
                  placeholder="Chọn danh mục"
                  allow-clear
                  show-search
                  size="small"
                  style="width: 100%"
                  @update:value="onUpdateSelectedCategory"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="12" :sm="12" :md="12">
              <a-form-item label="Trạng thái">
                <a-select
                  :value="selectedStatus"
                  :options="statusOptions"
                  placeholder="Chọn trạng thái"
                  allow-clear
                  show-search
                  size="small"
                  style="width: 100%"
                  @update:value="onUpdateSelectedStatus"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="12" :sm="12" :md="12">
              <a-form-item label="Thời gian">
                <a-select
                  :value="selectedRange"
                  :options="rangeOptions"
                  placeholder="Khoảng thời gian"
                  allow-clear
                  size="small"
                  style="width: 100%"
                  @update:value="onUpdateSelectedRange"
                />
              </a-form-item>
            </a-col>
            <a-col :xs="12" :sm="12" :md="12">
              <a-form-item label="Kênh">
                <a-select
                  :value="selectedChannel"
                  :options="channelOptions"
                  placeholder="Chọn kênh"
                  allow-clear
                  show-search
                  size="small"
                  style="width: 100%"
                  @update:value="onUpdateSelectedChannel"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-col>
      <a-col :xs="24" :lg="6" class="filters-actions-col">
        <div class="filters-actions-vcenter">
          <a-button type="primary" size="small" @click="$emit('search')">
            <search-outlined />
            <span style="margin-left: 6px;">Tìm kiếm</span>
          </a-button>
        </div>
      </a-col>
    </a-row>
  </div>
  </template>

<script setup lang="ts">
import { SearchOutlined } from '@ant-design/icons-vue'

type Option = { label: string; value: string }

const props = defineProps<{
  selectedCategory?: string
  selectedStatus?: string
  selectedRange?: string
  selectedChannel?: string
  categoryOptions: Option[]
  statusOptions: Option[]
  rangeOptions: Option[]
  channelOptions: Option[]
}>()

const emit = defineEmits<{
  (e: 'update:selectedCategory', value?: string): void
  (e: 'update:selectedStatus', value?: string): void
  (e: 'update:selectedRange', value?: string): void
  (e: 'update:selectedChannel', value?: string): void
  (e: 'search'): void
}>()

function onUpdateSelectedCategory(value?: string) {
  emit('update:selectedCategory', value)
}
function onUpdateSelectedStatus(value?: string) {
  emit('update:selectedStatus', value)
}
function onUpdateSelectedRange(value?: string) {
  emit('update:selectedRange', value)
}
function onUpdateSelectedChannel(value?: string) {
  emit('update:selectedChannel', value)
}
</script>

<style scoped lang="scss">
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
    margin-bottom: 0;
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
</style>


