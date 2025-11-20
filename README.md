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
│   └── PortfolioStacking.tsx     # Portfolio stacking cards component
├── data/
│   └── portfolioData.ts     # Portfolio data
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

