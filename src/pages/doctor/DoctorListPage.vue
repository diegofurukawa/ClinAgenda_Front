<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiSquareEditOutline, mdiTrashCan } from '@mdi/js'
import type { IDoctor, GetDoctorListRequest, GetDoctorListResponse } from '@/interfaces/doctor'
import type { GetSpecialtyListResponse, ISpecialty } from '@/interfaces/specialty'
import type { IStatus, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import { ActiveField, activeFieldOptions } from '@/enum'

const toastStore = useToastStore()
const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)
const filterName = ref<GetDoctorListRequest['doctorName']>('')
const filterSpecialtyId = ref<ISpecialty['specialtyId'] | null>(null)
const filterStatusId = ref<IStatus['statusId'] | null>(null)
const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IDoctor[]>([])
const specialtyItems = ref<ISpecialty[]>([])
const statusItems = ref<IStatus[]>([])
// Inicializando apenas com Ativos
const filterActive = ref<string>(ActiveField.ATIVO)

const headers = [
  {
    title: 'ID',
    key: 'doctorId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Nome', key: 'doctorName', sortable: false },
  { title: 'Especialidades', key: 'specialty.specialtyName', sortable: false },
  { title: 'Status', key: 'status.statusName', sortable: false },
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

    const { isError, data } = await request<GetDoctorListRequest, GetDoctorListResponse>({
      method: 'GET',
      endpoint: 'doctor/list',
      body: {
        itemsPerPage: itemsPerPage.value,
        page: page.value,
        doctorName: filterName.value,
        specialtyId: filterSpecialtyId.value,
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

const loadFilters = async () => {
  isLoadingFilter.value = true

  const specialtyRequest = request<undefined, GetSpecialtyListResponse>({
    method: 'GET',
    endpoint: 'specialty/list'
  })

  const statusRequest = request<undefined, GetStatusListResponse>({
    method: 'GET',
    endpoint: 'status/list'
  })

  try {
    const [specialtyResponse, statusResponse] = await Promise.all([specialtyRequest, statusRequest])

    if (specialtyResponse.isError || statusResponse.isError) return

    specialtyItems.value = specialtyResponse.data.items
    statusItems.value = statusResponse.data.items
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
      text: 'Profissional deletado com sucesso!'
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
    <template #title> Lista de Profissionais </template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'doctor-insert' }">
        Adicionar profissional
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-text-field
                v-model.trim="filterName"
                label="Nome"
                hide-details
                clearable
                @click:clear="loadDataTable()"
              />
            </v-col>
            <v-col>
              <v-select
                v-model="filterSpecialtyId"
                label="Especialidade"
                :loading="isLoadingFilter"
                :items="specialtyItems"
                item-value="specialtyId"
                item-title="specialtyName"
                hide-details
                clearable
                @click:clear="loadDataTable()"
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
                hide-details
                clearable
                @click:clear="loadDataTable()"
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
        item-value="doctorId"
        @update:options="handleDataTableUpdate"
      >
        <template #[`item.specialty.specialtyName`]="{ item }">
          <!-- {{ item.specialty }} -->
          <v-chip v-for="specialty of item.specialty" :key="specialty.specialtyId" class="mr-2">
            {{ item.specialty.specialtyName }}
          </v-chip>
        </template>

        <template #[`item.status.statusName`]="{ item }">
          <v-chip>
            {{ item.status.statusName }}
          </v-chip>
        </template>

        <template #[`item.lActive`]="{ item }">
          <v-chip :color="item.lActive ? 'success' : 'error'" size="small">
            {{ item.lActive ? 'Ativo' : 'Inativo' }}
          </v-chip>
        </template>

        <template #[`item.actions`]="{ item }">
          <v-tooltip text="Deletar profissional" location="left">
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
          <v-tooltip text="Editar profissional" location="left">
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

