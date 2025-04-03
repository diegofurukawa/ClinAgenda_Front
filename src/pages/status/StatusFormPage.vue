<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="8" lg="6" class="mx-auto">
        <v-card>
          <v-card-title class="text-h5">
            {{ isEditMode ? 'Editar Status' : 'Novo Status' }}
          </v-card-title>

          <v-card-text>
            <v-form ref="form" @submit.prevent="submitForm">
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.statusName"
                    label="Nome do Status"
                    required
                    :rules="[(v) => !!v || 'Nome é obrigatório']"
                  />
                </v-col>

                <v-col cols="12">
                  <v-select
                    v-model="formData.statusType"
                    :items="statusStore.statusTypes"
                    item-title="description"
                    item-value="id"
                    label="Tipo de Status"
                    required
                    :rules="[(v) => !!v || 'Tipo de Status é obrigatório']"
                  />
                </v-col>

                <v-col cols="12">
                  <v-switch v-model="formData.lActive" label="Ativo" color="primary" hide-details />
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="grey-darken-1"
              variant="text"
              :to="{ name: 'status-list' }"
              :disabled="statusStore.loading"
            >
              Cancelar
            </v-btn>
            <v-btn
              color="primary"
              variant="elevated"
              :loading="statusStore.loading"
              :disabled="!isFormValid"
              @click="submitForm"
            >
              {{ isEditMode ? 'Atualizar' : 'Criar' }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStatusStore, useToastStore } from '@/stores'

// Get route and router
const route = useRoute()
const router = useRouter()

// Get stores
const statusStore = useStatusStore()
const toastStore = useToastStore()

// Form reference
const form = ref<any>(null)

// Check if we're in edit mode (have an ID parameter)
const isEditMode = computed(() => !!route.params.id)

// Form data
const formData = ref({
  statusName: '',
  statusType: '',
  lActive: true
})

// Form validation
const isFormValid = computed(() => {
  return !!formData.value.statusName && !!formData.value.statusType
})

// Initialize data - either empty form or load existing status
onMounted(async () => {
  // Load status types first
  await statusStore.fetchStatusTypes()

  if (isEditMode.value) {
    const statusId = parseInt(route.params.id as string)
    await loadStatus(statusId)
  }
})

// Load status data for edit
const loadStatus = async (id: number) => {
  const success = await statusStore.fetchStatusById(id)

  if (success && statusStore.selectedStatus) {
    formData.value = {
      statusName: statusStore.selectedStatus.statusName,
      statusType: statusStore.selectedStatus.statusType,
      lActive: statusStore.selectedStatus.lActive
    }
  } else {
    toastStore.setToast({
      type: 'error',
      text: 'Não foi possível carregar os dados do status.'
    })
    router.push({ name: 'status-list' })
  }
}

// Submit form
const submitForm = async () => {
  // Check form validity
  const formValid = await form.value?.validate()

  if (!formValid?.valid) {
    toastStore.setToast({
      type: 'error',
      text: 'Por favor, preencha todos os campos obrigatórios.'
    })
    return
  }

  // Create or update based on mode
  let success = false

  if (isEditMode.value) {
    const statusId = parseInt(route.params.id as string)
    success = await statusStore.updateStatus(statusId, {
      statusName: formData.value.statusName,
      statusType: formData.value.statusType,
      lActive: formData.value.lActive
    })
  } else {
    success = await statusStore.createStatus({
      statusName: formData.value.statusName,
      statusType: formData.value.statusType,
      lActive: formData.value.lActive
    })
  }

  // Handle response
  if (success) {
    toastStore.setToast({
      type: 'success',
      text: isEditMode.value ? 'Status atualizado com sucesso!' : 'Status criado com sucesso!'
    })
    router.push({ name: 'status-list' })
  } else {
    toastStore.setToast({
      type: 'error',
      text: isEditMode.value ? 'Erro ao atualizar o status.' : 'Erro ao criar o status.'
    })
  }
}
</script>
