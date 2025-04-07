import type { IStatus } from '@/interfaces/status'

export interface IPatient {
  patientId: number
  patientName: string
  phoneNumber: string
  documentNumber: string
  birthDate: string
  status: IStatus
}

export type GetPatientListRequest = {
  itemsPerPage: number
  page: number
  name: IPatient['patientName']
  documentNumber: IPatient['documentNumber']
  statusId: IStatus['statusId'] | null
}

export type GetPatientListResponse = {
  total: number
  items: IPatient[]
}

export type PatientForm = {
  patientName: IPatient['patientName']
  phoneNumber: IPatient['phoneNumber']
  documentNumber: IPatient['documentNumber']
  birthDate: IPatient['birthDate']
  statusId: IStatus['statusId'] | null
  lActive: boolean
}

