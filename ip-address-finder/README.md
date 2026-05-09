# IP Address Finder

React + Vite app for looking up IP address location and network details.

## Local development

```bash
npm install
npm run dev
```

## Vercel deployment

Use these settings when importing the project into Vercel:

- Framework Preset: `Vite`
- Root Directory: `ip-address-finder` if deploying from this repository root
- Build Command: `npm run build`
- Output Directory: `dist`

The app uses HTTPS-compatible IP lookup endpoints so browser requests are not blocked after deployment.
