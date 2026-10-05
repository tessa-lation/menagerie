/**
 * The Menagerie of Lovely Things
 * Artist + Programmer Portfolio
 * 
 * A surrealist collage of code and creativity
 */

import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Gallery from './components/Gallery'
import Shop from './components/Shop'
import Contact from './components/Contact'
import Footer from './components/Footer'
import FallingImageBackground from './components/FallingImageBackground'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [hasStartedScrolling, setHasStartedScrolling] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const nextHasStartedScrolling = window.scrollY > 80
      setHasStartedScrolling((current) =>
        current === nextHasStartedScrolling ? current : nextHasStartedScrolling
      )
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="app-shell">
      <Header hasStartedScrolling={hasStartedScrolling} />
      <FallingImageBackground />
      <Hero hasStartedScrolling={hasStartedScrolling} />
      <div className="app-foreground">
        <main>
          <About />
          <Projects />
          <Gallery />
          <Shop />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default App
