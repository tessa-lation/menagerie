/**
 * Salon Section
 * Upcoming gatherings and the salon archive.
 */

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './Projects.css';

const upcomingSalon = {
  title: 'Garden Salon',
  date: 'Date and time TBD',
  status: 'COMING SOON!',
  description:
    'A public park gathering with music, art, and community. Further details to follow.',
  poster: '/salon_gallery/garden_salon/garden_salon_poster.png',
};

const archivedSalons = [
  {
    title: 'Salon 2 Electric Boo-galoo',
    date: 'October 24th, 2026',
    location: 'San José, CA',
    images: [
      '/salon_gallery/salon_two/poster.png',
      '/salon_gallery/salon_one/poster.PNG',
      '/salon_gallery/salon_one/salon_1.jpg',
      '/salon_gallery/salon_one/salon_2.jpg',
      '/salon_gallery/salon_one/salon_3.jpg',
      '/salon_gallery/salon_one/salon_4.jpg',
      '/salon_gallery/salon_one/salon_5.jpg',
    ],
  },
  {
    title: 'Inaugural Salon',
    date: 'June 14th, 2026',
    location: 'San José, CA',
    images: [
      '/salon_gallery/salon_one/poster.PNG',
      '/salon_gallery/salon_one/salon_1.jpg',
      '/salon_gallery/salon_one/salon_2.jpg',
      '/salon_gallery/salon_one/salon_3.jpg',
      '/salon_gallery/salon_one/salon_4.jpg',
      '/salon_gallery/salon_one/salon_5.jpg',
    ],
  },
];

export default function Projects() {
  const [modal, setModal] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedArchiveIndex, setSelectedArchiveIndex] = useState(0);

  const selectedArchive = archivedSalons[selectedArchiveIndex] ?? archivedSalons[0];

  const closeModal = () => setModal(null);

  const showPrevious = () => {
    setActiveImage((current) =>
      (current - 1 + selectedArchive.images.length) % selectedArchive.images.length
    );
  };

  const showNext = () => {
    setActiveImage((current) => (current + 1) % selectedArchive.images.length);
  };

  const openArchive = (index = 0) => {
    setSelectedArchiveIndex(index);
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

        {upcomingSalon && (
          <section className="salon-upcoming" aria-labelledby="upcoming-salon-title">
            <p className="salon-section-label">UPCOMING SALON</p>
            <button
              className="salon-feature-card"
              type="button"
              onClick={() => setModal('upcoming')}
              aria-label={`View details for ${upcomingSalon.title}`}
            >
              <img src={upcomingSalon.poster} alt={`${upcomingSalon.title} poster`} />
              <span className="salon-card-shade" aria-hidden="true" />
              <span className="salon-feature-copy">
                <span className="salon-status">{upcomingSalon.status}</span>
                <span className="salon-card-title" id="upcoming-salon-title">{upcomingSalon.title}</span>
                <span className="salon-card-meta">{upcomingSalon.date}</span>
                <span className="salon-card-action">VIEW DETAILS →</span>
              </span>
            </button>
          </section>
        )}

        <section className="salon-archive" aria-labelledby="archive-heading">
          <div className="salon-archive-heading">
            <p className="salon-section-label">ARCHIVE</p>
            <h3 id="archive-heading">Past gatherings</h3>
          </div>
          {archivedSalons.map((salon, index) => (
            <button
              key={salon.title}
              className="salon-archive-card"
              type="button"
              onClick={() => openArchive(index)}
              aria-label={`Open gallery for ${salon.title}`}
            >
              <span className="salon-archive-image">
                <img src={salon.images[0]} alt={`${salon.title} poster`} />
                <span className="salon-archive-hover">OPEN GALLERY →</span>
              </span>
              <span className="salon-archive-copy">
                <span className="salon-card-title">{salon.title}</span>
                <span className="salon-card-meta">{salon.date} · {salon.location}</span>
              </span>
            </button>
          ))}
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

            {modal === 'upcoming' && upcomingSalon ? (
              <div className="salon-info-layout">
                <img src={upcomingSalon.poster} alt={`${upcomingSalon.title} poster`} />
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
                    <h3 id="salon-modal-title">{selectedArchive.title}</h3>
                    <p>{selectedArchive.date} · {selectedArchive.location}</p>
                  </div>
                  <p className="salon-counter" aria-live="polite">
                    {activeImage + 1} / {selectedArchive.images.length}
                  </p>
                </div>

                <div className="salon-gallery-stage">
                  <button type="button" className="salon-gallery-arrow salon-gallery-arrow--previous" onClick={showPrevious} aria-label="Previous image">←</button>
                  <img
                    src={selectedArchive.images[activeImage]}
                    alt={`${selectedArchive.title} image ${activeImage + 1} of ${selectedArchive.images.length}`}
                  />
                  <button type="button" className="salon-gallery-arrow salon-gallery-arrow--next" onClick={showNext} aria-label="Next image">→</button>
                </div>

                <div className="salon-thumbnails" aria-label="Gallery thumbnails">
                  {selectedArchive.images.map((image, index) => (
                    <button
                      type="button"
                      className={index === activeImage ? 'active' : ''}
                      onClick={() => setActiveImage(index)}
                      aria-label={`View image ${index + 1}`}
                      aria-current={index === activeImage ? 'true' : undefined}
                      key={`${selectedArchive.title}-${image}`}
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
