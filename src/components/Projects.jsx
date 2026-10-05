/**
 * Salon Section
 * Upcoming gatherings and the salon archive.
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Projects.css';

const upcomingSalon = {
  title: 'Halloween Salon',
  date: 'October 2026',
  status: 'COMING SOON',
  description:
    'Details are still taking shape. Check back soon for announcements, performers, and RSVP information.',
  poster: '/salon_gallery/salon_two/poster.png',
};

const archivedSalon = {
  title: 'Inaugural Salon',
  date: 'March 2026',
  location: 'San José, CA',
  images: [
    '/salon_gallery/salon_one/poster.PNG',
    '/salon_gallery/salon_one/salon_1.jpg',
    '/salon_gallery/salon_one/salon_2.jpg',
    '/salon_gallery/salon_one/salon_3.jpg',
    '/salon_gallery/salon_one/salon_4.jpg',
    '/salon_gallery/salon_one/salon_5.jpg',
  ],
};

export default function Projects() {
  const [modal, setModal] = useState(null);
  const [activeImage, setActiveImage] = useState(0);

  const closeModal = () => setModal(null);

  const showPrevious = () => {
    setActiveImage((current) =>
      (current - 1 + archivedSalon.images.length) % archivedSalon.images.length
    );
  };

  const showNext = () => {
    setActiveImage((current) => (current + 1) % archivedSalon.images.length);
  };

  const openArchive = () => {
    setActiveImage(0);
    setModal('archive');
  };

  useEffect(() => {
    if (!modal) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') closeModal();
      if (modal === 'archive' && event.key === 'ArrowLeft') showPrevious();
      if (modal === 'archive' && event.key === 'ArrowRight') showNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [modal]);

  return (
    <section id="salon" className="projects salon-page">
      <div className="salon-shell">
        <header className="salon-heading">
          <p className="salon-eyebrow">GATHERINGS · PERFORMANCES · EXHIBITIONS</p>
          <h2>THE SALON</h2>
        </header>

        <section className="salon-upcoming" aria-labelledby="upcoming-salon-title">
          <p className="salon-section-label">UPCOMING SALON</p>
          <button
            className="salon-feature-card"
            type="button"
            onClick={() => setModal('upcoming')}
            aria-label="View details for Halloween Salon"
          >
            <img src={upcomingSalon.poster} alt="Halloween Salon poster" />
            <span className="salon-card-shade" aria-hidden="true" />
            <span className="salon-feature-copy">
              <span className="salon-status">{upcomingSalon.status}</span>
              <span className="salon-card-title" id="upcoming-salon-title">{upcomingSalon.title}</span>
              <span className="salon-card-meta">{upcomingSalon.date}</span>
              <span className="salon-card-action">VIEW DETAILS →</span>
            </span>
          </button>
        </section>

        <section className="salon-archive" aria-labelledby="archive-heading">
          <div className="salon-archive-heading">
            <p className="salon-section-label">ARCHIVE</p>
            <h3 id="archive-heading">Past gatherings</h3>
          </div>
          <button
            className="salon-archive-card"
            type="button"
            onClick={openArchive}
            aria-label="Open gallery for Inaugural Salon"
          >
            <span className="salon-archive-image">
              <img src={archivedSalon.images[0]} alt="Inaugural Salon poster" />
              <span className="salon-archive-hover">OPEN GALLERY →</span>
            </span>
            <span className="salon-archive-copy">
              <span className="salon-card-title">{archivedSalon.title}</span>
              <span className="salon-card-meta">{archivedSalon.date} · {archivedSalon.location}</span>
            </span>
          </button>
        </section>
      </div>

      {modal && createPortal(
        <div
          className="salon-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <div
            className={`salon-modal ${modal === 'archive' ? 'salon-gallery-modal' : 'salon-info-modal'}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="salon-modal-title"
          >
            <button className="salon-modal-close" type="button" onClick={closeModal} aria-label="Close modal">
              ×
            </button>

            {modal === 'upcoming' ? (
              <div className="salon-info-layout">
                <img src={upcomingSalon.poster} alt="Halloween Salon poster" />
                <div className="salon-info-copy">
                  <span className="salon-status">{upcomingSalon.status}</span>
                  <h3 id="salon-modal-title">{upcomingSalon.title}</h3>
                  <p className="salon-modal-date">{upcomingSalon.date}</p>
                  <p className="salon-modal-description">{upcomingSalon.description}</p>
                </div>
              </div>
            ) : (
              <div className="salon-gallery-layout">
                <div className="salon-gallery-heading">
                  <div>
                    <p className="salon-section-label">ARCHIVE GALLERY</p>
                    <h3 id="salon-modal-title">{archivedSalon.title}</h3>
                    <p>{archivedSalon.date} · {archivedSalon.location}</p>
                  </div>
                  <p className="salon-counter" aria-live="polite">
                    {activeImage + 1} / {archivedSalon.images.length}
                  </p>
                </div>

                <div className="salon-gallery-stage">
                  <button type="button" className="salon-gallery-arrow salon-gallery-arrow--previous" onClick={showPrevious} aria-label="Previous image">←</button>
                  <img
                    src={archivedSalon.images[activeImage]}
                    alt={`${archivedSalon.title} image ${activeImage + 1} of ${archivedSalon.images.length}`}
                  />
                  <button type="button" className="salon-gallery-arrow salon-gallery-arrow--next" onClick={showNext} aria-label="Next image">→</button>
                </div>

                <div className="salon-thumbnails" aria-label="Gallery thumbnails">
                  {archivedSalon.images.map((image, index) => (
                    <button
                      type="button"
                      className={index === activeImage ? 'active' : ''}
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={index === activeImage ? 'true' : undefined}
                      key={image}
                    >
                      <img src={image} alt="" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </section>
  );
}
