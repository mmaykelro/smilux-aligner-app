/**
 * Navega de forma segura em um objeto aninhado usando um caminho de string (ex: 'user.address.street').
 * É uma alternativa type-safe e sem dependências ao lodash.get.
 *
 * @param obj O objeto no qual navegar.
 * @param path O caminho para a propriedade desejada.
 * @returns O valor encontrado ou `undefined` se o caminho não existir ou for inválido.
 */
export const getNestedValue = <T extends object>(
  obj: T | null | undefined,
  path: string,
): unknown => {
  if (obj == null || !path) {
    return undefined
  }

  const parts = path.split('.')

  let current: any = obj

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined
    }
    current = current[part]
  }

  return current
}

export function smoothFocus(element: HTMLElement) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'center',
  })

  setTimeout(() => {
    element.focus({ preventScroll: true })
  }, 300)
}
