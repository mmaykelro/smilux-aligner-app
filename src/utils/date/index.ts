export function formatDate(isoString: string): string {
  const data = new Date(isoString)
  const dia = String(data.getDate()).padStart(2, '0')
  const mes = String(data.getMonth() + 1).padStart(2, '0')
  const ano = data.getFullYear()
  return `${dia}/${mes}/${ano}`
}

export function parseDateForQuery(dateString: string): string | null {
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  const [day, month, year] = parts
  return `${year}-${month}-${day}`
}

export function getNextDay(dateString: string): string {
  const date = new Date(dateString)
  date.setUTCDate(date.getUTCDate() + 1)
  return date.toISOString().split('T')[0]
}
