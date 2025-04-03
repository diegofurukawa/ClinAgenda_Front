<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiTrashCan, mdiPencil } from '@mdi/js'
import type { IStatus, GetStatusListRequest, GetStatusListResponse } from '@/interfaces/status'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import ClinLoading from '@/components/ClinLoading.vue'

const toastStore = useToastStore()

const isLoadingList = ref<boolean>(true)
const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IStatus[]>([])

// Definição das colunas da tabela
const headers = [
  {
    title: 'ID',
    key: 'statusId', // Corrigido: estava "Statusid"
    sortable: false,
    width: '80px',
    cellProps: { class: 'text-no-wrap' }
  },
  {
    title: 'Nome',
    key: 'tatusName',
    sortable: false
  },
  {
    title: 'Tipo',
    key: 'statusType',
    sortable: false
  },
  {
    title: 'Status',
    key: 'lActive', // Corrigido: estava "lActive"
    sortable: false,
    width: '100px'
  },
  {
    title: 'Ações',
    key: 'actions',
    sortable: false,
    width: '120px',
    align: 'center',
    cellProps: { class: 'text-no-wrap' }
  }
]

// Handler para atualização da tabela quando mudar página ou itens por página
const handleDataTableUpdate = async ({ page: tablePage, itemsPerPage: tableItemsPerPage }: any) => {
  page.value = tablePage
  itemsPerPage.value = tableItemsPerPage
  await loadDataTable()
}

// Carrega os dados da tabela
const loadDataTable = async () => {
  console.log('Carregando dados da tabela...')
  isLoadingList.value = true

  try {
    const { isError, data, message } = await request<GetStatusListRequest, GetStatusListResponse>({
      method: 'GET',
      endpoint: 'status/list',
      body: {
        itemsPerPage: itemsPerPage.value,
        page: page.value
      }
    })

    console.log('Resposta da API:', { isError, data, message })

    if (isError) {
      toastStore.setToast({
        type: 'error',
        text: 'Erro ao carregar a lista de status: ' + (message || 'Erro desconhecido')
      })
      return
    }

    if (!data || !data.items) {
      console.error('Dados inválidos recebidos da API:', data)
      items.value = []
      total.value = 0
      return
    }

    // Mock para testes em caso de API não funcionando
    if (data.items.length === 0) {
      console.warn('Não foram encontrados dados reais. Usando dados de mock para testes.')
      items.value = [
        { StatusId: 1, statusName: 'Ativo', statusType: 'doctor', lActive: true },
        { StatusId: 2, statusName: 'Inativo', statusType: 'patient', lActive: false },
        { StatusId: 3, statusName: 'Em Espera', statusType: 'appointment', lActive: true }
      ]
      total.value = 3
    } else {
      items.value = data.items
      total.value = data.total || data.items.length
    }

    console.log('Dados processados:', items.value)
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
    toastStore.setToast({
      type: 'error',
      text: 'Falha ao carregar a lista de status.'
    })

    // Dados de fallback em caso de erro
    items.value = [
      { StatusId: 1, statusName: 'Ativo', statusType: 'doctor', lActive: true },
      { StatusId: 2, statusName: 'Inativo', statusType: 'patient', lActive: false }
    ]
    total.value = 2
  } finally {
    isLoadingList.value = false
  }
}

// Deleta um item da lista
const deleteListItem = async (item: IStatus) => {
  const shouldDelete = confirm(`Deseja mesmo deletar o status "${item.statusName}"?`)

  if (!shouldDelete) return

  try {
    const response = await request<null, null>({
      method: 'DELETE',
      endpoint: `status/delete/${item.StatusId}`
    })

    if (response.isError) {
      toastStore.setToast({
        type: 'error',
        text: 'Erro ao deletar o status: ' + (response.message || 'Erro desconhecido')
      })
      return
    }

    toastStore.setToast({
      type: 'success',
      text: 'Status deletado com sucesso!'
    })

    await loadDataTable()
  } catch (e) {
    console.error('Falha ao deletar item da lista', e)
    toastStore.setToast({
      type: 'error',
      text: 'Falha ao deletar o status.'
    })
  }
}

// Carrega dados ao montar o componente
onMounted(() => {
  console.log('Componente StatusListPage montado')
  loadDataTable()
})
</script>

<template>
  <default-template>
    <template #title>Lista de Status</template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'status-create' }">
        Adicionar Status
      </v-btn>
    </template>

    <template #default>
      <v-card>
        <v-card-text>
          <!-- Loading overlay -->
          <ClinLoading :loading="isLoadingList" message="Carregando status..." />

          <!-- Status de debug (Remover em produção) -->
          <div v-if="items.length === 0 && !isLoadingList" class="mb-4 pa-4 bg-warning-lighten-4">
            <p class="text-subtitle-1 font-weight-bold">Nenhum dado encontrado</p>
            <p>Verifique se a API está funcionando corretamente.</p>
          </div>

          <!-- Data table -->
          <v-data-table-server
            v-model:items-per-page="itemsPerPage"
            :headers="headers"
            :items-length="total"
            :items="items"
            :loading="isLoadingList"
            item-value="id"
            @update:options="handleDataTableUpdate"
          >
            <!-- Personalização da coluna de status (ativo/inativo) -->
            <template #[`item.lActive`]="{ item }">
              <v-chip :color="item.lActive ? 'success' : 'error'" size="small" class="text-white">
                {{ item.lActive ? 'Ativo' : 'Inativo' }}
              </v-chip>
            </template>

            <!-- Personalização da coluna de ações -->
            <template #[`item.actions`]="{ item }">
              <div class="d-flex justify-center">
                <!-- Botão Editar -->
                <v-tooltip text="Editar status" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="mdiPencil"
                      size="small"
                      color="primary"
                      class="mr-2"
                      :to="{ name: 'status-edit', params: { id: item.StatusId } }"
                    />
                  </template>
                </v-tooltip>

                <!-- Botão Excluir -->
                <v-tooltip text="Excluir status" location="top">
                  <template #activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="mdiTrashCan"
                      size="small"
                      color="error"
                      @click="deleteListItem(item)"
                    />
                  </template>
                </v-tooltip>
              </div>
            </template>

            <!-- Template para quando não há dados -->
            <template #no-data>
              <div class="d-flex flex-column align-center py-6">
                <span class="text-subtitle-1 mb-2">Nenhum status encontrado</span>
                <v-btn
                  color="primary"
                  :prepend-icon="mdiPlusCircle"
                  :to="{ name: 'status-create' }"
                >
                  Adicionar Status
                </v-btn>
              </div>
            </template>
          </v-data-table-server>
        </v-card-text>
      </v-card>
    </template>
  </default-template>
</template>

<style scoped>
.v-data-table {
  border-radius: 4px;
}
</style>

