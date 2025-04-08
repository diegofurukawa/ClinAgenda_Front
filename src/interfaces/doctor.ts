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
  doctorName: IDoctor['doctorName']
}

export type GetDoctorListResponse = {
  total: number
  items: IDoctor[]
}
