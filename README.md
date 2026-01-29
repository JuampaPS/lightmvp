# Lightshow & Audio Landing Page

A modern, responsive landing page for a lightshow and audio design company built with Next.js, React, Tailwind CSS, and shadcn/ui components.

## Features

- **Responsive Design**: Mobile-first approach with beautiful layouts for all screen sizes
- **Modern UI**: Clean, professional design with gradient accents and smooth animations
- **Contact Form**: Interactive form for budget requests with validation
- **Image Gallery**: Showcase of recent projects and installations
- **Service Cards**: Clear presentation of offered services
- **Smooth Scrolling**: Navigation with smooth scroll to sections

## Tech Stack

- **Framework**: Next.js 13.5 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock Animation Platform)
- **Icons**: React Icons
- **TypeScript**: Full type safety

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000)

## Media optimization pipeline

Scripts to generate optimized image and video assets. Paths align with `/videos-hero/*` and `/images/*`. Tested on **Windows 11 ARM** (ffmpeg ARM64, sharp).

### Prerequisites

- **Node:** `npm install` (includes `sharp` for images).
- **ffmpeg** (for `videos:encode`): must be on `PATH`. On Windows 11 ARM, use an ARM64 build (e.g. `winget install ffmpeg` or [ffmpeg.org](https://ffmpeg.org/download.html)).
- **PowerShell:** `videos:encode` runs `scripts/encode-videos.ps1` (Windows).

### 1. Videos — `npm run videos:encode`

- **Script:** `scripts/encode-videos.ps1` (PowerShell). Uses ffmpeg; assumes it is available (e.g. ARM64 on Windows 11 ARM).
- **Input:** All `.mp4` in `public/videos-hero`. Skips `*-mobile.mp4` and `*-desktop.mp4`.
- **Output:** Same folder. For each source `foo.mp4`:
  - **`foo-mobile.mp4`:** 720p, no audio, faststart, low bitrate (~1.25 Mbps).
  - **`foo-desktop.mp4`:** 1080p, no audio, faststart (CRF 23).

### 2. Images — `npm run images:optimize`

- **Script:** `scripts/optimize-images.mjs` (Node + sharp). Sharp is ARM-compatible.
- **Input:** `public/images/**` (recursive). Skips `optimized`, `videos-hero`, `.gif`, `.mp4`.
- **Output:** `public/images/optimized/` (mirrors structure). For each raster image (jpg, png, webp, bmp):
  - **AVIF** and **WebP** at widths 640, 960, 1440 (smaller images use one width).
  - Filenames: `{base}-640w.webp`, `{base}-960w.avif`, etc.
- **Originals:** Unchanged.

### Quick start

```bash
npm install
npm run images:optimize   # AVIF + WebP from public/images/**
npm run videos:encode     # *-mobile.mp4, *-desktop.mp4 in public/videos-hero
```

Put source MP4s in `public/videos-hero` before running `videos:encode`. The app uses `/videos-hero/*` for hero and other videos.

---

## Customization

### Replace Placeholder Content

1. **Images**: Replace the Unsplash placeholder images in the gallery section with your actual project photos
2. **Contact Information**: Update email, phone, and WhatsApp links in the contact section
3. **Company Details**: Modify the "Nosotros" section with your actual company information
4. **Social Links**: Update Instagram and other social media links

### Form Integration

The contact form currently shows a success message on submit. To make it functional:

1. **Formspree**: Add your Formspree endpoint
2. **Resend**: Use Resend for email handling
3. **Server Actions**: Implement Next.js server actions for form handling

### Deployment

This project is ready to deploy on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with one click

## Project Structure

```
├── app/
│   ├── globals.css          # Global styles and Tailwind imports
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Home page
├── components/
│   ├── BunkerSlider.tsx      # Hero slider component
│   ├── LightshowAudioLanding.tsx  # Main landing page component
│   └── CommunityHubHorizontalScroll.tsx  # Community Hub horizontal scroll component
├── data/
│   └── portfolioData.ts     # Portfolio data (used by BunkerSlider)
├── hooks/
│   └── useTranslations.ts   # Translation hook
└── ...config files
```

## Sections

- **Hero**: Eye-catching header with call-to-action buttons
- **Services**: Three main service categories with descriptions
- **Gallery**: Image showcase of recent projects
- **About**: Company information and coverage areas
- **Contact**: Contact form and business information
- **Footer**: Copyright and legal links

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is open source and available under the [MIT License](LICENSE).

