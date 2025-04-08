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
  statusTypeName: string
}

export type GetStatusListRequest = {
  itemsPerPage: number
  page: number
  statusName: IStatus['statusName']
}

export type GetStatusListResponse = {
  total: number
  items: IStatus[]
}

export type GetStatusTypeListResponse = {
  total: number
  items: IStatusType[]
}

export type StatusForm = {
  statusName: IStatus['statusName']
  statusType: IStatus['statusType']
}

