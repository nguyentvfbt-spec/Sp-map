<template>
  <a-layout class="main-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      :trigger="null"
      collapsible
      theme="light"
      class="layout-sider"
      :width="240"
    >
      <div class="logo">
        <transition name="fade">
          <h2 v-if="!collapsed" class="logo-text">Vue App</h2>
          <h2 v-else class="logo-text-mini">V</h2>
        </transition>
      </div>
      <div class="sider-trigger" @click="toggleCollapse">
        <menu-unfold-outlined v-if="collapsed" class="trigger-icon" />
        <menu-fold-outlined v-else class="trigger-icon" />
      </div>
      <div class="menu-wrapper">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          theme="light"
          :items="menuItems"
          @click="handleMenuClick"
          class="sidebar-menu"
        />
      </div>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="layout-header" :style="{ marginLeft: collapsed ? '80px' : '240px' }">
        <div class="header-left">
          <span class="header-title">Microservice Vue App</span>
        </div>
        <div class="header-right">
          <a-input-search
            v-model:value="searchValue"
            placeholder="Tìm kiếm..."
            style="width: 250px"
            class="header-search"
            @search="handleSearch"
          />
          <a-badge :count="notificationCount" :offset="[-5, 5]">
            <a-button type="text" class="header-icon-btn" @click="showNotifications">
              <bell-outlined class="icon" />
            </a-button>
          </a-badge>
          <a-button type="text" class="header-icon-btn" @click="toggleTheme" :title="appStore.theme === 'dark' ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'">
            <setting-outlined class="icon" />
          </a-button>
          <a-dropdown :trigger="['click']" placement="bottomRight">
            <a-button type="text" class="user-menu-btn">
              <a-avatar :size="32" :src="authStore.user?.avatar" class="user-avatar">
                {{ authStore.user?.name?.charAt(0) }}
              </a-avatar>
              <span class="user-name">{{ authStore.user?.name || 'User' }}</span>
              <down-outlined class="dropdown-icon" />
            </a-button>
            <template #overlay>
              <a-menu class="user-dropdown-menu">
                <a-menu-item key="profile" @click="handleProfile">
                  <user-outlined />
                  <span>Hồ sơ cá nhân</span>
                </a-menu-item>
                <a-menu-item key="settings" @click="handleSettings">
                  <setting-outlined />
                  <span>Cài đặt</span>
                </a-menu-item>
                <a-menu-divider />
                <a-menu-item key="logout" @click="handleLogout">
                  <logout-outlined />
                  <span>Đăng xuất</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </a-layout-header>
      <a-layout-content class="layout-content" :style="{ marginLeft: collapsed ? '80px' : '240px' }">
        <router-view v-slot="{ Component }">
          <transition name="fade-slide" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </a-layout-content>
    </a-layout>

    <!-- Notification Drawer -->
    <a-drawer
      v-model:open="notificationDrawerVisible"
      title="Thông báo"
      placement="right"
      :width="360"
    >
      <a-list :data-source="notifications" :loading="notificationLoading">
        <template #renderItem="{ item }">
          <a-list-item class="notification-item">
            <a-list-item-meta>
              <template #avatar>
                <a-avatar :style="{ backgroundColor: item.color }">
                  <component :is="item.icon" />
                </a-avatar>
              </template>
              <template #title>
                <span>{{ item.title }}</span>
              </template>
              <template #description>
                <span>{{ item.description }}</span>
                <div class="notification-time">{{ item.time }}</div>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>
      </a-list>
      <template #extra>
        <a-button type="link" @click="markAllAsRead">Đánh dấu đã đọc</a-button>
      </template>
    </a-drawer>
  </a-layout>
</template>

<script setup lang="ts">
import { ref, watch, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MenuOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  DownOutlined,
  BellOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined
} from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useAuthStore } from '@/store/auth'
import { useAppStore } from '@/store'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const appStore = useAppStore()
const collapsed = ref(false)
const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])
const searchValue = ref('')
const notificationDrawerVisible = ref(false)
const notificationLoading = ref(false)
const notificationCount = ref(5)

interface Notification {
  id: string
  title: string
  description: string
  time: string
  color: string
  icon: any
  read: boolean
}

const notifications = ref<Notification[]>([
  {
    id: '1',
    title: 'Đơn hàng mới',
    description: 'Bạn có 3 đơn hàng mới cần xử lý',
    time: '5 phút trước',
    color: '#1890ff',
    icon: CheckCircleOutlined,
    read: false
  },
  {
    id: '2',
    title: 'Cập nhật hệ thống',
    description: 'Hệ thống đã được cập nhật phiên bản mới',
    time: '1 giờ trước',
    color: '#52c41a',
    icon: InfoCircleOutlined,
    read: false
  },
  {
    id: '3',
    title: 'Cảnh báo bảo mật',
    description: 'Phát hiện đăng nhập từ thiết bị mới',
    time: '2 giờ trước',
    color: '#faad14',
    icon: WarningOutlined,
    read: false
  },
  {
    id: '4',
    title: 'Thông báo thanh toán',
    description: 'Thanh toán đơn hàng #1234 đã thành công',
    time: '3 giờ trước',
    color: '#52c41a',
    icon: CheckCircleOutlined,
    read: false
  },
  {
    id: '5',
    title: 'Báo cáo tháng',
    description: 'Báo cáo tháng 12 đã sẵn sàng',
    time: '1 ngày trước',
    color: '#1890ff',
    icon: InfoCircleOutlined,
    read: false
  }
])

const menuItems: MenuProps['items'] = [
  // {
  //   key: '/dashboard',
  //   icon: () => h(DashboardOutlined),
  //   label: 'Dashboard',
  //   title: 'Dashboard'
  // },
  // {
  //   key: 'menu',
  //   icon: () => h(MenuOutlined),
  //   label: 'Menu',
  //   title: 'Menu',
  //   children: [
  //     {
  //       key: '/menu/menu1',
  //       label: 'Menu 1',
  //       title: 'Menu 1'
  //     },
  //     {
  //       key: '/menu/menu2',
  //       label: 'Menu 2',
  //       title: 'Menu 2'
  //     }
  //   ]
  // },
  {
    key: '/new-page',
    icon: () => h(MenuOutlined),
    label: 'Trang mới',
    title: 'Trang mới'
  }
]

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
}

const handleMenuClick: MenuProps['onClick'] = (e) => {
  if (e.key && typeof e.key === 'string' && e.key.startsWith('/')) {
    router.push(e.key)
  }
}

const handleSearch = (value: string) => {
  if (value) {
    message.info(`Đang tìm kiếm: ${value}`)
  }
}

const showNotifications = () => {
  notificationDrawerVisible.value = true
}

const markAllAsRead = () => {
  notifications.value.forEach((n) => (n.read = true))
  notificationCount.value = 0
  message.success('Đã đánh dấu tất cả là đã đọc')
}

const toggleTheme = () => {
  const newTheme = appStore.theme === 'light' ? 'dark' : 'light'
  appStore.setTheme(newTheme)
  message.success(`Đã chuyển sang chế độ ${newTheme === 'dark' ? 'tối' : 'sáng'}`)
}

const handleProfile = () => {
  message.info('Mở trang hồ sơ')
}

const handleSettings = () => {
  message.info('Mở trang cài đặt')
}

const handleLogout = () => {
  authStore.logout()
  message.success('Đăng xuất thành công')
  router.push('/login')
}

watch(
  () => route.path,
  (path) => {
    selectedKeys.value = [path]
    if (path.startsWith('/menu')) {
      openKeys.value = ['menu']
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.main-layout {
  min-height: 100vh;
  overflow: hidden;
}

.layout-sider {
  box-shadow: 2px 0 8px 0 rgba(29, 35, 41, 0.05);
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  overflow: visible;
  z-index: 100;
  height: 100vh;

  :deep(.ant-layout-sider-children) {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
    width: 100%;
  }
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
  padding: 0 16px;

  .logo-text {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #1890ff;
    white-space: nowrap;
  }

  .logo-text-mini {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
    color: #1890ff;
  }
}

.menu-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 60px;
  width: 100%;
  max-width: 100%;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 3px;

    &:hover {
      background: #a8a8a8;
    }
  }
}

.sidebar-menu {
  border-right: none;

  :deep(.ant-menu-item) {
    margin: 4px 12px;
    border-radius: 6px;
    height: 42px;
    line-height: 42px;
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding-inline: 12px 36px; // chừa không gian cố định bên phải để căn đều theo cấp
    transition: background-color 0.2s;

    &:hover {
      background: #e6f7ff;
    }

    &.ant-menu-item-selected {
      background: #e6f7ff;
      color: #1890ff;
      font-weight: 600;
    }

    .ant-menu-item-icon,
    .anticon {
      display: inline-flex;
      align-items: center;
      font-size: 16px;
    }

    .ant-menu-title-content {
      display: inline-flex;
      align-items: center;
      line-height: 1;
      flex: 1;
    }
  }

  :deep(.ant-menu-submenu) {
    margin: 4px 8px;

    .ant-menu-submenu-title {
      border-radius: 6px;
      height: 42px;
      line-height: 42px;
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding-inline: 12px 36px;
      transition: background-color 0.2s;

      &:hover {
        background: #e6f7ff;
      }
    }

    // Đồng bộ khoảng lùi cho cấp con
    .ant-menu-sub {
      .ant-menu-item,
      .ant-menu-submenu-title {
        padding-left: 32px;
      }
    }

    // Đặt vị trí icon mũi tên ở mép phải cố định
    .ant-menu-submenu-expand-icon,
    .ant-menu-submenu-arrow {
      right: 12px;
    }
  }
}

.sider-trigger {
  position: absolute;
  top: 15%;
  right: -18px;
  transform: translateY(-15%);
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;

  .trigger-icon {
    font-size: 16px;
    color: #434343;
    transition: all 0.3s;
  }

  &:hover {
    background: #e6f7ff;
    box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
    right: -20px;

    .trigger-icon {
      color: #1890ff;
    }
  }
}

.layout-header {
  background: #fff;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 99;
  height: 64px;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .header-left {
    display: flex;
    align-items: center;
    gap: 24px;

    .header-title {
      font-size: 18px;
      font-weight: 600;
      color: #262626;
      white-space: nowrap;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .header-search {
    :deep(.ant-input-search-button) {
      border-radius: 0 4px 4px 0;
    }
  }

  .header-icon-btn {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      transition: all 0.3s;

      .icon {
        font-size: 18px;
        color: #595959;
        transition: all 0.3s;
      }

      &:hover {
        background: #f5f5f5;

        .icon {
          color: #1890ff;
          transform: scale(1.1);
        }
      }
    }

  .user-menu-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #262626;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 8px;
    transition: all 0.3s;
    height: auto;

    .user-avatar {
      transition: all 0.3s;
    }

    .user-name {
      white-space: nowrap;
    }

    .dropdown-icon {
      font-size: 12px;
      transition: all 0.3s;
    }

    &:hover {
      background: #f5f5f5;
      color: #1890ff;

      .user-avatar {
        transform: scale(1.1);
      }

      .dropdown-icon {
        transform: translateY(2px);
      }
    }
  }
}

.user-dropdown-menu {
  min-width: 180px;

  :deep(.ant-menu-item) {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;

    &:hover {
      background: #e6f7ff;
      transform: translateX(4px);
    }
  }
}

.layout-content {
  padding: 24px;
  background: #f0f2f5;
  height: calc(100vh - 64px);
  overflow: auto;
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.notification-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s;

  &:hover {
    background: #fafafa;
    padding-left: 8px;
  }

  .notification-time {
    font-size: 12px;
    color: #8c8c8c;
    margin-top: 4px;
  }
}

// Animations
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active {
  transition: all 0.3s ease-out;
}

.fade-slide-leave-active {
  transition: all 0.3s ease-in;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
