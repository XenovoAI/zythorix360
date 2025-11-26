export default function manifest() {
  return {
    name: 'Zythorix360 - NEET & JEE Preparation Platform',
    short_name: 'Zythorix360',
    description: 'Comprehensive NEET & JEE preparation platform with expert study materials and practice tests',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#7c3aed',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['education', 'learning'],
    shortcuts: [
      {
        name: 'Study Materials',
        short_name: 'Materials',
        description: 'Access study materials',
        url: '/materials',
      },
      {
        name: 'Practice Tests',
        short_name: 'Tests',
        description: 'Take practice tests',
        url: '/tests',
      },
    ],
  }
}
