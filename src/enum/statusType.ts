// export const StatusTypeOptions = [
//   { value: 'specialty', title: 'Especialidade' },
//   { value: 'patient', title: 'Paciente' },
//   { value: 'doctor', title: 'Profissional' },
//   { value: 'appointment', title: 'Agendamento' }
// ]

// src/enum/statusType.ts

/**
 * Enum para representar os tipos de status
 * Usado no sistema para categorizar os diferentes tipos de status
 */
export enum StatusType {
  SPECIALTY = 'specialty',
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  APPOINTMENT = 'appointment'
}

/**
 * Mapeamento para exibição em português dos tipos de status
 */
export const StatusTypeDisplayMap: Record<StatusType, string> = {
  [StatusType.SPECIALTY]: 'Especialidade',
  [StatusType.PATIENT]: 'Paciente',
  [StatusType.DOCTOR]: 'Profissional',
  [StatusType.APPOINTMENT]: 'Agendamento'
}

/**
 * Opções para uso em componentes de seleção (v-select, etc.)
 */
export const StatusTypeOptions = [
  { value: StatusType.SPECIALTY, title: StatusTypeDisplayMap[StatusType.SPECIALTY] },
  { value: StatusType.PATIENT, title: StatusTypeDisplayMap[StatusType.PATIENT] },
  { value: StatusType.DOCTOR, title: StatusTypeDisplayMap[StatusType.DOCTOR] },
  { value: StatusType.APPOINTMENT, title: StatusTypeDisplayMap[StatusType.APPOINTMENT] }
]

/**
 * Função auxiliar para obter o nome de exibição a partir do valor de enum
 * @param type Valor do enum StatusType
 * @returns Nome de exibição em português
 */
export function getStatusTypeDisplay(type: string): string {
  return StatusTypeDisplayMap[type as StatusType] || type
}

