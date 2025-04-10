<script setup lang="ts">
import { ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiTrashCan, mdiSquareEditOutline } from '@mdi/js'
import type {
  ISpecialty,
  GetSpecialtyListRequest,
  GetSpecialtyListResponse
} from '@/interfaces/specialty'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import { ActiveField, activeFieldOptions } from '@/enum'

const toastStore = useToastStore()
const isLoadingList = ref<boolean>(false)
const filterName = ref<GetSpecialtyListRequest['specialtyName']>()
const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<ISpecialty[]>([])
const filterActive = ref<string>(ActiveField.TODOS) // Inicialize com o valor padrão

// Console.log para debug
console.log('ActiveField enum:', ActiveField)
console.log('Initial filterActive value:', filterActive.value)

const headers = [
  {
    title: 'ID',
    key: 'specialtyId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'specialtyName', sortable: false },
  { title: 'Duração', key: 'nScheduleDuration', sortable: false },
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

  const { isError, data } = await request<GetSpecialtyListRequest, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'Specialty/list',
    body: {
      itemsPerPage: itemsPerPage.value,
      page: page.value,
      specialtyName: filterName.value,
      lActive: activeBoolean
    }
  })

  if (isError) return

  items.value = data.items
  total.value = data.total
  isLoadingList.value = false
}

const deleteListItem = async (item: ISpecialty) => {
  const shouldDelete = confirm(`Deseja mesmo deletar ${item.specialtyName}?`)

  if (!shouldDelete) return

  const response = await request<null, null>({
    method: 'DELETE',
    endpoint: `Specialty/delete/${item.specialtyId}`
  })

  if (response.isError) return

  toastStore.setToast({
    type: 'success',
    text: 'Especialidade deletada com sucesso!'
  })

  toastStore.setToast({
    type: 'success',
    text: 'Especialidade deletada com sucesso!'
  })

  toastStore.setToast({
    type: 'success',
    text: 'Especialidade deletada com sucesso!'
  })

  toastStore.setToast({
    type: 'success',
    text: 'Especialidade deletada com sucesso!'
  })

  loadDataTable()
}
</script>

<template>
  <DefaultTemplate>
    <template #title> Lista de Especialidades </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'specialty-insert' }">
        Adicionar especialidade
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
              <div>
                <!-- Teste básico de v-select normal -->
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
        item-value="specialtyId"
        @update:options="handleDataTableUpdate"
      >
        <template #[`item.nScheduleDuration`]="{ item }">
          {{ item.nScheduleDuration }} mininutos
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
                :to="{ name: 'specialty-update', params: { id: item.specialtyId } }"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </template>
  </DefaultTemplate>
</template>

