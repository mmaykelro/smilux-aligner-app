interface Customer {
  id: string
  name: string
  email: string
  cpf: string
  phone: string
  cro: {
    number: string
    state: string
  }
  address: {
    postalCode: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
  isActive?: boolean
}

/**
 * Cria um assunto (subject) para o e-mail de notificação do administrador sobre um novo cadastro.
 * @param {Customer} doc - O documento do novo cliente cadastrado.
 * @returns {string} O assunto do e-mail para o administrador.
 */
export const createUserNotificationSubject = (doc: Customer): string => {
  return `Novo Cadastro para Aprovação: Dr(a). ${doc.name}`
}

/**
 * Gera o corpo do e-mail em HTML para notificar o administrador sobre um novo cadastro pendente.
 * @param {Customer} doc - O documento completo do novo cliente.
 * @param {string} adminUrl - A URL base do painel de administração (ex: 'https://seusite.com/admin').
 * @returns {string} Uma string contendo o HTML do e-mail.
 */
export const createUserNotificationHTML = (doc: Customer, adminUrl: string): string => {
  // --- Estilos CSS Inline ---
  const styles: { [key: string]: string } = {
    body: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;`,
    container: `max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;`,
    header: `background-color: #333745; color: #ffffff; padding: 20px; text-align: center;`,
    headerTitle: `margin: 0; font-size: 24px;`,
    content: `padding: 30px;`,
    introText: `font-size: 16px; line-height: 1.5; margin-bottom: 25px;`,
    ctaButton: `display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 25px; text-align: center; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;`,
    ctaContainer: `text-align: center; margin: 30px 0;`,
    sectionTitle: `font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 30px; margin-bottom: 20px;`,
    fieldGroup: `margin-bottom: 15px;`,
    label: `font-weight: bold; color: #555555; display: block; margin-bottom: 5px;`,
    value: `color: #333333;`,
    footer: `text-align: center; padding: 20px; font-size: 12px; color: #888888;`,
  }

  const customerProfileUrl = `${adminUrl}/collections/customers/${doc.id}`

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Novo Cadastro para Aprovação</title>
    </head>
    <body style="${styles.body}">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerTitle}">Novo Cadastro Recebido</h1>
        </div>
        <div style="${styles.content}">
          <p style="${styles.introText}">Um novo cliente se cadastrou na plataforma e está aguardando aprovação para ativar o acesso.</p>

          <h2 style="${styles.sectionTitle}">Dados do Novo Cliente</h2>
          
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Nome Completo:</span>
            <span style="${styles.value}">${doc.name}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">E-mail:</span>
            <span style="${styles.value}">${doc.email}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">CPF:</span>
            <span style="${styles.value}">${doc.cpf}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Telefone:</span>
            <span style="${styles.value}">${doc.phone}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">CRO:</span>
            <span style="${styles.value}">${doc.cro.number} - ${doc.cro.state}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Endereço:</span>
            <span style="${styles.value}">
              ${doc.address.street}, ${doc.address.number}${doc.address.complement ? `, ${doc.address.complement}` : ''}<br>
              ${doc.address.neighborhood} - ${doc.address.city}, ${doc.address.state}<br>
              CEP: ${doc.address.postalCode}
            </span>
          </div>

          <div style="${styles.ctaContainer}">
            <a href="${customerProfileUrl}" style="${styles.ctaButton}" target="_blank">Revisar e Aprovar Cadastro</a>
          </div>
          
          <p style="text-align: center; font-size: 14px;">Ao aprovar o cadastro, lembre-se de marcar o cliente como "Ativo" para liberar o acesso à plataforma.</p>
        </div>
        <div style="${styles.footer}">
          <p>Este é um e-mail de notificação automática do sistema.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
