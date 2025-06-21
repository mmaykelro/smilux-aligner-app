import { Request } from '@/payload-types'

/**
 * Cria um assunto para o e-mail que notifica o admin sobre a aprovação de um planejamento.
 * @param {Request} doc - O documento da solicitação que foi aprovada.
 * @returns {string} O assunto do e-mail.
 */
export const approveRequestAdminSubject = (doc: Request): string => {
  //@ts-ignore
  const doctorName = doc.customer.name
  const patientName = doc.patient
  return `✅ Planejamento Aprovado: Dr(a). ${doctorName} para ${patientName}`
}

/**
 * Gera o corpo do e-mail em HTML para notificar o admin sobre a aprovação de um planejamento.
 * @param {Request} doc - O documento completo da solicitação aprovada.
 * @returns {string} Uma string contendo o HTML do e-mail.
 */
export const approveRequestAdminHTML = (doc: Request): string => {
  // --- Estilos CSS Inline ---
  const styles: { [key: string]: string } = {
    body: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;`,
    container: `max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;`,
    header: `background-color: #28a745; color: #ffffff; padding: 25px; text-align: center;`,
    headerTitle: `margin: 0; font-size: 24px;`,
    content: `padding: 30px;`,
    introText: `font-size: 16px; line-height: 1.5; margin-bottom: 25px;`,
    ctaButton: `display: inline-block; background-color: #007bff; color: #ffffff; padding: 12px 25px; text-align: center; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;`,
    ctaContainer: `text-align: center; margin: 30px 0;`,
    sectionTitle: `font-size: 20px; color: #1a1a1a; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 25px; margin-bottom: 20px;`,
    fieldGroup: `margin-bottom: 15px;`,
    label: `font-weight: bold; color: #555555;`,
    value: `color: #333333;`,
    nextStepsBox: `background-color: #f8f9fa; border: 1px solid #dee2e6; padding: 20px; border-radius: 5px; margin-top: 20px;`,
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Planejamento Aprovado</title>
    </head>
    <body style="${styles.body}">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerTitle}">Planejamento Aprovado!</h1>
        </div>
        <div style="${styles.content}">
          <p style="${styles.introText}">
            
            O <strong>Dr(a). ${
              //@ts-ignore
              doc.customer.name
            }</strong> aprovou o planejamento virtual para o paciente <strong>${doc.patient}</strong>.
          </p>

          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">ID do Pedido:</span>
            <span style="${styles.value}">${doc.orderId ? ` #${doc.orderId}` : ' (Ainda não gerado)'}</span>
          </div>
          <div style="${styles.fieldGroup}">
            <span style="${styles.label}">Data da Aprovação:</span>
            <span style="${styles.value}">${new Date().toLocaleString('pt-BR')}</span>
          </div>
         

          <div style="${styles.nextStepsBox}">
            <h3 style="margin-top: 0; color: #333;">Próximos Passos Sugeridos:</h3>
            <ol style="margin: 0; padding-left: 20px;">
              <li style="margin-bottom: 10px;">Verificar se o status da solicitação foi atualizado para "Concluído".</li>
              <li style="margin-bottom: 10px;">Gerenciar o pagamento, enviando os links para o cliente, se necessário.</li>
              <li>Aguardar a confirmação do pagamento para iniciar a produção.</li>
            </ol>
          </div>
        </div>
        <div style="text-align: center; padding: 20px; font-size: 12px; color: #888888;">
          <p>Este é um e-mail de notificação automática do sistema.</p>
        </div>
      </div>
    </body>
    </html>
  `
}
