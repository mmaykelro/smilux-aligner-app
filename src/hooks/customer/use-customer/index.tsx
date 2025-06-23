'use client'

import { useState, useEffect } from 'react'
import { getCustomerAction } from '@/actions/customer'
import type { Customer } from '@/payload-types'

export default function useCustomer() {
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const data = await getCustomerAction()
        setCustomer(data as any)
      } catch (e) {
        setError(e as Error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomerData()
  }, [])

  return { customer, isLoading, error }
}
