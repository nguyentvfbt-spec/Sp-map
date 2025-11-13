<template>
  <div class="trend-simple-list">
    <div
      v-for="(name, idx) in items"
      :key="idx"
      class="trend-row"
    >
      <span class="dot"></span>
      <span class="text">{{ name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: string[]
}>()
</script>

<style scoped lang="scss">
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
</style>


