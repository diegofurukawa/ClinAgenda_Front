import type { IStatus } from '@/interfaces/status'

export interface IPatient {
  patientId: number
  patientName: string
  phoneNumber: string
  documentNumber: string
  dBirthDate: string
  status: IStatus
  lActive: boolean
}

export type GetPatientListRequest = {
  itemsPerPage: number
  page: number
  patientName: IPatient['patientName']
  documentNumber: IPatient['documentNumber']
  statusId: IStatus['statusId'] | null
  lActive?: IPatient['lActive'] | null
}

export type GetPatientListResponse = {
  total: number
  items: IPatient[]
}

export type PatientForm = {
  patientName: IPatient['patientName']
  phoneNumber: IPatient['phoneNumber']
  documentNumber: IPatient['documentNumber']
  dBirthDate: IPatient['dBirthDate']
  statusId: IStatus['statusId'] | null
  lActive: boolean
}

