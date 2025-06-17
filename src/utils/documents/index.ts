export function validateCPF(cpf: string | null | undefined): boolean {
  if (typeof cpf !== 'string') return false

  const cleanedCPF = cpf.replace(/[^\d]/g, '')

  if (cleanedCPF.length !== 11) return false

  if (/^(\d)\1{10}$/.test(cleanedCPF)) return false

  let sum = 0
  let remainder: number

  for (let i = 1; i <= 9; i++) {
    sum = sum + parseInt(cleanedCPF.substring(i - 1, i)) * (11 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanedCPF.substring(9, 10))) {
    return false
  }

  sum = 0
  for (let i = 1; i <= 10; i++) {
    sum = sum + parseInt(cleanedCPF.substring(i - 1, i)) * (12 - i)
  }
  remainder = (sum * 10) % 11
  if (remainder === 10 || remainder === 11) {
    remainder = 0
  }
  if (remainder !== parseInt(cleanedCPF.substring(10, 11))) {
    return false
  }

  return true
}
