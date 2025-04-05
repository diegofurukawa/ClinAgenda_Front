import type { IStatus } from '@/interfaces/status'

export interface IPatient {
    id: number
    name: string
    phoneNumber: string
    documentNumber: string    
    birthDate: string
    status: IStatus
  }
  
  export type GetPatientListRequest = {
    itemsPerPage: number
    page: number
    name: IPatient['name']
    documentNumber: IPatient['documentNumber']
    statusId: IStatus['id'] | null
  }
  
  export type GetPatientListResponse = {
    total: number
    items: IPatient[]
  }


  export type PatientForm = {
    name: IPatient['name']
    phoneNumber: IPatient['phoneNumber']
    documentNumber: IPatient['documentNumber']
    birthDate: IPatient['birthDate']
    statusId: IStatus['id'] | null
  }
  