import { Request } from '@/payload-types' // Use a interface que criamos antes
import { formatOrderId } from '@/utils/text'

/**
 * Cria um assunto dinâmico para o e-mail de atualização de status para o cliente.
 * @param {Request} doc - O documento populado da solicitação.
 * @returns {string} O assunto do e-mail.
 */
export const statusUpdateEmailSubject = (doc: Request): string => {
  const patientName = doc.patient || 'seu paciente'
  const orderId = doc.orderId ? ` ${formatOrderId(doc.orderId)}` : ''

  if (doc.tracking?.status === 'delivered') {
    return `✅ Pedido Entregue! - Pedido${orderId} para ${patientName}`
  }
  if (doc.tracking?.status === 'sent') {
    return `🚚 Seu Pedido foi Enviado! - Pedido${orderId}`
  }
  if (doc.tracking?.status === 'preparing') {
    return `📦 Preparando seu Pedido para Envio - Pedido${orderId}`
  }

  if (doc.payment?.status === 'paid') {
    return `💰 Pagamento Confirmado! - Pedido${orderId}`
  }

  if (doc.status === 'completed') {
    return `✅ Caso Finalizado! Próximo Passo: Pagamento - Pedido${orderId}`
  }

  if (doc.trackingLink) {
    return `🎉 Ação Necessária: Avalie o Planejamento Virtual de ${patientName}`
  }

  if (doc.status === 'in_progress') {
    return `Em Andamento: Planejamento Virtual para ${patientName}`
  }

  if (doc.status === 'documentation_check') {
    return `Solicitação Recebida: Verificando Documentação de ${patientName}`
  }

  return `Atualização sobre sua Solicitação${orderId}`
}

/**
 * Gera o corpo do e-mail em HTML para uma atualização de status da solicitação.
 * @param {Request} doc - O documento completo da solicitação.
 * @param {string} customerDashboardUrl - A URL base do dashboard do cliente (ex: 'https://seusite.com').
 * @returns {string} Uma string contendo o HTML do e-mail.
 */
export const statusUpdateEmailHTML = (doc: Request): string => {
  // --- Mapeamentos para texto legível ---
  const statusLabels = {
    documentation_check: 'Verificando documentação',
    in_progress: 'Em andamento (planejamento virtual)',
    completed: 'Caso finalizado',
  }
  const paymentStatusLabels = {
    not_paid: 'Não Pago',
    paid: 'Pagamento Realizado',
  }
  const trackingStatusLabels = {
    not_sent: 'Aguardando Envio',
    preparing: 'Em Preparação para Envio',
    sent: 'Enviado',
    delivered: 'Entregue',
  }

  const getUpdateMessage = (): string => {
    const patientName = `<strong>${doc.patient || 'seu paciente'}</strong>`

    if (doc.tracking?.status === 'delivered') {
      return `Ótima notícia! Confirmamos a entrega do seu pedido para o paciente ${patientName} no seu endereço cadastrado. Esperamos que esteja tudo certo e desejamos sucesso no tratamento!`
    }
    if (doc.tracking?.status === 'sent') {
      const trackingInfo = doc.tracking.trackingCode
        ? `Você pode acompanhar a entrega utilizando o código de rastreio: <strong>${doc.tracking.trackingCode}</strong>.`
        : 'Você pode acompanhar os detalhes do envio no seu painel.'
      return `Seu pedido para o paciente ${patientName} foi enviado! ${trackingInfo}`
    }
    if (doc.tracking?.status === 'preparing') {
      return `O pedido do paciente ${patientName} está sendo cuidadosamente preparado para o envio. Você receberá uma nova notificação com o código de rastreio assim que ele for despachado.`
    }

    if (doc.payment?.status === 'paid') {
      return `Recebemos a confirmação do seu pagamento para o caso do paciente ${patientName}. A produção dos seus alinhadores será iniciada. O próximo passo é a preparação para o envio!`
    }

    if (doc.status === 'completed') {
      return `Parabéns! O planejamento para o paciente ${patientName} foi concluído. Agora, o próximo passo é realizar o pagamento para que possamos iniciar a produção. Verifique os links de pagamento em seu painel.`
    }

    if (doc.trackingLink) {
      return `O planejamento virtual para o paciente ${patientName} está pronto para sua avaliação! Por favor, acesse o link disponível em seu painel para visualizar o setup e nos dar seu feedback.`
    }

    if (doc.status === 'in_progress') {
      return `Nossa equipe iniciou o planejamento virtual para o caso do paciente ${patientName}. Em breve, o link para visualização estará disponível para sua avaliação.`
    }

    if (doc.status === 'documentation_check') {
      return `Recebemos sua solicitação para o paciente ${patientName}. Nossa equipe está verificando toda a documentação enviada e em breve você receberá novas atualizações.`
    }

    return `Houve uma atualização na sua solicitação para o paciente ${patientName}. Veja os detalhes abaixo em seu painel.`
  }
  // --- Estilos CSS Inline ---
  const styles: { [key: string]: string } = {
    body: `font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f7; margin: 0; padding: 20px; color: #333;`,
    container: `max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;`,
    header: `background-color: #007bff; color: #ffffff; padding: 25px; text-align: center;`,
    headerTitle: `margin: 0; font-size: 24px;`,
    content: `padding: 30px;`,
    greeting: `font-size: 18px; line-height: 1.5;`,
    statusBox: `background-color: #e7f3ff; border-left: 4px solid #007bff; padding: 15px 20px; margin: 25px 0; font-size: 15px; line-height: 1.6;`,
    sectionTitle: `font-size: 18px; color: #1a1a1a; border-bottom: 2px solid #f0f0f0; padding-bottom: 8px; margin-top: 25px; margin-bottom: 15px;`,
    ctaButton: `display: inline-block; background-color: #28a745; color: #ffffff; padding: 12px 25px; text-align: center; text-decoration: none; border-radius: 5px; font-size: 16px; font-weight: bold;`,
    ctaContainer: `text-align: center; margin: 30px 0;`,
    summaryTable: `width: 100%; border-collapse: collapse; margin-top: 10px;`,
    summaryTdLabel: `padding: 8px; text-align: left; border-bottom: 1px solid #eee; font-weight: bold; color: #555;`,
    summaryTdValue: `padding: 8px; text-align: left; border-bottom: 1px solid #eee;`,
    footer: `text-align: center; padding: 20px; font-size: 12px; color: #888888;`,
  }

  //@ts-ignore
  const customerName = doc?.customer?.name

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Atualização da Solicitação</title>
    </head>
    <body style="${styles.body}">
      <div style="${styles.container}">
        <div style="${styles.header}">
          <h1 style="${styles.headerTitle}">Atualização da sua Solicitação</h1>
        </div>
        <div style="${styles.content}">
          <p style="${styles.greeting}">Olá, Dr(a). ${customerName},</p>
          
          <div style="${styles.statusBox}">
            ${getUpdateMessage()}
          </div>

          <h2 style="${styles.sectionTitle}">Resumo do Pedido</h2>
          
          <table style="${styles.summaryTable}">
            <tbody>
              <tr>
                <td style="${styles.summaryTdLabel}">Paciente:</td>
                <td style="${styles.summaryTdValue}">${doc.patient}</td>
              </tr>
              <tr>
                <td style="${styles.summaryTdLabel}">ID do Pedido:</td>
                <td style="${styles.summaryTdValue}">${doc.orderId ? formatOrderId(doc.orderId) : 'Aguardando Conclusão'}</td>
              </tr>
              <tr>
                <td style="${styles.summaryTdLabel}">Status do Caso:</td>
                <td style="${styles.summaryTdValue}"><strong>${statusLabels[doc.status] || doc.status}</strong></td>
              </tr>
              <tr>
                <td style="${styles.summaryTdLabel}">Status do Pagamento:</td>
                <td style="${styles.summaryTdValue}">${paymentStatusLabels[doc.payment?.status] || 'N/A'}</td>
              </tr>
              <tr>
                <td style="${styles.summaryTdLabel}">Status do Envio:</td>
                <td style="${styles.summaryTdValue}">${trackingStatusLabels[doc.tracking?.status] || 'N/A'}</td>
              </tr>
            </tbody>
          </table>

        </div>
        <div style="${styles.footer}">
          <p>Atenciosamente,<br>Equipe [Nome da Sua Empresa]</p>
        </div>
      </div>
    </body>
    </html>
  `
}
