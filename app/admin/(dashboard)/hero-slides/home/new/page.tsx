import HeroSlideForm from '@/components/admin/hero-slide-form';

export default function NewHomeSlide() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <nav className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                    <span>Admin</span>
                    <span>/</span>
                    <span>Hero Slides</span>
                    <span>/</span>
                    <span>Homepage</span>
                    <span>/</span>
                    <span className="text-indigo-600 font-medium">New Slide</span>
                </nav>
            </div>

            <HeroSlideForm
                isEdit={false}
                pageName="home"
                pageLabel="Homepage"
                backUrl="/admin/hero-slides/home/manage"
            />
        </div>
    );
}
