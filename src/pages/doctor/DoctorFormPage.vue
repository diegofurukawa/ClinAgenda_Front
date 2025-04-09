<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { DoctorForm } from '@/interfaces/doctor'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'

const toastStore = useToastStore()
const route = useRoute()

const isLoadingForm = ref<boolean>(false)

const doctorId = route.params.id
const pageMode = doctorId ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const form = ref<DoctorForm>({
  doctorName: '',
  specialtyId: 0,
  statusId: null,
  lActive: true
})
const statusItems = ref<IStatus[]>([])

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar Profissional' : 'Cadastrar novo Profissional'
})

const submitForm = async () => {
  isLoadingForm.value = true

  const body = {
    ...form.value,
    specialtyId: form.value.specialtyId
  }

  const response = await request<DoctorForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'doctor/insert' : `doctor/update/${doctorId}`,
    body
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Paciente ${pageMode == PageMode.PAGE_INSERT ? 'criado' : 'alterado'} com sucesso!`
  })

  router.push({ name: 'doctor-list' })
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
    const doctorFormRequest = request<undefined, DoctorForm>({
      method: 'GET',
      endpoint: `doctor/listById/${doctorId}`
    })

    requests.push(doctorFormRequest)
  }

  const [statusResponse, doctorFormResponse] = await Promise.all(requests)

  if (statusResponse.isError || doctorFormResponse?.isError) return

  statusItems.value = statusResponse.data.items

  if (pageMode === PageMode.PAGE_UPDATE) {
    form.value = doctorFormResponse.data
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
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'doctor-list' }"> Cancelar </v-btn>

      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="4">
          <v-text-field v-model.trim="form.doctorName" label="Profissional" hide-details />
        </v-col>
        <v-col cols="2">
          <v-select
            v-model="form.statusId"
            label="Status"
            :loading="isLoadingForm"
            :items="statusItems"
            item-value="statusId"
            item-title="statusName"
            clearable
            hide-details
          />
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="2">
          <v-select
            v-model="form.statusId"
            label="Status"
            :loading="isLoadingForm"
            :items="statusItems"
            item-value="statusId"
            item-title="statusName"
            clearable
            hide-details
          />
        </v-col>
      </v-row>
    </v-form>
  </DefaultTemplate>
</template>

