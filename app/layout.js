import './globals.css'
import { Toaster } from 'sonner'
import { AuthProvider } from '../contexts/AuthContext'
import Script from 'next/script'
import AuthSessionHandler from './components/AuthSessionHandler'

export const metadata = {
  title: 'Zythorix360 - NEET & JEE Preparation Platform | Expert Study Materials',
  description: 'Master NEET & JEE with Zythorix360\'s comprehensive study materials, question banks, and practice tests. Expert-curated content for medical and engineering entrance exams.',
  keywords: 'NEET preparation, JEE preparation, Zythorix360, study materials, question bank, practice tests, medical entrance, engineering entrance, online learning',
  authors: [
    { name: 'Zythorix360 Team', url: 'https://www.zythorix360.com' }
  ],
  creator: 'Zythorix360',
  publisher: 'Zythorix360',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/logo.jpg', sizes: '512x512', type: 'image/jpeg' },
    ],
    shortcut: '/favicon.ico',
    apple: '/logo.jpg',
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/logo.jpg',
      },
    ],
  },
  alternates: {
    canonical: 'https://www.zythorix360.com',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.zythorix360.com/',
    title: 'Zythorix360 - NEET & JEE Preparation Platform',
    description: 'Complete study materials, question banks, and practice tests for NEET & JEE preparation.',
    siteName: 'Zythorix360',
    images: [
      {
        url: 'https://www.zythorix360.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'Zythorix360 - NEET & JEE Preparation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Zythorix360 - NEET & JEE Preparation',
    description: 'Complete study materials for NEET & JEE preparation',
    images: ['https://www.zythorix360.com/logo.png'],
  },
  verification: {
    google: 'your-google-verification-code',
  },
  category: 'education',
  other: {
    'revisit-after': '7 days',
    language: 'English',
  },
}

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD) for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Zythorix360',
    description: 'Comprehensive NEET & JEE preparation platform with expert study materials and practice tests',
    url: 'https://www.zythorix360.com',
    logo: 'https://www.zythorix360.com/logo.png',
    image: 'https://www.zythorix360.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'zythorix360@gmail.com',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'INR',
      lowPrice: '29',
      highPrice: '499',
      offerCount: '100',
    },
  }

  return (
    <html lang="en">
      <head>
        {/* Structured Data */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        
        <meta name="theme-color" content="#7c3aed" />
      </head>
      <body>

        <AuthProvider>
          <AuthSessionHandler />
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
