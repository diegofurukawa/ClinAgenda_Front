export interface IStatus {
  statusId: number
  statusName: string
  statusType: string
  dCreated: string
  dLastUpdated: string
  lActive: boolean
}

export type GetStatusListRequest = {
  itemsPerPage: number
  page: number
}

export type GetStatusListResponse = {
  total: number
  items: IStatus[]
}

