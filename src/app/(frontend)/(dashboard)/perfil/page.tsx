import React from 'react'
import PageHeader from '@/components/page-header'
import ProfileForm from '@/sections/profile'
import { getCustomerAction } from '@/actions/customer'

const PerfilPage: React.FC = async () => {
  const userData = await getCustomerAction()
  return (
    <>
      <PageHeader goBackLink="/" title="Perfil" description="Bem-vindo à sua página de perfil." />

      <div className="w-full flex gap-4 flex-col p-4   lg:p-6">
        <ProfileForm initialData={userData} />
      </div>
    </>
  )
}

export default PerfilPage
