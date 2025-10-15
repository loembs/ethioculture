// =============================================
// SERVICE PAIEMENT - FLUTTERWAVE
// =============================================
import { supabase } from '@/config/supabase'

export const paymentService = {
  // Initier un paiement Flutterwave
  async initiatePayment(paymentData: {
    order_number: string
    amount: number
    customer_email: string
    customer_name: string
    customer_phone: string
  }) {
    const { data, error } = await supabase.functions.invoke('initiate-payment', {
      body: paymentData
    })

    if (error) throw error
    return data
  },

  // Vérifier le statut d'un paiement
  async checkPaymentStatus(orderNumber: string) {
    const { data, error } = await supabase
      .from('ethio_orders')
      .select('payment_status, status')
      .eq('order_number', orderNumber)
      .single()

    if (error) throw error
    return data
  },

  // Rediriger vers la page de paiement
  redirectToPayment(paymentUrl: string) {
    window.location.href = paymentUrl
  }
}

