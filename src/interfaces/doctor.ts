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
  name: IDoctor['doctorName']
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

