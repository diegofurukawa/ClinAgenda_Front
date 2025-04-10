import type { IStatus } from '@/interfaces/status'
import type { ISpecialty } from '@/interfaces/specialty'

export interface IDoctor {
  doctorId: number
  doctorName: string
  specialty: ISpecialty
  status: IStatus
}

export type GetDoctorListRequest = {
  itemsPerPage: number
  page: number
  doctorName: IDoctor['doctorName'] | null
  specialtyId?: ISpecialty['specialtyId'] | null
  statusId?: IStatus['statusId'] | null
}

export type GetDoctorListResponse = {
  total: number
  items: IDoctor[]
}

export type DoctorForm = {
  doctorName: IDoctor['doctorName']
  specialty: Array<ISpecialty['specialtyId']>
  statusId: IStatus['statusId'] | null
  lActive: boolean | null
}

