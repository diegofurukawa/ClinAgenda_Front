import type { IStatus } from '@/interfaces/status'
import type { ISpecialty } from '@/interfaces/specialty'


export interface IDoctor {
    id: number
    name: string
    specialty: ISpecialty
    status: IStatus
  }
  
  export type GetDoctorListRequest = {
    itemsPerPage: number
    page: number
    name: IDoctor['name']
  }
  
  export type GetDoctorListResponse = {
    total: number
    items: IDoctor[]
  }




  // {
  //   "id": 1,
  //   "name": "DIEGO",
  //   "specialty": [
  //     {
  //       "id": 4,
  //       "name": "ORTOPEDIA",
  //       "scheduleDuration": 0
  //     }
  //   ],
  //   "status": {
  //     "id": 1,
  //     "name": "ATIVO"
  //   }
  // }