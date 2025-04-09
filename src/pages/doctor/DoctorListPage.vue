<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiSquareEditOutline, mdiTrashCan } from '@mdi/js'
import type { IDoctor, GetDoctorListRequest, GetDoctorListResponse } from '@/interfaces/doctor'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
import type { ISpecialty, GetSpecialtyListResponse } from '@/interfaces/specialty'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'

const toastStore = useToastStore()

const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)

const filterDoctorName = ref<GetDoctorListRequest['doctorName']>('')
const filterSpecialtyId = ref<GetDoctorListRequest['specialtyId'] | null>(null)
const filterStatusId = ref<GetDoctorListRequest['statusId'] | null>(null)

const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IDoctor[]>([])

const headers = [
  {
    title: 'DoctorId',
    key: 'doctorId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Profissional', key: 'doctorName', sortable: false },
  { title: 'Especialidade(s)', key: 'specialtyName', sortable: false },
  { title: 'Status', key: 'status', sortable: false },
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
    const { isError, data } = await request<GetDoctorListRequest, GetDoctorListResponse>({
      method: 'GET',
      endpoint: 'doctor/list',
      body: {
        itemsPerPage: itemsPerPage.value,
        page: page.value,
        doctorName: filterDoctorName.value,
        specialtyId: filterSpecialtyId.value,
        statusId: filterStatusId.value
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
const specialtyItems = ref<ISpecialty[]>([])

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

  try {
    const specialtyResponse = await request<undefined, GetSpecialtyListResponse>({
      method: 'GET',
      endpoint: 'specialty/list'
    })

    if (specialtyResponse.isError) return

    specialtyItems.value = specialtyResponse.data.items
  } catch (e) {
    console.error('Erro ao buscar items do filtro', e)
  }

  isLoadingFilter.value = false
}

const deleteListItem = async (item: IDoctor) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.doctorName}?`)

  if (!shouldDelete) return

  try {
    const response = await request<null, null>({
      method: 'DELETE',
      endpoint: `doctor/${item.doctorId}`
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
    <template #title> Lista de Profissional </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'doctor-insert' }">
        Adicionar Profissional
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-text-field v-model.trim="filterDoctorName" label="Profissional" hide-details />
            </v-col>
            <v-col>
              <v-select
                v-model="filterSpecialtyId"
                label="Especialidade"
                :loading="isLoadingFilter"
                :items="specialtyItems"
                item-value="specialtyId"
                item-title="specialtyName"
                clearable
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
        item-value="id"
        @update:options="handleDataTableUpdate"
      >
        <template #[`item.status`]="{ item }">
          <v-chip>
            {{ item.status.statusName }}
          </v-chip>
        </template>

        <template #[`item.spe`]="{ item }">
          <div>{{ item.specialty }}</div>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar Profissional" location="left">
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
          <v-tooltip text="Editar Profissional" location="left">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiSquareEditOutline"
                size="small"
                color="primary"
                :to="{ name: 'doctor-update', params: { id: item.doctorId } }"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </template>
  </DefaultTemplate>
</template>

