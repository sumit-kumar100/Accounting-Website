import { format } from 'date-fns'

export function fDate(date) {
  try {
    return format(new Date(date), 'dd MMMM yyyy')
  } catch (e) { return date }
}

export function formatDate(date) {
  return format(new Date(date), "yyyy-MM-dd")
}

export function formatDate2(date) {
  return format(new Date(date), "dd-MM-yyyy")
}
