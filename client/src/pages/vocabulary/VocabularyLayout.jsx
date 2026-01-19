import VocabularyTabs from '../../components/vocabulary/VocabularyTabs.jsx'
import { Outlet } from 'react-router-dom'

const VocabularyLayout = () => {
  return (
    // Container chính: Nền trắng, căn giữa
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 py-10 md:py-9">
        {/* HEADER SECTION */}
        <header className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
            Vocabulary
          </h1>
          <p className="text-lg text-gray-500 font-sans max-w-2xl leading-relaxed">
            "When you want something, all the universe conspires in helping you to achieve it."
          </p>
        </header>

        {/* NAVIGATION TABS */}
        <div className="mb-5">
          <VocabularyTabs />
        </div>

        {/* PAGE CONTENT (Render các trang con) */}
        <main className="animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default VocabularyLayout
