export function getInitials(fullName: string): string {
  if (!fullName) return ''

  const words = fullName.trim().split(/\s+/)

  const firstInitial = words[0]?.charAt(0).toUpperCase() ?? ''
  const lastInitial = words.length > 1 ? words[words.length - 1]?.charAt(0).toUpperCase() : ''

  return firstInitial + lastInitial
}

/**
 * Formata um número para ter 5 dígitos com zeros à esquerda e um '#' no início.
 * Ex: 25 -> '#00025', 12345 -> '#12345'
 *
 * @param {number} num - O número a ser formatado.
 * @returns {string} O número formatado como uma string.
 */
export function formatOrderId(num: number): string {
  // 1. Converte o número para uma string.
  const numAsString = String(num)

  // 2. Preenche com '0' à esquerda até a string ter 5 caracteres.
  const paddedNumber = numAsString.padStart(5, '0')

  // 3. Adiciona o '#' no início.
  return `#${paddedNumber}`
}
