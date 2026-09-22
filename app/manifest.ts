import type { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Finance Tracker',
    short_name: 'Finance',
    description: 'A Progressive Web App for tracking your finances',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    screenshots: [
      {
        src: "/finance-wide.png",
        sizes: "1280x720",
        type: "image/png",
        form_factor: "wide",
      },
      {
        src: "/finance-mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
      },
    ],
    icons: [
      {
        src: '/finance-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/finance-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}