'use client';

import dynamic from 'next/dynamic';

// Dynamically import the SocialMediaPopup component
const SocialMediaPopup = dynamic(
  () => import('@/components/social-media-popup'),
  { ssr: false }
);

export default function SocialWrapper() {
  return <SocialMediaPopup />;
}