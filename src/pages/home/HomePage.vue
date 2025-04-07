<script setup lang="ts">
import { DefaultTemplate } from '@/template'
</script>

<template>
  <DefaultTemplate>
    <template #default>
      <div class="home">
        <v-img src="@/assets/logo.svg" max-width="150" />
      </div>
    </template>
  </DefaultTemplate>
</template>

<style scoped>
.dashboard {
  max-width: 600px;
  margin: auto;
}

.dashboard svg {
  width: 100%;
}
</style>

