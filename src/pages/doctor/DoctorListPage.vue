<script setup lang="ts">
import { ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiTrashCan } from '@mdi/js'
import type { IDoctor, GetDoctorListRequest, GetDoctorListResponse } from '@/interfaces/doctor'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'

const toastStore = useToastStore()
const isLoadingList = ref<boolean>(false)
const filterName = ref<GetDoctorListRequest['doctorName']>('')
const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IDoctor[]>([])

const headers = [
  {
    title: 'ID',
    key: 'doctorId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'doctorName', sortable: false },

  { title: 'Especialidade', key: 'specialtyName', sortable: false },
  { title: 'Duração', key: 'ScheduleDuration', sortable: false },
  { title: 'Status', key: 'statusName', sortable: false },

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
  isLoadingList.value = true
  const { isError, data } = await request<GetDoctorListRequest, GetDoctorListResponse>({
    method: 'GET',
    endpoint: 'doctor/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value,
      doctorName: filterName.value
    }
  })

  if (isError) return

  items.value = data.items
  total.value = data.total
  isLoadingList.value = false
}

const deleteListItem = async (item: IDoctor) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.doctorName}?`)

  if (!shouldDelete) return

  const response = await request<null, null>({
    method: 'DELETE',
    endpoint: `doctor/delete/${item.doctorId}`
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: 'Especialidade deletada com sucesso!'
  })

  loadDataTable()
}
</script>

<template>
  <DefaultTemplate>
    <template #title> Lista de Médicos </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'doctor-insert' }">
        Adicionar Médico
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-text-field v-model.trim="filterName" label="Nome" hide-details />
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
        <template #[`item.specialtyName`]="{ item }"> {{ item.specialty.specialtyName }} </template>
        <template #[`item.ScheduleDuration`]="{ item }">
          {{ item.specialty.nScheduleDuration }}
        </template>
        <template #[`item.statusName`]="{ item }"> {{ item.status.statusName }} </template>

        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar Médico" location="left">
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
        </template>
      </v-data-table-server>
    </template>
  </DefaultTemplate>
</template>

