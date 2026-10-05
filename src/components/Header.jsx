/**
 * Header Component (Editorial Sidebar Navigation)
 * Fixed left-hand navigation that reads like a gallery catalogue.
 */

import { useEffect, useState } from 'react';
import './Header.css';

const navLinks = [
  { id: 'foyer', label: 'FOYER', roman: 'I' },
  { id: 'parlor', label: 'PARLOR', roman: 'II' },
  { id: 'salon', label: 'SALON', roman: 'III' },
  { id: 'conservatory', label: 'CONSERVATORY', roman: 'IV' },
  { id: 'emporium', label: 'EMPORIUM', roman: 'V' },
  { id: 'guest-book', label: 'GUEST BOOK', roman: 'VI' },
];

export default function Header({ hasStartedScrolling }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth <= 768);
  const [currentSection, setCurrentSection] = useState('foyer');
  const [navIsResting, setNavIsResting] = useState(false);

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let stateTimer;
    let restTimer;
    const isLandingPage = currentSection === 'foyer';

    if (isMobile || (isLandingPage && !hasStartedScrolling)) {
      stateTimer = window.setTimeout(() => setNavIsResting(false), 0);
    } else if (isLandingPage && hasStartedScrolling) {
      stateTimer = window.setTimeout(() => setNavIsResting(false), 0);
      restTimer = window.setTimeout(() => {
        setNavIsResting(true);
      }, 2400);
    } else {
      stateTimer = window.setTimeout(() => setNavIsResting(true), 0);
    }

    return () => {
      if (stateTimer !== undefined) {
        window.clearTimeout(stateTimer);
      }
      if (restTimer !== undefined) {
        window.clearTimeout(restTimer);
      }
    };
  }, [currentSection, hasStartedScrolling, isMobile]);

  useEffect(() => {
    const sections = navLinks
      .map((link) => document.getElementById(link.id))
      .filter(Boolean);

    if (sections.length === 0) return;

    let animationFrame;

    const updateCurrentSection = () => {
      // Use the top edge of the viewport so short sections are not skipped.
      // On mobile, account for the fixed horizontal header.
      const activationLine = window.innerWidth <= 768 ? 96 : 1;
      const activeSection = sections.reduce((active, section) => {
        return section.getBoundingClientRect().top <= activationLine ? section : active;
      }, sections[0]);

      setCurrentSection(activeSection.id);
      animationFrame = undefined;
    };

    const handleScroll = () => {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateCurrentSection);
      }
    };

    updateCurrentSection();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  const handleNavLinkClick = (sectionId) => {
    setCurrentSection(sectionId);

    if (isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  const shouldHideLandingNav =
    !isMobile && currentSection === 'foyer' && !hasStartedScrolling;

  return (
    <header
      className={`floating-header ${mobileMenuOpen ? 'mobile-open' : ''} ${
        shouldHideLandingNav ? 'floating-header--landing-hidden' : 'floating-header--visible'
      } ${navIsResting ? 'floating-header--resting' : ''}`}
    >
      <div className="floating-nav-container">
        <div className="nav-brand">
          <a href="#foyer" className="brand-link" onClick={() => handleNavLinkClick('foyer')}>
            <img className="brand-mark" src="/menagerie_gallery/new_logo_just.png" alt="Menagerie" />
            <span className="brand-name">THE MENAGERIE</span>
            <span className="brand-subtitle">OF LOVELY THINGS</span>
          </a>
        </div>

        <button
          className={`floating-menu-toggle ${mobileMenuOpen ? 'active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className={`floating-nav ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="floating-nav-list">
            {navLinks.map((link) => {
              const isActive = currentSection === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    className={isActive ? 'active' : ''}
                    onClick={() => handleNavLinkClick(link.id)}
                  >
                    <span className="nav-roman">{link.roman}</span>
                    <span className="nav-label">{link.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <p className="footer-location">
            Bay Area,
            <br />
            California
          </p>

          <div className="footer-icons">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" />
              </svg>
            </a>
            <a href="mailto:hello@example.com" aria-label="Email">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2" />
                <path d="M4 7l8 6 8-6" />
              </svg>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
}
