<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { DoctorForm } from '@/interfaces/doctor'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'

const toastStore = useToastStore()
const route = useRoute()

const isLoadingForm = ref<boolean>(false)

const id = route.params.id
const pageMode = id ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const form = ref<DoctorForm>({
  name: '',
  specialtyId: '',
  statusId: ''
})

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar doctor' : 'Cadastrar novo doctor'
})

const submitForm = async () => {
  isLoadingForm.value = true
  const response = await request<DoctorForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint: pageMode == PageMode.PAGE_INSERT ? 'doctor/insert' : `doctor/update/${id}`,
    body: form.value
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Doutor ${pageMode == PageMode.PAGE_INSERT ? 'criada' : 'alterada'} com sucesso!`
  })

  router.push({ name: 'doctor-list' })

  isLoadingForm.value = false
}

const loadForm = async () => {
  if (pageMode === PageMode.PAGE_INSERT) return

  isLoadingForm.value = true
  const doctorFormResponse = await request<undefined, DoctorForm>({
    method: 'GET',
    endpoint: `doctor/update/${id}`
  })

  if (doctorFormResponse?.isError) return

  form.value = doctorFormResponse.data
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
        <v-col cols="6">
          <v-text-field v-model.trim="form.name" label="Nome" hide-details />
        </v-col>

        <v-col cols="6">
          <v-text-field v-model.trim="form.specialtyId" label="Especialidade" hide-details />
        </v-col>

        <v-col cols="6">
          <v-text-field v-model.trim="form.statusId" label="Status" hide-details />
        </v-col>
      </v-row>
    </v-form>
  </DefaultTemplate>
</template>

