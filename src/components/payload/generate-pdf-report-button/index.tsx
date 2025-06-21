'use client'
import React, { useTransition } from 'react'
import { useParams } from 'next/navigation'
import jsPDF from 'jspdf'
import { Button } from '@payloadcms/ui'
import { toast } from 'sonner'
import { statusOptions } from '@/constants/requests'
import { formatOrderId } from '@/utils/text'

let y: number

const addSectionTitle = (doc: jsPDF, title: string) => {
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(title, 20, y)
  doc.setLineWidth(0.5)
  doc.line(20, y + 2, 190, y + 2)
  y += 10
}

const addInfoRow = (doc: jsPDF, label: string, value: any) => {
  if (y > 270) {
    doc.addPage()
    y = 20
  }

  if (
    value === null ||
    value === undefined ||
    value === '' ||
    (Array.isArray(value) && value.length === 0)
  ) {
    value = 'Não informado'
  }

  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(label + ': ', 20, y)

  const labelWidth = doc.getTextWidth(label + ': ')
  doc.setFont('helvetica', 'normal')

  const splitText = doc.splitTextToSize(String(value), 190 - 20 - labelWidth)
  doc.text(splitText, 20 + labelWidth, y)

  y += splitText.length * 5
}

const getLabelFromValue = (options: { label: string; value: string }[], value: string) => {
  const option = options.find((opt) => opt.value === value)
  return option ? option.label : value
}

export const GeneratePdfReportButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = () => {
  const params = useParams()

  const id = params?.segments?.[2]

  const [isLoading, startTransition] = useTransition()

  function handleGenerateReport() {
    startTransition(async () => {
      try {
        const query = `where[id][equals]=${id}`

        const request = await fetch(`/api/requests?${query}`).then(async (result) => result.json())

        const [requestData] = request?.docs

        const user = requestData?.customer

        const doc = new jsPDF()
        y = 20

        // --- CABEÇALHO ---
        doc.setFontSize(20)
        doc.text(
          `Relatório de Solicitação  ${requestData.orderId ? formatOrderId(requestData.orderId) : 'N/A'}`,
          105,
          y,
          {
            align: 'center',
          },
        )
        y += 15

        // --- INFORMAÇÕES GERAIS ---
        addSectionTitle(doc, 'Informações Gerais')
        addInfoRow(doc, 'Paciente', requestData.patient)
        addInfoRow(doc, 'Doutor(a)', requestData.customer?.name || 'Não informado')
        addInfoRow(
          doc,
          'Status da Prescrição',
          getLabelFromValue(statusOptions, requestData.status),
        )
        addInfoRow(
          doc,
          'Data de Conclusão',
          requestData.completionDate
            ? new Date(requestData.completionDate).toLocaleString('pt-BR')
            : 'N/A',
        )
        y += 5

        const prefs = user?.clinicalPreferences

        if (prefs) {
          addSectionTitle(doc, 'Preferências Clínicas do Doutor(a)')

          const passiveAlignersOptions = [
            { label: 'Sim, adicione', value: 'sim_adicione' },
            { label: 'Não adicione', value: 'nao_adicione' },
          ]
          const delayStageOptions = [
            { label: 'A partir do estágio 1', value: 'estagio_1' },
            { label: 'A partir do estágio 2', value: 'estagio_2' },
            { label: 'A partir do estágio 3', value: 'estagio_3' },
            { label: 'A partir do estágio 4', value: 'estagio_4' },
          ]
          const incisalLevelingOptions = [
            { label: 'Sim, nivelar borda incisal', value: 'nivelar_borda' },
            { label: 'Não nivelar borda incisal', value: 'nao_nivelar' },
          ]
          const elasticChainOptions = [
            { label: 'Sim', value: 'sim' },
            { label: 'Não', value: 'nao' },
          ]
          const distalizationOptions = [
            { label: 'Sequencial (50% do movimento)', value: 'sequencial_50' },
            { label: 'Em bloco (até 2mm)', value: 'em_bloco_ate_2mm' },
          ]

          addInfoRow(
            doc,
            'Alinhadores passivos',
            getLabelFromValue(passiveAlignersOptions, prefs?.passiveAligners || ''),
          )
          addInfoRow(
            doc,
            'Atrasar início do IPR',
            getLabelFromValue(delayStageOptions, prefs?.delayIPRStage || ''),
          )
          addInfoRow(doc, 'IPR máximo por face (mm)', prefs.maxIPR)
          addInfoRow(
            doc,
            'Atrasar início dos Attachments',
            getLabelFromValue(delayStageOptions, prefs?.delayAttachmentStage || ''),
          )
          addInfoRow(
            doc,
            'Nivelamento de borda incisal',
            getLabelFromValue(incisalLevelingOptions, prefs?.incisalLeveling || ''),
          )
          addInfoRow(
            doc,
            'Cadeia elástica virtual',
            getLabelFromValue(elasticChainOptions, prefs?.elasticChain || ''),
          )
          addInfoRow(
            doc,
            'Opções de distalização',
            getLabelFromValue(distalizationOptions, prefs?.distalizationOptions || ''),
          )
          addInfoRow(doc, 'Posições para elásticos', prefs.elasticPositions?.join(', '))
          addInfoRow(doc, 'Instruções especiais', prefs.specialInstructions)
          y += 5
        }

        // --- DEFINIÇÕES DO TRATAMENTO ---
        addSectionTitle(doc, 'Definições do Tratamento')
        const archToTreatOptions = [
          { label: 'Nenhum', value: 'none' },
          { label: 'Ambos', value: 'both' },
          { label: 'Superior', value: 'upper' },
          { label: 'Inferior', value: 'lower' },
        ]
        addInfoRow(
          doc,
          'Tratar arcada',
          getLabelFromValue(archToTreatOptions, requestData.archToTreat),
        )
        addInfoRow(
          doc,
          'Restrição de Movimento (Superior)',
          requestData.upperJawMovementRestriction?.join(', '),
        )
        addInfoRow(
          doc,
          'Restrição de Movimento (Inferior)',
          requestData.lowerJawMovementRestriction?.join(', '),
        )
        y += 5

        // --- RELAÇÃO A-P E ELÁSTICOS ---
        addSectionTitle(doc, 'Relação A-P e Elásticos')
        const apRelationOptions = [
          { label: 'Melhorar relação de canino', value: 'improve_canine' },
          { label: 'Melhorar relação de canino e molar', value: 'improve_canine_and_molar' },
          { label: 'Melhorar relação de molar', value: 'improve_molar' },
          { label: 'Nenhuma', value: 'none' },
        ]
        addInfoRow(
          doc,
          'Relação A-P (Superior)',
          getLabelFromValue(apRelationOptions, requestData.apRelationUpper),
        )
        addInfoRow(
          doc,
          'Relação A-P (Inferior)',
          getLabelFromValue(apRelationOptions, requestData.apRelationLower),
        )
        addInfoRow(doc, 'Instruções de Distalização', requestData.distalizationInstructions)
        if (requestData.elasticCutouts) {
          const elasticOptions = [
            { label: 'Direito', value: 'right' },
            { label: 'Esquerdo', value: 'left' },
            { label: 'Ambos', value: 'both' },
            { label: 'Nenhum', value: 'none' },
          ]
          y += 3
          doc
            .setFontSize(10)
            .setFont('helvetica', 'bold')
            .text('Recortes para Elásticos/Botões:', 20, y)
          y += 6
          addInfoRow(
            doc,
            '  • Elástico no canino',
            getLabelFromValue(elasticOptions, requestData.elasticCutouts.canineElastic),
          )
          addInfoRow(
            doc,
            '  • Botão no canino',
            getLabelFromValue(elasticOptions, requestData.elasticCutouts.canineButton),
          )
          addInfoRow(
            doc,
            '  • Elástico no molar',
            getLabelFromValue(elasticOptions, requestData.elasticCutouts.molarElastic),
          )
          addInfoRow(
            doc,
            '  • Botão no molar',
            getLabelFromValue(elasticOptions, requestData.elasticCutouts.molarButton),
          )
        }
        addInfoRow(doc, 'Instruções de Recortes', requestData.elasticCutoutInstructions)
        y += 5

        // --- ATTACHMENTS E IPR ---
        addSectionTitle(doc, 'Attachments e IPR')
        addInfoRow(
          doc,
          'Usar Attachments',
          requestData.useAttachments === 'yes' ? 'Sim. Conforme necessário.' : 'Não',
        )
        addInfoRow(
          doc,
          'Não colocar attachments (Superior)',
          requestData.upperJawNoAttachments?.join(', '),
        )
        addInfoRow(
          doc,
          'Não colocar attachments (Inferior)',
          requestData.lowerJawNoAttachments?.join(', '),
        )
        const iprOptions = [
          { label: 'Sim. Conforme necessário (Limite de 0,5mm).', value: 'yes' },
          { label: 'Não', value: 'no' },
          { label: 'Detalhar IPR abaixo', value: 'detail_below' },
        ]
        addInfoRow(doc, 'Fazer IPR', getLabelFromValue(iprOptions, requestData.performIPR))
        addInfoRow(doc, 'Detalhes do IPR', requestData.iprDetails)
        y += 5

        // --- INSTRUÇÕES FINAIS ---
        addSectionTitle(doc, 'Instruções Finais')
        addInfoRow(doc, 'Instruções para Diastemas', requestData.diastemaInstructions)
        addInfoRow(doc, 'Orientações Gerais de Tratamento', requestData.generalInstructions)
        addInfoRow(
          doc,
          'Enviar link no WhatsApp',
          requestData.sendWhatsappLink === 'yes'
            ? `Sim (${requestData.whatsappNumber || 'N/A'})`
            : 'Não',
        )
        addInfoRow(doc, 'Informações Adicionais', requestData.additionalInfo)
        y += 5

        doc.save(`relatorio-completo-${requestData.orderId || requestData.id}.pdf`)

        toast.success('Relatório da solicitação gerado com sucesso!')

        toast.success('Relatório da solicitação derado com sucesso!')
      } catch {
        toast.error('Ocorreu um erro ao tentar gerar o relaório da solicitação')
      }
    })
  }

  return (
    <Button disabled={isLoading} onClick={handleGenerateReport}>
      Gerar relatório em PDF
    </Button>
  )
}
