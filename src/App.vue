<template>
  <a-config-provider :theme="themeConfig">
    <router-view />
  </a-config-provider>
</template>

<script setup lang="ts">
// Ant Design Vue theme customization
const themeConfig = {
  token: {
    colorPrimary: '#1890ff',
    borderRadius: 4
  }
}
</script>

<style scoped></style>

