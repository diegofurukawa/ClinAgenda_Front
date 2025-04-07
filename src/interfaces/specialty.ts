export interface ISpecialty {
  specialtyId: number
  specialtyName: string
  nScheduleDuration: number
  dCreated: string
  dLastUpdated: string
  lActive: boolean
}

export type GetSpecialtyListRequest = {
  itemsPerPage: number
  page: number
  name: ISpecialty['specialtyName']
}

export type GetSpecialtyListResponse = {
  total: number
  items: ISpecialty[]
}

export type SpecialtyForm = {
  specialtyName: ISpecialty['specialtyName']
  nScheduleDuration: ISpecialty['nScheduleDuration']
}

