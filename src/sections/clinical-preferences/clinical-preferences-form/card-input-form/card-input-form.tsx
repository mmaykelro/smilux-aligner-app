import { PropsWithChildren } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  title: string
  description: string
} & PropsWithChildren

export default function CardInputForm({ title, description, children }: Props) {
  return (
    <Card className="shadow-sm border-0">
      <CardHeader className="text-start">
        <CardTitle className="text-xl text-gray-900">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  )
}
