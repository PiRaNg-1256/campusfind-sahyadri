
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'sonner'
import ToastListener from '@/components/ToastListener'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'CampusFind - Sahyadri College',
  description: 'Official Lost & Found Portal for Sahyadri College of Engineering & Management',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-background font-sans text-foreground flex flex-col`}>
        <Toaster position="top-center" richColors />
        <Suspense fallback={null}>
          <ToastListener />
        </Suspense>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
