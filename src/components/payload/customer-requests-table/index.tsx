'use client'
import { useParams } from 'next/navigation'
import React, { useEffect, useTransition } from 'react'
import { Button } from '@payloadcms/ui'
import Link from 'next/link'

const getStatusLabel = (statusValue: string): string => {
  switch (statusValue) {
    case 'documentation_check':
      return 'Verificando Documentação'
    case 'in_progress':
      return 'Em Andamento'
    case 'completed':
      return 'Caso Finalizado'
    default:
      return statusValue
  }
}

// Estilos básicos para a tabela (opcional, mas recomendado)
const tableStyle: React.CSSProperties = {
  width: '100%',
  marginTop: '10px',
  borderCollapse: 'collapse',
}
const thStyle: React.CSSProperties = {
  borderBottom: '2px solid #E1E1E1',
  padding: '8px',
  textAlign: 'left',
  fontWeight: '600',
}
const tdStyle: React.CSSProperties = {
  borderBottom: '1px solid #F0F0F0',
  padding: '12px 8px',
}

type Request = {
  id: string
  patient: string
  status: string
  createdAt: string
}

export const CustomerRequestsList: React.FC<{ path: string }> = () => {
  const [requests, setRequests] = React.useState<Request[]>([])
  const params = useParams()

  const [isLoading, startTransition] = useTransition()

  useEffect(() => {
    ;(async () => {
      startTransition(async () => {
        try {
          const customerId = params?.segments?.[2]

          const query = `where[customer][equals]=${customerId}`

          const requests = await fetch(`/api/requests?${query}`).then(async (result) =>
            result.json(),
          )

          setRequests(requests?.docs)
        } catch {}
      })
    })()
  }, [params])

  if (isLoading) {
    return <div>Carregando prescrições...</div>
  }

  return (
    <div>
      <h3 style={{ marginBottom: 0 }}>Prescrições Associadas</h3>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Nome do Paciente</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Data de Criação</th>
            <th style={thStyle}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id}>
              <td style={tdStyle}>{req.patient}</td>
              <td style={tdStyle}>
                <span className={`status--${req?.status}`}>{getStatusLabel(req?.status)}</span>
              </td>
              <td style={tdStyle}>{new Date(req?.createdAt).toLocaleDateString('pt-BR')}</td>
              <td style={tdStyle}>
                <Link href={`/admin/collections/requests/${req.id}`}>
                  <Button buttonStyle="primary" size="small">
                    Visualizar
                  </Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
