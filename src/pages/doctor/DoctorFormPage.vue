<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiCancel, mdiPlusCircle } from '@mdi/js'
import type { DoctorForm } from '@/interfaces/doctor'
import type { GetSpecialtyListResponse, ISpecialty } from '@/interfaces/specialty'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useRoute } from 'vue-router'
import { PageMode, activeFieldOptions, convertToBoolean } from '@/enum'
import { useToastStore } from '@/stores'
import router from '@/router'

const toastStore = useToastStore()
const route = useRoute()

const isLoadingForm = ref<boolean>(false)

const doctorId = route.params.id
const pageMode = doctorId ? PageMode.PAGE_UPDATE : PageMode.PAGE_INSERT

const form = ref<DoctorForm>({
  doctorName: '',
  specialty: [],
  statusId: null,
  lActive: true
})

const specialtyItems = ref<ISpecialty[]>([])
const statusItems = ref<IStatus[]>([])

const pageTitle = computed(() => {
  return pageMode === PageMode.PAGE_UPDATE ? 'Editar Profissional' : 'Cadastrar Novo Profissional'
})

// Adicione uma variável computed para verificar se o formulário é válido
const isFormValid = computed(() => {
  // Verificar se há pelo menos uma especialidade selecionada
  return (
    form.value.doctorName &&
    form.value.statusId &&
    // form.value.lActive &&
    form.value.specialty &&
    form.value.specialty.length > 0
  )
})

// Adicione uma variável para mensagens de erro
const formErrors = ref({
  specialty: false
})

// Modifique a função submitForm para incluir validação
const submitForm = async () => {
  try {
    isLoadingForm.value = true

    // Criar uma cópia do formulário para manipulação segura
    const formData = {
      doctorName: form.value.doctorName,
      statusId: form.value.statusId,
      // lActive: form.value.lActive,
      lActive: convertToBoolean(form.value.lActive),
      // Filtrar quaisquer valores inválidos (como 0) do array de especialidades
      specialty: Array.isArray(form.value.specialty)
        ? form.value.specialty.filter((id) => id && id > 0)
        : []
    }

    console.log('Enviando dados do formulário:', formData)

    const response = await request<DoctorForm, null>({
      method: pageMode == PageMode.PAGE_INSERT ? 'POST' : 'PUT',
      endpoint: pageMode == PageMode.PAGE_INSERT ? 'doctor/insert' : `doctor/update/${doctorId}`,
      body: formData
    })

    if (response.isError) {
      toastStore.setToast({
        type: 'error',
        text:
          response.message || 'Erro ao salvar profissional. Verifique os dados e tente novamente.'
      })
      return
    }

    toastStore.setToast({
      type: 'success',
      text: `Profissional ${pageMode == PageMode.PAGE_INSERT ? 'criado' : 'alterado'} com sucesso!`
    })

    router.push({ name: 'doctor-list' })
  } catch (e) {
    console.error('Erro ao salvar formulário', e)
    toastStore.setToast({
      type: 'error',
      text: 'Ocorreu um erro ao processar a requisição.'
    })
  } finally {
    isLoadingForm.value = false
  }
}

// Modifique a função de carregamento de dados para debugar o que está chegando
const loadForm = async () => {
  isLoadingForm.value = true

  const specialtyRequest = request<undefined, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list'
  })

  const statusRequest = request<undefined, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list'
  })

  const requests: Promise<any>[] = [specialtyRequest, statusRequest]

  if (pageMode === PageMode.PAGE_UPDATE) {
    const doctorFormRequest = request<undefined, DoctorForm>({
      method: 'GET',
      endpoint: `doctor/listById/${doctorId}`
    })

    requests.push(doctorFormRequest)
  }

  try {
    const [specialtyResponse, statusResponse, doctorFormResponse] = await Promise.all(requests)

    if (specialtyResponse.isError || statusResponse.isError || doctorFormResponse?.isError) return

    specialtyItems.value = specialtyResponse.data.items
    statusItems.value = statusResponse.data.items

    if (pageMode === PageMode.PAGE_UPDATE && doctorFormResponse) {
      // Log para debugar a estrutura que está vindo da API
      console.log('Doctor data received:', doctorFormResponse.data)

      // Extrai os IDs de especialidade de forma segura
      let specialtyIds = []

      if (doctorFormResponse.data.specialty) {
        if (Array.isArray(doctorFormResponse.data.specialty)) {
          specialtyIds = doctorFormResponse.data.specialty
            .map((spec: { specialtyId: any }) => {
              if (typeof spec === 'number') return spec
              if (typeof spec === 'object' && spec && 'specialtyId' in spec) return spec.specialtyId
              return null
            })
            .filter((doctorId: null) => doctorId !== null)
        }
      }

      console.log('Extracted specialty IDs:', specialtyIds)

      // Atualiza o formulário
      form.value = {
        doctorName: doctorFormResponse.data.doctorName || '',
        statusId: doctorFormResponse.data.statusId || null,
        specialty: specialtyIds,
        lActive: convertToBoolean(doctorFormResponse.data.lActive)
      }

      console.log('Form after update:', form.value)
    }
  } catch (e) {
    console.error('Erro ao buscar dados do formulário', e)
  } finally {
    isLoadingForm.value = false
  }
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
      <v-btn
        color="primary"
        :prepend-icon="mdiPlusCircle"
        :disabled="!isFormValid"
        @click.prevent="submitForm"
      >
        Salvar
      </v-btn>
    </template>

    <v-form :disabled="isLoadingForm" @submit.prevent="submitForm">
      <v-row>
        <v-col cols="6">
          <v-text-field v-model.trim="form.doctorName" label="Nome" hide-details />
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

        <v-col cols="2">
          <div>
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
      <v-row>
        <v-col>
          <v-label>Especialidades</v-label>
          <div v-if="formErrors.specialty" class="text-error mb-2">
            Selecione pelo menos uma especialidade
          </div>
          <div :class="{ 'error--text': formErrors.specialty, 'specialties-container': true }">
            <v-checkbox
              v-for="specialty of specialtyItems"
              :key="specialty.specialtyId"
              v-model="form.specialty"
              :label="specialty.specialtyName"
              :value="specialty.specialtyId"
              :error="formErrors.specialty"
              @change="formErrors.specialty = false"
            />
          </div>
        </v-col>
      </v-row>
    </v-form>
  </DefaultTemplate>
</template>

<style scoped>
.specialties-container {
  border-radius: 4px;
  padding: 8px;
  transition: all 0.2s;
}
.specialties-container.error--text {
  border: 1px solid rgba(var(--v-theme-error), 0.7);
  background-color: rgba(var(--v-theme-error), 0.05);
}
</style>

