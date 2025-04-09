export interface IStatus {
  statusId: number
  statusName: string
  statustype: IStatusType
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
  statusName?: IStatus['statusName']
  statusType?: IStatusType['statusType'] | null
  lActive?: IStatus['lActive']
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
  statusType: IStatusType['statusType']
}

