<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { PatientForm } from '@/interfaces/specialty'
import type { ISpecialty, GetSpecialtyListResponse } from '@/interfaces/specialty'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'
import { activeFieldOptions } from '@/enum'

const toastStore = useToastStore()
const route = useRoute()
const isLoadingForm = ref<boolean>(false)
const specialtyId = route.params.id
const pageMode = specialtyId ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const form = ref<SpecialtyForm>({
  specialtyName: '',
  nScheduleDuration: 0,
  lActive: true
})

const specialtyItems = ref<ISpecialty[]>([])

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar Especialidade' : 'Cadastrar Novo Especialidade'
})

const submitForm = async () => {
  isLoadingForm.value = true

  const body = {
    ...form.value,
    specialtyName: form.value.specialtyName,
    nScheduleDuration: form.value.nScheduleDuration,
    lActive: form.value.lActive
  }

  const response = await request<PatientForm, null>({
    method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
    endpoint:
      pageMode == PageMode.PAGE_INSERT ? 'specialty/insert' : `specialty/update/${specialtyId}`,
    body
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: `Specialty ${pageMode == PageMode.PAGE_INSERT ? 'criado' : 'alterado'} com sucesso!`
  })

  router.push({ name: 'specialty-list' })
  isLoadingForm.value = false
}

const loadForm = async () => {
  isLoadingForm.value = true

  const specialtyRequest = request<undefined, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list'
  })

  const requests: Promise<any>[] = [specialtyRequest]

  if (pageMode === PageMode.PAGE_UPDATE) {
    const specialtyFormRequest = request<undefined, SpecialtyForm>({
      method: 'GET',
      endpoint: `specialty/listById/${specialtyId}`
    })

    requests.push(specialtyFormRequest)
  }

  const [specialtyResponse, specialtyFormResponse] = await Promise.all(requests)

  if (specialtyResponse.isError || specialtyFormResponse?.isError) return

  specialtyItems.value = specialtyResponse.data.items

  if (pageMode === PageMode.PAGE_UPDATE) {
    form.value = specialtyFormResponse.data
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
      <v-btn :prepend-icon="mdiCancel" :to="{ name: 'specialty-list' }"> Cancelar </v-btn>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" @click.prevent="submitForm">
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="5">
          <v-text-field v-model.trim="form.specialtyName" label="Nome" hide-details />
        </v-col>
        <v-col cols="2">
          <v-text-field v-model.trim="form.nScheduleDuration" label="Duração" hide-details />
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

