'use client';

import dynamic from 'next/dynamic';

// Dynamically import the SocialMediaPopup component with SSR disabled
const SocialMediaPopup = dynamic(
  () => import('./social-media-popup'),
  { ssr: false }
);

export default function ClientSideComponents() {
  return (
    <>
      <SocialMediaPopup />
    </>
  );
}