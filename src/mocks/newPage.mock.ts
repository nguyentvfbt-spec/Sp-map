export type Option = { label: string; value: string }

export const categoryOptions: Option[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Danh mục A', value: 'A' },
  { label: 'Danh mục B', value: 'B' }
]

export const statusOptions: Option[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hoạt động', value: 'active' },
  { label: 'Ngừng', value: 'inactive' }
]

export const rangeOptions: Option[] = [
  { label: '7 ngày', value: '7d' },
  { label: '30 ngày', value: '30d' },
  { label: '90 ngày', value: '90d' }
]

export const channelOptions: Option[] = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Web', value: 'web' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'POS', value: 'pos' }
]

export interface RowData {
  id: number
  name: string
  status: string
}

export const tableMockData: RowData[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  name: `Bản ghi ${i + 1}`,
  status: i % 2 === 0 ? 'Hoạt động' : 'Ngừng'
}))

export const pieMockData: { value: number; name: string }[] = [
  { value: 40, name: 'Nhóm A' },
  { value: 32, name: 'Nhóm B' },
  { value: 28, name: 'Nhóm C' }
]

export const lineMockSeriesA: number[] = [120, 132, 101, 134, 90, 230, 210]
export const lineMockSeriesB: number[] = [50, 62, 41, 60, 39, 100, 85]

export const trendMap: Record<'7d' | '30d' | '90d', string[]> = {
  '7d': ['Từ khóa A', 'Từ khóa B', 'Sản phẩm C', 'Chiến dịch D', 'Trang E'],
  '30d': ['Chiến dịch Tháng 10', 'Từ khóa Hot', 'Sản phẩm Bán chạy', 'Trang Landing', 'Referral X'],
  '90d': ['Quý IV - Promo', 'Organic Search', 'Social Buzz', 'Email CTR', 'Feature Y']
}


