import { Analytics } from '@vercel/analytics/react'

import Hero from './sections/Hero.tsx'
import Switchers from './sections/Switchers'
import TasteSection from './sections/TasteSection'
import BrandPosition from './sections/BrandPosition'
import Location from './sections/Location'
import Footer from './sections/Footer'
import Seo from './components/Seo'

function App() {
  return (
    <main className="landing">
      <Analytics />
      <Seo />
      <Switchers />
      <Hero />
      <TasteSection />
      <BrandPosition />
      <Location />
      <Footer />
    </main>
  )
}

export default App
