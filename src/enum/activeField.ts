/**
 * Enum para representar os valores de campo ativo/inativo
 * Usado em filtros e formulários para selecionar o estado de atividade de qualquer entidade
 */

export enum ActiveField {
  TODOS = '',
  ATIVO = 'true',
  INATIVO = 'false'
}

export interface ActiveFieldOption {
  value: string
  title: string
  icon?: string
  color?: string
}

/**
 * Lista de opções de campo ativo para uso em componentes de seleção
 */
export const activeFieldOptions: ActiveFieldOption[] = [
  { value: ActiveField.TODOS, title: 'Todos', icon: 'mdi-filter-variant', color: 'grey' },
  { value: ActiveField.ATIVO, title: 'Ativo', icon: 'mdi-check-circle', color: 'success' },
  { value: ActiveField.INATIVO, title: 'Inativo', icon: 'mdi-close-circle', color: 'error' }
]

/**
 * Converte um valor de string do enum para booleano ou undefined
 * @param value Valor do enum ActiveField
 * @returns boolean (true/false) ou undefined para TODOS
 */
export function convertToBoolean(value: string | boolean | undefined): boolean {
  if (value === undefined || value === null) return true

  // Se já for boolean, retorna diretamente
  if (typeof value === 'boolean') return value

  // Conversão a partir de string
  if (value === ActiveField.TODOS) return true
  if (value === ActiveField.ATIVO) return true
  if (value === ActiveField.INATIVO) return false

  return false // Para ActiveField.TODOS ou valor desconhecido, retorna false
}

/**
 * Converte um valor booleano para o formato do enum ActiveField
 * @param value Valor booleano ou undefined
 * @returns String do enum ActiveField
 */
export function convertFromBoolean(value: boolean | null | undefined): string {
  if (value === true) return ActiveField.ATIVO
  if (value === false) return ActiveField.INATIVO
  return ActiveField.TODOS
}
