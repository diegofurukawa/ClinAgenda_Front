export interface IStatus {
  statusId: number
  statusName: string
  statusType: string
  dCreated: string
  dLastUpdated: string
  lActive: boolean
}

export interface IStatusType {
  statusType: string
}

export type GetStatusListRequest = {
  itemsPerPage: number
  page: number
  name: IStatus['statusName']
}

export type GetStatusListResponse = {
  total: number
  items: IStatus[]
}

export type GetStatusTypeListResponse = {
  total: number
  items: IStatus[]
}

export type StatusForm = {
  statusName: IStatus['statusName']
  statusType: IStatus['statusType']
}

