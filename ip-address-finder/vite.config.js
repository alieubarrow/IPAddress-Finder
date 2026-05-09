import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const ipApiFields = [
  'status',
  'message',
  'query',
  'country',
  'countryCode',
  'region',
  'regionName',
  'city',
  'zip',
  'lat',
  'lon',
  'timezone',
  'isp',
  'org',
  'as',
  'reverse',
  'mobile',
  'proxy',
  'hosting',
].join(',')

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/lookup': {
        target: 'http://ip-api.com',
        changeOrigin: true,
        rewrite: (path) => {
          const url = new URL(path, 'http://localhost')
          const ip = url.searchParams.get('ip') || ''

          return `/json/${encodeURIComponent(ip)}?fields=${ipApiFields}`
        },
      },
    },
  },
})
