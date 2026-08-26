import type { NextConfig } from 'next';
import { BASE_PATH } from './src/config/site';

const nextConfig: NextConfig = {
  // Static export: `next build` writes a plain HTML/CSS/JS site to
  // ./out that any file host (GitHub Pages, Netlify, S3…) can serve.
  output: 'export',

  // Emit /en/index.html instead of /en.html — GitHub Pages serves
  // directories reliably but does not map "/en" → "en.html".
  trailingSlash: true,

  // "" for a custom domain or a <user>.github.io repo; "/<repo>" for a
  // project site. Set via NEXT_PUBLIC_BASE_PATH (see src/config/site.ts
  // and .github/workflows/deploy.yml).
  basePath: BASE_PATH,

  // There is no image-optimization server on a static host. The hero
  // photo is a single pre-tuned JPG, so nothing is lost.
  images: { unoptimized: true },

  // Lets the dev server be opened through an ngrok tunnel (e.g. for
  // testing on a phone). Only affects `npm run dev`, not production.
  allowedDevOrigins: ['*.ngrok-free.app'],

  // NOTE: the old "/" → "/en" redirect() cannot exist in a static export
  // (there is no server). public/index.html does that job instead.
};

export default nextConfig;
