export function getInitials(fullName: string): string {
  if (!fullName) return ''

  const words = fullName.trim().split(/\s+/)

  const firstInitial = words[0]?.charAt(0).toUpperCase() ?? ''
  const lastInitial = words.length > 1 ? words[words.length - 1]?.charAt(0).toUpperCase() : ''

  return firstInitial + lastInitial
}
