import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RequestCardProps {
  title: string
  amount?: number
  icon: string
}

const RequestCard: React.FC<RequestCardProps> = ({ title, amount = 0, icon }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex justify-between">
      <div className="text-2xl font-bold">{amount}</div>
      <Image src={`/icons/${icon}.svg`} alt="Ícone" width={50} height={50} />
    </CardContent>
  </Card>
)

export default RequestCard
