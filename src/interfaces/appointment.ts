import type { IStatus } from '@/interfaces/status'
import type { IPatient } from '@/interfaces/patient'
import type { IDoctor } from '@/interfaces/doctor'
import type { ISpecialty } from '@/interfaces/specialty'

export interface IAppointment {
  appointmentId: number
  dAppointmentDate: string
  observation: string
  status: IStatus
  patient: IPatient
  doctor: IDoctor
  specialty: ISpecialty
  lActive: boolean
}

export type GetAppointmentListRequest = {
  itemsPerPage: number
  page: number
  patientName: IPatient['patientName']
  documentNumber: IPatient['documentNumber']
  statusId: IStatus['statusId'] | null
  lActive?: IAppointment['lActive'] | null
}

export type GetAppointmentListResponse = {
  total: number
  items: IAppointment[]
}

export type AppointmentForm = {
  dAppointmentDate: string
  patientId: IPatient['patientId']
  doctorId: IDoctor['doctorId']
  specialtyId: ISpecialty['specialtyId']
  statusId: IStatus['statusId'] | null
  lActive: boolean
}

