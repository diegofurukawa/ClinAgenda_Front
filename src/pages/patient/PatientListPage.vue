<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiSquareEditOutline, mdiTrashCan } from '@mdi/js'
import type { IPatient, GetPatientListRequest, GetPatientListResponse } from '@/interfaces/patient'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import { vMaska } from 'maska/vue'
import {
  clearMask,
  // dateFormat,
  // DateFormatEnum,
  documentNumberMask,
  maskDocumentNumber,
  maskPhoneNumber
} from '@/utils'
import { ActiveField, activeFieldOptions } from '@/enum'

const toastStore = useToastStore()
const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)
const filterName = ref<GetPatientListRequest['patientName']>('')
const filterDocumentNumber = ref<GetPatientListRequest['documentNumber']>('')
const filterStatusId = ref<IStatus['statusId'] | null>(null)
const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IPatient[]>([])
// Inicializando apenas com Ativos
const filterActive = ref<string>(ActiveField.ATIVO)

const headers = [
  {
    title: 'ID',
    key: 'patientId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'patientName', sortable: false },
  { title: 'CPF', key: 'documentNumber', sortable: false },
  { title: 'Telefone', key: 'phoneNumber', sortable: false },
  { title: 'Data Nascimento', key: 'dBirthDate', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
  { title: 'Ativo', key: 'lActive', sortable: false },
  {
    title: 'Ações',
    key: 'actions',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  }
]

const handleDataTableUpdate = async ({ page: tablePage, itemsPerPage: tableItemsPerPage }: any) => {
  page.value = tablePage
  itemsPerPage.value = tableItemsPerPage
  loadDataTable()
}

const loadDataTable = async () => {
  try {
    isLoadingList.value = true

    // Log para debug
    console.log('Enviando filtro active:', filterActive.value)

    let activeBoolean = undefined
    if (filterActive.value === ActiveField.ATIVO) {
      activeBoolean = true
    } else if (filterActive.value === ActiveField.INATIVO) {
      activeBoolean = false
    }

    // Log para debug
    console.log('Valor convertido para API:', activeBoolean)

    const { isError, data } = await request<GetPatientListRequest, GetPatientListResponse>({
      method: 'GET',
      endpoint: 'patient/list',
      body: {
        itemsPerPage: itemsPerPage.value,
        page: page.value,
        patientName: filterName.value,
        documentNumber: clearMask(filterDocumentNumber.value),
        statusId: filterStatusId.value,
        lActive: activeBoolean
      }
    })

    if (isError) return

    items.value = data.items
    total.value = data.total
    isLoadingList.value = false
  } catch (e) {
    console.error('Erro ao buscar item da lista', e)
  }
}
// =================================================================
// COMENTA
// =================================================================
const statusItems = ref<IStatus[]>([])

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

const deleteListItem = async (item: IPatient) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.patientName}?`)

  if (!shouldDelete) return

  try {
    const response = await request<null, null>({
      method: 'DELETE',
      endpoint: `patient/${item.patientId}`
    })

    if (response.isError) return

    toastStore.setToast({
      type: 'success',
      text: 'Paciente deletado com sucesso!'
    })

    loadDataTable()
  } catch (e) {
    console.error('Falha ao deletar item da lista', e)
  }
}

onMounted(() => {
  loadFilters()
})
</script>

<template>
  <DefaultTemplate>
    <template #title> Lista de Pacientes </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'patient-insert' }">
        Adicionar paciente
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-text-field v-model.trim="filterName" label="Nome" hide-details />
            </v-col>
            <v-col>
              <v-text-field
                v-model.trim="filterDocumentNumber"
                v-maska="documentNumberMask"
                label="CPF"
                hide-details
              />
            </v-col>
            <v-col>
              <v-select
                v-model="filterStatusId"
                label="Status"
                :loading="isLoadingFilter"
                :items="statusItems"
                item-value="statusId"
                item-title="statusName"
                clearable
                hide-details
              />
            </v-col>

            <v-col>
              <div>
                <!-- Teste básico de v-select normal -->
                <v-select
                  v-model="filterActive"
                  label="Ativo"
                  :items="activeFieldOptions"
                  item-value="value"
                  item-title="title"
                  hide-details
                  variant="outlined"
                />
              </div>
            </v-col>

            <v-col cols="auto" class="d-flex align-center">
              <v-btn color="primary" type="submit">Filtrar</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-sheet>
      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items-length="total"
        :items="items"
        :loading="isLoadingList"
        item-value="patientId"
        @update:options="handleDataTableUpdate"
      >
        <template #[`item.status`]="{ item }">
          <v-chip>
            {{ item.status.statusName }}
          </v-chip>
        </template>
        <template #[`item.documentNumber`]="{ item }">
          <div>{{ maskDocumentNumber(item.documentNumber) }}</div>
        </template>
        <template #[`item.phoneNumber`]="{ item }">
          <div>{{ maskPhoneNumber(item.phoneNumber) }}</div>
        </template>
        <template #[`item.dBirthDate`]="{ item }">
          <div>{{ item.dBirthDate }}</div>
          <!-- <div>{{ dateFormat(item.dBirthDate, DateFormatEnum.FullDate.value) }}</div> -->
        </template>

        <template #[`item.lActive`]="{ item }">
          <v-chip :color="item.lActive ? 'success' : 'error'" size="small">
            {{ item.lActive ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar paciente" location="left">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiTrashCan"
                size="small"
                color="error"
                class="mr-2"
                @click="deleteListItem(item)"
              />
            </template>
          </v-tooltip>
          <v-tooltip text="Editar paciente" location="left">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiSquareEditOutline"
                size="small"
                color="primary"
                :to="{ name: 'patient-update', params: { id: item.patientId } }"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </template>
  </DefaultTemplate>
</template>

