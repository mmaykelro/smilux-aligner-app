import React from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import LoginForm from '@/sections/auth/login-form'
import RegisterForm from '@/sections/auth/register-form'
import { getTermsConditions } from '@/actions/terms-conditions'

const LoginPage = async () => {
  const termsContitions = await getTermsConditions()

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image
            src="/images/logo.png"
            alt="Smilux Aligner"
            width={200}
            height={80}
            className="mx-auto mb-4"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Seja bem-vindo(a) à Smilux alinhadores
          </h1>
          <p className="text-gray-600">Criado por ortodontista, pensado para ortodontistas.</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-gray-900">Acesse sua conta</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entre com suas credenciais ou crie uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 ">
                <TabsTrigger value="login" className="text-sm">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="text-sm">
                  Cadastrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <LoginForm />
              </TabsContent>

              <TabsContent value="register">
                <RegisterForm
                  termsConditions={termsContitions.content}
                  showTerms={termsContitions?.showTerms as boolean}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default LoginPage
