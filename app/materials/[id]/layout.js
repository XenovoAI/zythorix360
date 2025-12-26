import { createClient } from '@supabase/supabase-js'

export async function generateMetadata({ params }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const { data: material } = await supabase
    .from('materials')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!material) {
    return {
      title: 'Material Not Found | Zythorix360',
      description: 'The requested material could not be found.'
    }
  }

  const price = material.is_free ? 'FREE' : `₹${material.price}`

  return {
    title: `${material.title} | Zythorix360`,
    description: material.description || `${material.subject} study material for ${material.exam_type || 'NEET/JEE'} preparation. ${price}`,
    openGraph: {
      title: material.title,
      description: material.description || `${material.subject} study material - ${price}`,
      images: material.thumbnail_url ? [material.thumbnail_url] : [],
      type: 'website',
      siteName: 'Zythorix360'
    },
    twitter: {
      card: 'summary_large_image',
      title: material.title,
      description: material.description || `${material.subject} study material - ${price}`,
      images: material.thumbnail_url ? [material.thumbnail_url] : []
    }
  }
}

export default function MaterialLayout({ children }) {
  return children
}
