import { redirect } from 'next/navigation';

// No longer needed — hero slides are managed per-page from the list
export default function NewHeroSlidePage() {
    redirect('/admin/hero-slides');
}
