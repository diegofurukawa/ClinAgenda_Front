<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiTrashCan } from '@mdi/js'
import type {
  IStatus,
  IStatusType,
  GetStatusListRequest,
  GetStatusListResponse,
  GetStatusTypeListResponse
} from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import router from '@/router'

const toastStore = useToastStore()

const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)

const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
// const items = ref<IStatus[]>([])
const items = ref<IStatus[]>([])

const statusTypeItems = ref<IStatusType[]>([])

const headers = [
  {
    title: 'StatusId',
    key: 'statusId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'statusName', sortable: false },
  { title: 'Tipo', key: 'statusType', sortable: false },
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
  isLoadingList.value = true
  const { isError, data } = await request<GetStatusListRequest, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value
    }
  })

  if (isError) return

  items.value = data.items
  total.value = data.total
  isLoadingList.value = false
}

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

const deleteListItem = async (item: IStatus) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.statusName}?`)

  if (!shouldDelete) return

  try {
    const response = await request<null, null>({
      method: 'DELETE',
      endpoint: `status/delete/${item.statusId}`
    })

    if (response.isError) return

    toastStore.setToast({
      type: 'success',
      text: 'Status deletada com sucesso!'
    })

    router.push({ name: 'status-list' })

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
  <default-template>
    <template #title> Lista de Status </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'status-insert' }">
        Adicionar Status
      </v-btn>
    </template>

    <template #default>
      <!-- Filtros da Lista -->
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <!-- Filtro de Tipo Status -->
            <v-col>
              <v-select
                v-model="filterStatusType"
                label="Tipo"
                :loading="isLoadingFilter"
                :items="statusTypeItems"
                item-value="statusType"
                item-title="statusType"
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
        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar status" location="left">
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
  </default-template>
</template>

