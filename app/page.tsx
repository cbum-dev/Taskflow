'use client';

import React from 'react';
import Dashboard  from '@/components/Homepage/Dashboard';
import { FeatureGrid } from '@/components/Homepage/Feature';
import { GridSmallBackgroundDemo } from '@/components/Acertinity/GridBg';
import HowItWorks from '@/components/Homepage/HowItWorks';
import SocialProof from '@/components/Homepage/SocialProof';
import PricingPreview from '@/components/Homepage/Pricing';
import CTAFooter from '@/components/Homepage/CTA'
import { Footer } from '@/components/global/Footer'
import { useSession } from 'next-auth/react';
import HealthCheckAlert from '@/components/HealthCheckAlert';

export default function HomePage() {
  const {data : session} = useSession()

  return (
    <div className="relative overflow-scroll  flex flex-col items-center justify-center dark:bg-black text-gray-900 dark:text-white transition-colors duration-300 ">
      <GridSmallBackgroundDemo  />
      <HealthCheckAlert/>
      {session && <Dashboard/>}
      <FeatureGrid/>
      <HowItWorks/>
      <SocialProof/>
      <PricingPreview/>
      <CTAFooter/>
      <Footer/>
    </div>
  );
}