export const validateUrl = (value: string | undefined | null): boolean | string => {
  if (!value) {
    return true
  }
  try {
    new URL(value)
    return true
  } catch (error) {
    return 'Por favor, insira uma URL válida (ex: https://exemplo.com).'
  }
}
