<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { IStatus, StatusForm, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'
import { activeFieldOptions, StatusTypeOptions, convertToBoolean } from '@/enum'

const toastStore = useToastStore()
const route = useRoute()
const isLoadingForm = ref<boolean>(false)
const statusId = route.params.id
const pageMode = statusId ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const form = ref<StatusForm>({
  statusName: '',
  statusType: '',
  lActive: true
})

const statusItems = ref<IStatus[]>([])

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar Status' : 'Cadastrar novo Status'
})

const submitForm = async () => {
  isLoadingForm.value = true

  const body = {
    ...form.value,
    statusName: form.value.statusName,
    statusType: form.value.statusType,
    lActive: convertToBoolean(form.value.lActive)
  }

  console.log(body)

  const response = await request<StatusForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'status/insert' : `status/update/${statusId}`,
    body
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Status ${pageMode == PageMode.PAGE_INSERT ? 'criado' : 'alterado'} com sucesso!`
  })

  router.push({ name: 'status-list' })
  isLoadingForm.value = false
}

const loadForm = async () => {
  isLoadingForm.value = true

  const statusRequest = request<undefined, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list'
  })

  const requests: Promise<any>[] = [statusRequest]

  if (pageMode === PageMode.PAGE_UPDATE) {
    const statusFormRequest = request<undefined, StatusForm>({
      method: 'GET',
      endpoint: `status/listById/${statusId}`
    })

    requests.push(statusFormRequest)
  }

  const [statusResponse, statusFormResponse] = await Promise.all(requests)

  if (statusResponse.isError || statusFormResponse?.isError) return

  statusItems.value = statusResponse.data.items

  if (pageMode === PageMode.PAGE_UPDATE) {
    form.value = statusFormResponse.data
  }

  isLoadingForm.value = false
}

onMounted(() => {
  loadForm()
})
</script>

<template>
  <DefaultTemplate>
    <template #title>
      {{ pageTitle }}
    </template>

    <template #action>
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'status-list' }"> Cancelar </v-btn>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="5">
          <v-text-field v-model.trim="form.statusName" label="Nome" hide-details />
        </v-col>
        <v-col cols="5">
          <v-select
            v-model="form.statusType"
            label="Tipo"
            :items="StatusTypeOptions"
            item-value="value"
            item-title="title"
            hide-details
            variant="outlined"
          />
        </v-col>

        <v-col cols="2">
          <div>
            <!-- Teste Active v-select normal -->
            <v-select
              v-model="form.lActive"
              label="Ativo"
              :items="activeFieldOptions"
              item-value="value"
              item-title="title"
              hide-details
              variant="outlined"
            />
          </div>
        </v-col>
      </v-row>
    </v-form>
  </DefaultTemplate>
</template>

