interface CEPAddress {
  cep: string
  logradouro: string // Rua, avenida, etc.
  complemento: string
  bairro: string
  localidade: string // Cidade
  uf: string // Estado (sigla)
  ibge: string
  gia: string
  ddd: string
  siafi: string
  erro?: boolean // ViaCEP retorna esta propriedade se o CEP não for encontrado
}

/**
 * Busca um endereço com base em um CEP (Código de Endereçamento Postal).
 * Usa a API pública ViaCEP.
 *
 * @param cep O CEP a ser consultado (pode conter máscara, ex: "12345-678").
 * @returns Uma Promise que resolve com os dados do endereço.
 * @throws {Error} Se o CEP for inválido, não for encontrado, ou se ocorrer um erro de rede.
 */
export const getAddressByCEP = async (cep: string): Promise<CEPAddress> => {
  const cleanedCep = cep.replace(/\D/g, '')

  if (cleanedCep.length !== 8) {
    throw new Error('Formato de CEP inválido. O CEP deve conter 8 dígitos.')
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanedCep}/json/`)

    if (!response.ok) {
      throw new Error('Não foi possível buscar o CEP. Tente novamente.')
    }

    const data: CEPAddress = await response.json()

    if (data.erro) {
      throw new Error('CEP não encontrado.')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('Ocorreu um erro desconhecido ao buscar o CEP.')
  }
}
