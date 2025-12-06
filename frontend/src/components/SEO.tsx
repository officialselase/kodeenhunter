import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  keywords?: string[]
}

const SEO = ({
  title = 'Kodeen Hunter - Professional Videographer',
  description = 'Crafting visual stories that captivate and inspire. Professional videography for music videos, commercials, and creative projects.',
  image = '/og-image.jpg',
  url = 'https://kodeenhunter.com',
  type = 'website',
  keywords = ['videographer', 'cinematographer', 'music videos', 'commercial videography', 'creative director'],
}: SEOProps) => {
  const fullTitle = title.includes('Kodeen Hunter') ? title : `${title} | Kodeen Hunter`
  const fullUrl = url.startsWith('http') ? url : `https://kodeenhunter.com${url}`
  const fullImage = image.startsWith('http') ? image : `https://kodeenhunter.com${image}`

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:site_name" content="Kodeen Hunter" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullImage} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Helmet>
  )
}

export default SEO
