import type { Metadata } from 'next';
import Hero from '@/components/home/Hero';
import Manifesto from '@/components/home/Manifesto';
import SelectedWork from '@/components/home/SelectedWork';
import Capabilities from '@/components/home/Capabilities';
import Process from '@/components/home/Process';
import TechStack from '@/components/home/TechStack';
import Assurances from '@/components/home/Assurances';
import Testimonials from '@/components/home/Testimonials';
import JournalTeaser from '@/components/home/JournalTeaser';
import ContactCta from '@/components/layout/ContactCta';
import {
  getFeaturedProjects,
  getPosts,
  getProcessSteps,
  getServices,
  getTestimonials,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Tworzenie stron internetowych — Wołomin i Warszawa | Tomasz Majewski',
  description:
    'Projektuję i koduję strony internetowe dla firm: wizytówki, serwisy firmowe, sklepy i systemy rezerwacji. Wołomin, Warszawa i cała Polska. Wycena w 24 h.',
  path: '/',
});

export default async function HomePage() {
  const [projects, services, posts, testimonials] = await Promise.all([
    getFeaturedProjects(),
    getServices(),
    getPosts(),
    getTestimonials(),
  ]);

  return (
    <>
      <Hero />
      <Manifesto />
      <SelectedWork projects={projects} />
      <Capabilities services={services} />
      <Process steps={getProcessSteps()} />
      <TechStack />
      <Assurances />
      <Testimonials testimonials={testimonials} />
      <JournalTeaser posts={posts.slice(0, 3)} />
      <ContactCta />
    </>
  );
}
