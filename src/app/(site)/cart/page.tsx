import type { Metadata } from 'next'
import { EnquiryList } from '@/features/cart/EnquiryList'

export const metadata: Metadata = {
  title: 'Enquiry list',
  description: 'The models and parts you have collected for a quote request.',
  robots: { index: false, follow: true },
}

export default function CartPage() {
  return <EnquiryList />
}
