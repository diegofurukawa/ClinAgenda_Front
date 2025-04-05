/**
 * Formata uma data para um formato especificado
 * @param date Data a ser formatada (string ISO ou objeto Date)
 * @param format Formato desejado (DD/MM/YYYY, YYYY-MM-DD, etc)
 * @returns String formatada
 */
export function formatDate(date: string | Date, format: string = 'DD/MM/YYYY'): string {
  if (!date) return ''

  const d = typeof date === 'string' ? new Date(date) : date

  if (isNaN(d.getTime())) {
    return ''
  }

  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year = d.getFullYear()
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  const seconds = String(d.getSeconds()).padStart(2, '0')

  return format
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year))
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('ss', seconds)
}

/**
 * Converte uma data no formato DD/MM/YYYY para o formato ISO YYYY-MM-DD
 * @param dateStr Data no formato DD/MM/YYYY
 * @returns Data no formato YYYY-MM-DD
 */
export function convertToISODate(dateStr: string): string {
  if (!dateStr) return ''

  const parts = dateStr.split('/')
  if (parts.length !== 3) return ''

  const day = parseInt(parts[0])
  const month = parseInt(parts[1]) - 1 // Mês em JS começa em 0
  const year = parseInt(parts[2])

  const date = new Date(year, month, day)

  if (isNaN(date.getTime())) {
    return ''
  }

  return date.toISOString().split('T')[0]
}

/**
 * Retorna a data atual formatada
 * @param format Formato desejado
 * @returns Data atual formatada
 */
export function getCurrentDate(format: string = 'DD/MM/YYYY'): string {
  return formatDate(new Date(), format)
}

/**
 * Calcula a diferença em dias entre duas datas
 * @param date1 Primeira data
 * @param date2 Segunda data
 * @returns Número de dias de diferença
 */
export function daysBetween(date1: Date | string, date2: Date | string): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return diffDays
}

import { format as datefnsFormat, isAfter, isBefore, isMatch, isToday, parse } from 'date-fns'

type FormatTypes =
  | 'dd/MM/yyyy'
  | 'dd/MM/yy'
  | 'dd/MM/yyyy HH:mm'
  | 'yyyy-MM-dd'
  | 'dd/MM/yyyy HH:mm:ss'

export class DateFormatEnum {
  static readonly FullDate = new DateFormatEnum('FullDate', 'dd/MM/yyyy')
  static readonly FullDateShort = new DateFormatEnum('FullDateShort', 'dd/MM/yy')
  static readonly FullDateAmerican = new DateFormatEnum('FullDateAmerican', 'yyyy-MM-dd')
  static readonly FullDateAndTime = new DateFormatEnum('FullDateAndTime', 'dd/MM/yyyy HH:mm')
  static readonly FullDateAndTimeWithSeconds = new DateFormatEnum(
    'FullDateAndTimeWithSeconds',
    'dd/MM/yyyy HH:mm:ss'
  )

  constructor(private readonly k: string, public readonly v: FormatTypes) {}

  public get key() {
    return this.k
  }

  public get value() {
    return this.v
  }
}

export const dateValidate = (date: string, validateFormat: FormatTypes) => {
  if (!date) return ''

  return date.length === validateFormat.length && isMatch(date, validateFormat)
}

export const isDateBefore = (date1: string, date2: string) => {
  return isBefore(date1, date2)
}

export const isDateAfter = (date1: string, date2: string) => {
  return isAfter(date1, date2)
}

export const isDateToday = (date1: string) => {
  return isToday(date1)
}

export const dateFormat = (
  date: string | undefined | null,
  dateFormat: FormatTypes,
  fromFormat?: FormatTypes
) => {
  if (!date) return ''

  if (dateFormat === DateFormatEnum.FullDate.value && date && typeof date === 'string') {
    date = date.substr(0, 10)
  }

  let dateToFormat: string | Date = date
  if (fromFormat) {
    dateToFormat = parse(date, fromFormat, new Date())
  }

  return datefnsFormat(dateToFormat, dateFormat)
}

