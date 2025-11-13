<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-header">
          <h1 class="login-title">Đăng nhập</h1>
          <p class="login-subtitle">Chào mừng trở lại! Vui lòng đăng nhập vào tài khoản của bạn.</p>
        </div>

        <a-form
          :model="loginForm"
          :rules="rules"
          @finish="handleLogin"
          @finishFailed="handleLoginFailed"
          class="login-form"
          ref="formRef"
        >
          <a-form-item name="email">
            <a-input
              v-model:value="loginForm.email"
              size="large"
              placeholder="Email"
              :prefix="h(UserOutlined)"
              :disabled="loading"
            />
          </a-form-item>

          <a-form-item name="password">
            <a-input-password
              v-model:value="loginForm.password"
              size="large"
              placeholder="Mật khẩu"
              :prefix="h(LockOutlined)"
              :disabled="loading"
              @pressEnter="handleLogin"
            />
          </a-form-item>

          <a-form-item>
            <div class="login-options">
              <a-checkbox v-model:checked="rememberMe">Ghi nhớ đăng nhập</a-checkbox>
              <a-button type="link" class="forgot-password">Quên mật khẩu?</a-button>
            </div>
          </a-form-item>

          <a-form-item>
            <a-button
              type="primary"
              html-type="submit"
              size="large"
              block
              :loading="loading"
              class="login-button"
            >
              {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập' }}
            </a-button>
          </a-form-item>
        </a-form>

        <a-divider>Hoặc</a-divider>

        <div class="social-login">
          <a-button block size="large" class="social-button" @click="handleSocialLogin('google')">
            Đăng nhập với Google
          </a-button>
          <a-button block size="large" class="social-button" style="margin-top: 12px" @click="handleSocialLogin('github')">
            Đăng nhập với GitHub
          </a-button>
        </div>

        <div class="login-footer">
          <span>Chưa có tài khoản?</span>
          <a-button type="link" class="register-link">Đăng ký ngay</a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import type { FormInstance } from 'ant-design-vue'
import { useAuthStore } from '@/store/auth'

const router = useRouter()
const authStore = useAuthStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  try {
    loading.value = true

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Validate credentials (demo - in real app, call API)
    if (loginForm.email && loginForm.password.length >= 6) {
      // Login successful
      const user = {
        name: loginForm.email.split('@')[0] || 'User',
        email: loginForm.email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginForm.email}`,
        role: 'User'
      }

      authStore.login(user)

      if (rememberMe.value) {
        localStorage.setItem('rememberMe', 'true')
        localStorage.setItem('userEmail', loginForm.email)
      } else {
        localStorage.removeItem('rememberMe')
        localStorage.removeItem('userEmail')
      }

      message.success('Đăng nhập thành công!')
      
      // Redirect to original page or dashboard
      const redirect = router.currentRoute.value.query.redirect as string
      router.push(redirect || '/dashboard')
    } else {
      message.error('Email hoặc mật khẩu không đúng!')
    }
  } catch (error) {
    message.error('Đăng nhập thất bại. Vui lòng thử lại!')
    console.error('Login error:', error)
  } finally {
    loading.value = false
  }
}

const handleLoginFailed = (errorInfo: any) => {
  console.log('Validation failed:', errorInfo)
  message.warning('Vui lòng kiểm tra lại thông tin đăng nhập!')
}

const handleSocialLogin = (provider: 'google' | 'github') => {
  message.info(`Đăng nhập với ${provider === 'google' ? 'Google' : 'GitHub'} đang được phát triển`)
  // TODO: Implement social login
}

// Check if user was remembered
const checkRememberedUser = () => {
  const remembered = localStorage.getItem('rememberMe')
  if (remembered === 'true') {
    const savedEmail = localStorage.getItem('userEmail')
    if (savedEmail) {
      loginForm.email = savedEmail
      rememberMe.value = true
    }
  }
}

// Initialize
checkRememberedUser()
</script>

<style scoped lang="scss">
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
    animation: pulse 20s infinite;
  }

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      opacity: 0.5;
    }
    50% {
      transform: scale(1.1);
      opacity: 0.8;
    }
  }
}

.login-wrapper {
  width: 100%;
  max-width: 440px;
  position: relative;
  z-index: 1;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.login-box {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 32px;

  .login-title {
    font-size: 28px;
    font-weight: 700;
    color: #262626;
    margin: 0 0 8px 0;
  }

  .login-subtitle {
    color: #8c8c8c;
    font-size: 14px;
    margin: 0;
  }
}

.login-form {
  .login-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .forgot-password {
    padding: 0;
    height: auto;
  }

  .login-button {
    height: 48px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
    margin-top: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.4);
    }
  }
}

.social-login {
  margin-top: 24px;

  .social-button {
    height: 48px;
    border-radius: 8px;
    transition: all 0.3s;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }
}

.login-footer {
  text-align: center;
  margin-top: 24px;
  color: #8c8c8c;
  font-size: 14px;

  .register-link {
      padding: 0;
      height: auto;
      font-weight: 600;
    }
}

:deep(.ant-input-affix-wrapper) {
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    border-color: #40a9ff;
  }

  &:focus,
  &.ant-input-affix-wrapper-focused {
    border-color: #1890ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }
}

:deep(.ant-input-password) {
  border-radius: 8px;
}
</style>
