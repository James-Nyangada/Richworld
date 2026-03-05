'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || '';

function PaymentVerifier() {
  const searchParams = useSearchParams()
  const reference = searchParams.get('reference') || searchParams.get('trxref')
  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'failed'
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!reference) {
      setStatus('failed')
      setMessage('No payment reference found.')
      return
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch(`${API}/api/payments/verify/${reference}`)
        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          setMessage(data.message || 'Payment verified successfully!')
        } else {
          setStatus('failed')
          setMessage(data.error || 'Payment verification failed.')
        }
      } catch (err) {
        console.error('Verification error:', err)
        setStatus('failed')
        setMessage('Could not verify payment. Please contact support.')
      }
    }

    verifyPayment()
  }, [reference])

  return (
    <>
      {status === 'verifying' && (
        <>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6 animate-pulse">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
          <p className="text-gray-600 mb-8">
            Please wait while we confirm your payment.
          </p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-8">
            Thank you for your booking. Your payment has been confirmed and a confirmation email has been sent.
          </p>
        </>
      )}

      {status === 'failed' && (
        <>
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Issue</h2>
          <p className="text-gray-600 mb-8">
            {message || 'Something went wrong. Please contact support.'}
          </p>
        </>
      )}

      <Link 
        href="/"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        Return to Home
      </Link>
    </>
  )
}

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <Suspense fallback={
          <>
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-6 animate-pulse">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          </>
        }>
          <PaymentVerifier />
        </Suspense>
      </div>
    </div>
  )
}
