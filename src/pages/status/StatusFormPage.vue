<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'

import type { StatusForm, IStatusType, GetStatusTypeListResponse } from '@/interfaces/status'

const filterStatusType = ref<IStatusType['statusType'] | null>(null)
const isLoadingFilter = ref<boolean>(false)
const statusTypeItems = ref<IStatusType[]>([])

const toastStore = useToastStore()
const route = useRoute()

const isLoadingForm = ref<boolean>(false)

const id = route.params.id
const pageMode = id ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const loadFilters = async () => {
  isLoadingFilter.value = true

  try {
    const statusTypeResponse = await request<undefined, GetStatusTypeListResponse>({
      method: 'GET',
      endpoint: 'status/types'
    })

    if (statusTypeResponse.isError) return

    statusTypeItems.value = statusTypeResponse.data.items
  } catch (e) {
    console.error('Erro ao buscar items do filtro', e)
  }

  isLoadingFilter.value = false
}

const form = ref<StatusForm>({
  statusName: '',
  statusType: ''
})

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar status' : 'Cadastrar novo status'
})

const submitForm = async () => {
  isLoadingForm.value = true
  const response = await request<StatusForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'status/insert' : `status/update/${id}`,
    body: form.value
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Status ${pageMode == PageMode.PAGE_INSERT ? 'criada' : 'alterada'} com sucesso!`
  })

  router.push({ name: 'status-list' })
  isLoadingForm.value = false
}

const loadForm = async () => {
  if (pageMode === PageMode.PAGE_INSERT) return

  isLoadingForm.value = true
  const statusFormResponse = await request<undefined, StatusForm>({
    method: 'GET',
    endpoint: `status/update/${id}`
  })

  if (statusFormResponse?.isError) return

  form.value = statusFormResponse.data
  isLoadingForm.value = false
}

onMounted(() => {
  loadForm()
  loadFilters()
})
</script>

<template>
  <DefaultTemplate>
    <template #title>
      {{ pageTitle }}
    </template>

    <template #action>
      <!-- Botão Cancelar -->
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'status-list' }"> Cancelar </v-btn>

      <!-- Botão Salvar -->
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model.trim="form.statusName" label="Nome Status" hide-details />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-select
            v-model="filterStatusType"
            label="Tipo"
            :loading="isLoadingFilter"
            :items="statusTypeItems"
            item-value="statusType"
            item-title="statusTypeName"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
    </v-form>
  </DefaultTemplate>
</template>

