/**
 * Footer Component
 * Site footer with resume link and copyright
 */

import './Footer.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-bottom">
          <p>
            © {currentYear} The Menagerie of Lovely Things. Designed & built with
            care.
          </p>
          <p className="footer-tech">
            Built with React + Vite, Pexels API, and custom fonts
          </p>
        </div>
      </div>
    </footer>
  );
}
