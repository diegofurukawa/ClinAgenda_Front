<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { PatientForm } from '@/interfaces/patient'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'
import { vMaska } from 'maska/vue'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
import {
//   clearMask,
//   dateFormat,
//   DateFormatEnum,
    dateMask,
    documentNumberMask,
    phoneNumberMask
} from '@/utils'


const filterStatusId = ref<IStatus['id'] | null>(null)
const isLoadingFilter = ref<boolean>(false)
const statusItems = ref<IStatus[]>([])

const toastStore = useToastStore()
const route = useRoute()

const isLoadingForm = ref<boolean>(false)

const id = route.params.id
const pageMode = id ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT


const loadFilters = async () => {
  isLoadingFilter.value = true

  try {
    const statusResponse = await request<undefined, GetStatusListResponse>({
      method: 'GET',
      endpoint: 'status/list'
    })

    if (statusResponse.isError) return

    statusItems.value = statusResponse.data.items
  } catch (e) {
    console.error('Erro ao buscar items do filtro', e)
  }

  isLoadingFilter.value = false
}

onMounted(() => {
  loadFilters()
})

const form = ref<PatientForm>({
  name: ''
  ,phoneNumber: ''
  ,documentNumber: ''
  ,birthDate: ''
  ,statusId: 13
})

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar patient' : 'Cadastrar novo patient'
})

const submitForm = async () => {
  isLoadingForm.value = true
  const response = await request<PatientForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'patient/insert' : `patient/update/${id}`,
    body: form.value
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Especialidade ${pageMode == PageMode.PAGE_INSERT ? 'criada' : 'alterada'} com sucesso!`
  })

  router.push({ name: 'patient-list' })

  isLoadingForm.value = false
}

const loadForm = async () => {
  if (pageMode === PageMode.PAGE_INSERT) return

  isLoadingForm.value = true
  const patientFormResponse = await request<undefined, PatientForm>({
    method: 'GET',
    endpoint: `patient/update/${id}`
  })

  if (patientFormResponse?.isError) return

  form.value = patientFormResponse.data
  isLoadingForm.value = false
}

onMounted(() => {
  loadForm()
})
</script>

<template>
  <default-template>
    <template #title>
      {{ pageTitle }}
    </template>

    <template #action>
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'patient-list' }"> Cancelar </v-btn>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="12">
          <v-text-field v-model.trim="form.name" label="Nome" hide-details />
        </v-col>
    </v-row>


    <v-row>
        <v-col cols="4">
          <v-text-field 
          v-model.trim="form.phoneNumber"
          v-maska="phoneNumberMask"
          label="Telefone" 
          hide-details />
        </v-col>

        <v-col cols="4">
          <v-text-field 
            v-model.trim="form.documentNumber"
            v-maska="documentNumberMask"
            label="Documento" 
            hide-details />
        </v-col>
    </v-row>
    <v-row>
        <v-col cols="4">
          <v-text-field 
            v-model.trim="form.birthDate" 
            v-maska="dateMask"
            label="Nascimento" 
            hide-details />
        </v-col>

        <v-col cols="4">
            <v-select
                v-model="filterStatusId"
                label="Status"
                :loading="isLoadingFilter"
                :items="statusItems"
                item-value="id"
                item-title="name"
                clearable
                hide-details
              />
        </v-col>
    </v-row>
    </v-form>
  </default-template>
</template>
