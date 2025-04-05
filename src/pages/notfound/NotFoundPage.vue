<template>
  <v-app>
    <div class="d-flex align-center justify-center fill-height">
      <v-card class="text-center pa-6" max-width="500">
        <v-card-title class="text-h4 mb-4">Página não encontrada</v-card-title>

        <v-img src="@/assets/logo.svg" height="120" class="mx-auto mb-4" contain></v-img>

        <v-card-text class="text-body-1 mb-4">
          <p>Oops! A página que você está procurando não existe.</p>
          <p class="mt-2">Verifique se o endereço está correto ou retorne à página inicial.</p>
        </v-card-text>

        <v-card-actions class="justify-center">
          <v-btn color="primary" variant="elevated" size="large" :to="{ path: '/' }" class="px-6">
            Voltar para o início
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-app>
</template>

<script setup lang="ts">
// Not Found Page (404)
</script>
