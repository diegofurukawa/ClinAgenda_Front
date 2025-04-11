<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { DefaultTemplate } from '@/template'
import { mdiPlusCircle, mdiSquareEditOutline, mdiTrashCan } from '@mdi/js'
import type {
  IAppointment,
  GetAppointmentListRequest,
  GetAppointmentListResponse
} from '@/interfaces/appointment'
import type { GetSpecialtyListResponse, ISpecialty } from '@/interfaces/specialty'
import type { IPatient } from '@/interfaces/patient'
import type { IDoctor } from '@/interfaces/doctor'
import request from '@/engine/httpClient'
import { useToastStore } from '@/stores'
import { dateFormat, DateFormatEnum, maskDocumentNumber } from '@/utils'
import { ActiveField, activeFieldOptions } from '@/enum'
import ClinDatePicker from '@/components/ClinDatePicker.vue'

const toastStore = useToastStore()

const isLoadingList = ref<boolean>(false)
const isLoadingFilter = ref<boolean>(false)

const filterDoctorName = ref<IDoctor['doctorName']>('')
const filterPatientName = ref<IPatient['patientName']>('')
const filterSpecialtyId = ref<ISpecialty['specialtyId'] | null>(null)
const filterActive = ref<string>(ActiveField.TODOS) // Inicialize com o valor padrão
const filterStatusId = ref<IStatus['statusId'] | null>(null)
const filterddAppointmentDate = ref<IAppointment['dAppointmentDate'] | null>(null)

const statusItems = ref<IStatus[]>([])
const itemsPerPage = ref<number>(10)
const total = ref<number>(0)
const page = ref<number>(1)
const items = ref<IAppointment[]>([])
const specialtyItems = ref<ISpecialty[]>([])

const headers = [
  {
    title: 'ID',
    key: 'appointmentId',
    sortable: false,
    width: 0,
    cellProps: { class: 'text-no-wrap' }
  },
  { title: 'Paciente', key: 'patient.patientName', sortable: false },
  { title: 'CPF', key: 'patient.documentNumber', sortable: false },
  { title: 'Profissional', key: 'doctor.doctorName', sortable: false },
  { title: 'Especialidades', key: 'specialty.specialtyName', sortable: false },
  { title: 'Horario', key: 'dAppointmentDate', sortable: false },
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

    const { isError, data } = await request<GetAppointmentListRequest, GetAppointmentListResponse>({
      method: 'GET',
      endpoint: 'appointment/list',
      body: {
        doctorName: filterDoctorName.value,
        patientName: filterPatientName.value,
        specialtyId: filterSpecialtyId.value,
        startDate: filterddAppointmentDate.value,
        endDate: filterddAppointmentDate.value,
        statusId: filterStatusId.value,
        lActive: activeBoolean,
        itemsPerPage: itemsPerPage.value,
        page: page.value
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

const deleteListItem = async (item: IAppointment) => {
  const shouldDelete = confirm(
    `Deseja mesmo deletar agendamento? \n\nHorário: ${item.dAppointmentDate} \nPaciente: ${item.patient.patientName}\nAgendamento: ${item.doctor.doctorName}`
  )

  if (!shouldDelete) return

  try {
    const response = await request<null, null>({
      method: 'DELETE',
      endpoint: `appointment/${item.appointmentId}`
    })

    if (response.isError) return

    toastStore.setToast({
      type: 'success',
      text: 'Agendamento deletado com sucesso!'
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
    <template #title> Agendamentos</template>

    <template #action>
      <v-btn color="primary" :prepend-icon="mdiPlusCircle" :to="{ name: 'appointment-insert' }">
        Adicionar Agendamento
      </v-btn>
    </template>

    <template #default>
      <v-sheet class="pa-4 mb-4">
        <v-form @submit.prevent="loadDataTable">
          <v-row>
            <v-col>
              <v-select
                v-model="filterSpecialtyId"
                label="Profissional"
                :loading="isLoadingFilter"
                :items="specialtyItems"
                item-value="specialtyId"
                item-title="specialtyName"
                clearable
                hide-details
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
                clearable
                hide-details
              />
            </v-col>

            <v-col>
              <v-text-field v-model.trim="filterName" label="Paciente" hide-details clearable />
            </v-col>

            <v-col>
              <v-text-field
                v-model.trim="filterDocumentNumber"
                v-maska="documentNumberMask"
                label="CPF"
                hide-details
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col>
              <clin-date-picker v-model="filterddAppointmentDate" label="Data" clearable />
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
        item-value="appointmentId"
        @update:options="handleDataTableUpdate"
      >
        <template #[`item.patient.patientName`]="{ item }">
          <div>{{ item.patient.patientName }}</div>
        </template>

        <template #[`item.patient.documentNumber`]="{ item }">
          <div>{{ maskDocumentNumber(item.patient.documentNumber) }}</div>
        </template>

        <template #[`item.dAppointmentDate`]="{ item }">
          <!-- <div>{{ dateMask(item.dAppointmentDate) }}</div> -->
          {{ dateFormat(item.dAppointmentDate, DateFormatEnum.FullDateAndTime.value) }}
        </template>

        <template #[`item.doctor.doctorName`]="{ item }">
          <div>{{ item.doctor.doctorName }}</div>
        </template>

        <template #[`item.specialty.specialtyName`]="{ item }">
          <div>{{ item.specialty.specialtyName }}</div>
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
                :to="{ name: 'appointment-update', params: { id: item.appointmentId } }"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table-server>
    </template>
  </DefaultTemplate>
</template>

