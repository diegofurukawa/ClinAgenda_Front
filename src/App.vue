<template>
  <v-app>
    <router-view></router-view>

    <!-- Global Toast Notifications -->
    <ClinicToast />
  </v-app>
</template>

<script setup lang="ts">
import ClinicToast from '@/components/ClinicToast.vue'
</script>

