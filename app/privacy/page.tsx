import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — Bunker Productions',
  description: 'Privacy Policy for Bunker Productions.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-neutral-400 mb-6">
          This page is a placeholder. Add your privacy policy content here.
        </p>
        <Link
          href="/"
          className="text-[#2323FF] hover:underline inline-block"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  )
}
