import { ref, computed } from 'vue'
import type { EChartsOption } from 'echarts'
import { message } from 'ant-design-vue'
import {
  categoryOptions as categoryOptionsMock,
  statusOptions as statusOptionsMock,
  rangeOptions as rangeOptionsMock,
  channelOptions as channelOptionsMock,
  tableMockData,
  pieMockData,
  lineMockSeriesA,
  lineMockSeriesB,
  trendMap,
  type RowData
} from '@/mocks/newPage.mock'

export function useNewPage() {
  const selectedCategory = ref<string | undefined>(undefined)
  const selectedStatus = ref<string | undefined>(undefined)
  const selectedRange = ref<string | undefined>(undefined)
  const selectedChannel = ref<string | undefined>(undefined)

  const categoryOptions = categoryOptionsMock
  const statusOptions = statusOptionsMock
  const rangeOptions = rangeOptionsMock
  const channelOptions = channelOptionsMock

  const overviewText = computed(() => {
    const parts: string[] = []
    parts.push(`Danh mục: ${selectedCategory.value ?? '—'}`)
    parts.push(`Trạng thái: ${selectedStatus.value ?? '—'}`)
    parts.push(`Khoảng thời gian: ${selectedRange.value ?? '—'}`)
    return `Bộ lọc hiện tại — ${parts.join(' | ')}`
  })

  const pieOptions = ref<EChartsOption>({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { orient: 'vertical', right: 0, top: 'middle' },
    series: [
      {
        name: 'Phân bổ',
        type: 'pie',
        radius: '70%',
        center: ['40%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 1 },
        label: { show: true, formatter: '{b}\n{d}%' },
        labelLine: { show: true, length: 8, length2: 8 },
        data: pieMockData
      }
    ]
  })

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 140 }
  ]

  const tableData = ref<RowData[]>(tableMockData)

  const paginationConfig = {
    pageSize: 5,
    showSizeChanger: false,
    showLessItems: true
  }

  const pagedData = computed(() => tableData.value)

  const lineOptions = ref<EChartsOption>({
    tooltip: { trigger: 'axis' },
    legend: { top: 0 },
    grid: { left: 40, right: 20, bottom: 30, top: 40, containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Lượt xem',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: lineMockSeriesA
      },
      {
        name: 'Chuyển đổi',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: lineMockSeriesB
      }
    ]
  })

  const trendRange = ref<'7d' | '30d' | '90d'>('7d')
  const trendRangeOptions = [
    { label: '7 ngày', value: '7d' },
    { label: '30 ngày', value: '30d' },
    { label: '90 ngày', value: '90d' }
  ]

  const trendStrings = computed<string[]>(() => trendMap[trendRange.value])

  function handleSearchClick() {
    message.success('Đã áp dụng bộ lọc')
  }

  return {
    // filters
    selectedCategory,
    selectedStatus,
    selectedRange,
    selectedChannel,
    categoryOptions,
    statusOptions,
    rangeOptions,
    channelOptions,
    // overview
    overviewText,
    // charts
    pieOptions,
    lineOptions,
    // table
    columns,
    pagedData,
    paginationConfig,
    // trends
    trendRange,
    trendRangeOptions,
    trendStrings,
    // actions
    handleSearchClick
  }
}


