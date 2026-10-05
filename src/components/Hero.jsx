/**
 * Hero Section
 * Title, tagline, and call-to-action for the Menagerie
 */

import './Hero.css';

function LandingScrollCue({ hasStartedScrolling }) {
  return (
    <div
      className={`landing-scroll-cue ${
        hasStartedScrolling ? 'landing-scroll-cue--hidden' : ''
      }`}
      aria-hidden="true"
    >
      <svg
        className="landing-scroll-cue__path"
        viewBox="0 0 90 520"
        preserveAspectRatio="none"
        role="presentation"
      >
        <path
          className="landing-scroll-cue__path-base"
          d="M42 0 C68 54, 18 92, 46 140 C72 186, 22 232, 50 278 C72 316, 24 365, 48 410 C58 430, 48 458, 44 478"
        />
        <path
          className="landing-scroll-cue__path-pulse"
          d="M42 0 C68 54, 18 92, 46 140 C72 186, 22 232, 50 278 C72 316, 24 365, 48 410 C58 430, 48 458, 44 478"
        />
        <path
          className="landing-scroll-cue__arrowhead"
          d="M32 464 L44 480 L58 462"
        />
      </svg>
      <div className="landing-scroll-cue__text-wrap">
        <span className="landing-scroll-cue__text">keep wandering</span>
      </div>
    </div>
  );
}

export default function Hero({ hasStartedScrolling }) {
  return (
    <section id="foyer" className="hero">
      <div className="hero-background" aria-hidden="true">
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="container hero-inner">
          <div className="hero-brand landing-logo-stage">
            <img
              id="main-hero-logo"
              className="hero-logo"
              src="/menagerie_gallery/new_logo.png"
              alt="The Menagerie of Lovely Things"
            />
            <LandingScrollCue hasStartedScrolling={hasStartedScrolling} />
          </div>

          <div className="hero-copy">
            <p className="hero-kicker"><span>Local Music · Local Art · Local Events</span></p>
          </div>
        </div>
      </div>

    </section>
  );
}
