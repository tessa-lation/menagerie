/**
 * Parlor / About Section
 * An editorial introduction to The Menagerie collective.
 */

import './About.css';

function Stamp({ children, tone = 'mint' }) {
  return <p className={`parlor-stamp parlor-stamp--${tone}`}>{children}</p>;
}

export default function About() {
  return (
    <section id="parlor" className="about parlor-page">
      <header className="parlor-hero">
        <img
          className="parlor-hero-mark"
          src="/menagerie_gallery/new_logo_just.png"
          alt=""
          aria-hidden="true"
        />
        <span className="parlor-rule parlor-rule--one" aria-hidden="true" />
        <span className="parlor-rule parlor-rule--two" aria-hidden="true" />

        <div className="parlor-shell parlor-hero-content">
          <Stamp>PARLOR · THE COLLECTIVE</Stamp>
          <h1 className="parlor-title">
            <span>We make</span>
            <em>strange</em>
            <span>beautiful things.</span>
          </h1>
          <div className="parlor-kicker">
            <span aria-hidden="true" />
            <p>ARTIST-RUN SPACE</p>
          </div>
        </div>
      </header>

      <section className="parlor-story" aria-labelledby="parlor-story-title">
        <div className="parlor-shell parlor-story-grid">
          <div className="parlor-story-copy">
            <h2 id="parlor-story-title">
              What's all this then?
            </h2>
            <p>
              <span>The Menagerie of Lovely Things is a Bay Area art collective founded by two friends—an artist and a musician—with a shared dream of bringing more art into the world.</span>
            </p>
            <p>
              <span>Born from a desire for more welcoming third spaces, we create opportunities for people to gather, make, share, and connect through art, music, and creative exploration.</span>
            </p>
            <p>
              <span>We are committed to fostering accessible, community-centered experiences that celebrate curiosity, experimentation, and self-expression.</span>
            </p>
            <p>
              <span>Rooted in the belief that everyone deserves a place to belong, The Menagerie of Lovely Things is proudly queer-friendly and inclusive of people from all backgrounds, identities, and levels of artistic experience.</span>
            </p>
            <p>
              <span>Whether you’re a lifelong artist, an aspiring musician, or simply someone seeking connection through creativity, you are welcome here.</span>
            </p>
            <p>
              <span>Our goal is simple: to cultivate vibrant, local spaces where art can be experienced together and where beautiful oddities, new ideas, and meaningful relationships can grow.</span>
            </p>
          </div>

          <figure className="parlor-story-image">
            <img src="/menagerie_gallery/favicon.png" alt="The Menagerie eagle-head artwork" />
          </figure>
        </div>
      </section>

      <section className="parlor-people" aria-labelledby="parlor-people-label">
        <div className="parlor-shell parlor-people-inner">
          <Stamp tone="mauve"><span id="parlor-people-label">THE PEOPLE</span></Stamp>
          <p className="parlor-people-copy">
            We are artists, musicians, makers, and friends building a place for creative lives to meet. More introductions are on their way.
          </p>
          <div className="parlor-coming-soon">
            <span aria-hidden="true" />
            <p>COMING SOON</p>
          </div>
        </div>
      </section>
    </section>
  );
}
