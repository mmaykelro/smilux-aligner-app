import PageHeader from '@/components/page-header'
import ClinicalPreferencesForm from '@/sections/clinical-preferences/clinical-preferences-form'
import { getCustomerAction } from '@/actions/customer'

export default async function PreferenciasClinicasPage() {
  const userData = await getCustomerAction()

  return (
    <>
      <PageHeader
        goBackLink="/"
        title="Preferências Clínicas"
        description="Gerencie suas preferências clínicas de configurações de tratamento"
      />

      <div className="flex gap-4 flex-col p-4 lg:py-6 lg:px-20">
        <ClinicalPreferencesForm defaultValues={userData.clinicalPreferences} />
      </div>
    </>
  )
}
