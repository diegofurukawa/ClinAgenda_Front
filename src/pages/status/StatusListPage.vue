<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiTrashCan, mdiSquareEditOutline } from '@mdi/js'
import type {
  IStatus,
  IStatusType,
  GetStatusListRequest,
  GetStatusListResponse,
  GetStatusTypeListResponse
} from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import { ActiveField, activeFieldOptions } from '@/enum'
import { StatusTypeOptions, getStatusTypeDisplay } from '@/enum/statusType'

const toastStore = useToastStore()

const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)

const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IStatus[]>([])

const filterStatusName = ref<string>('')
const filterStatusType = ref<IStatusType['statusType'] | null>(null)
// Inicializando apenas com Ativos
const filterActive = ref<string>(ActiveField.ATIVO)
const statusTypeItems = ref<IStatusType[]>([])

// Console.log para debug
console.log('ActiveField enum:', ActiveField)
console.log('Initial filterActive value:', filterActive.value)

const headers = [
  {
    title: 'Id',
    key: 'statusId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Descrição', key: 'statusName', sortable: false },
  { title: 'Tipo Status', key: 'statusType', sortable: false },
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

  const { isError, data } = await request<GetStatusListRequest, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value,
      statusName: filterStatusName.value || undefined,
      statusType: filterStatusType.value || undefined,
      lActive: activeBoolean
    }
  })

  if (isError) {
    console.error('Erro ao carregar dados:', isError)
    return
  }

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

    if (statusTypeResponse.isError) {
      console.error('Erro ao carregar tipos de status:', statusTypeResponse)
      return
    }

    statusTypeItems.value = statusTypeResponse.data.items
  } catch (e) {
    console.error('Erro ao buscar itens do filtro', e)
  } finally {
    isLoadingFilter.value = false
  }
}

const deleteListItem = async (item: IStatus) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.statusName}?`)

  if (!shouldDelete) return

  try {
    const response = await request<null, null>({
      method: 'DELETE',
      endpoint: `status/delete/${item.statusId}`
    })

    if (response.isError) {
      console.error('Erro ao deletar status:', response)
      return
    }

    toastStore.setToast({
      type: 'success',
      text: 'Status deletado com sucesso!'
    })

    loadDataTable()
  } catch (e) {
    console.error('Falha ao deletar item da lista', e)
  }
}

onMounted(() => {
  console.log('Component mounted')
  loadFilters()
  loadDataTable()
})
</script>

<template>
  <DefaultTemplate>
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
            <!-- Filtro de Nome -->
            <v-col>
              <v-text-field
                v-model="filterStatusName"
                label="Nome"
                variant="outlined"
                hide-details
                clearable
              />
            </v-col>

            <!-- Filtro de Tipo Status -->
            <v-col>
              <v-select
                v-model="filterStatusType"
                label="Tipo"
                :loading="isLoadingFilter"
                :items="StatusTypeOptions"
                item-value="value"
                item-title="title"
                clearable
                hide-details
                variant="outlined"
              />
            </v-col>
            <v-col>
              <div>
                <!-- Select para filtro de status ativo -->
                <v-select
                  v-model="filterActive"
                  label="Status Ativo"
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
        item-value="statusId"
        @update:options="handleDataTableUpdate"
      >
        <!-- Template para exibir o tipo de status traduzido -->
        <template #[`item.statusType`]="{ item }">
          {{ getStatusTypeDisplay(item.statusType) }}
        </template>

        <template #[`item.lActive`]="{ item }">
          <v-chip :color="item.lActive ? 'success' : 'error'" size="small">
            {{ item.lActive ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar Status" location="left">
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
          <v-tooltip text="Editar Status" location="left">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                :icon="mdiSquareEditOutline"
                size="small"
                color="primary"
                :to="{ name: 'status-update', params: { id: item.statusId } }"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </template>
  </DefaultTemplate>
</template>

