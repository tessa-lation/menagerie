# The Menagerie of Lovely Things

A surrealist artist-programmer portfolio website built with React + Vite.

## 🎨 Overview

A high-art, gallery-inspired portfolio that showcases both visual art and coding work. Features surrealist aesthetics, custom typography, dynamic image galleries, and smooth interactions.

**Aesthetic:** Museum wall text meets fashion magazine meets Dadaist web object.

## ✨ Features

- **Hero Section** - Bold title and poetic tagline with parallax background
- **About** - Artist + Programmer bio with asymmetrical image layouts
- **Coding Projects** - Showcase of technical work with status badges
- **Art Gallery** - Surrealist collage images with mood-based filtering
- **Shop** - Placeholder for prints and merchandise
- **Contact** - Email form with social links
- **Interactions** - Hover effects, animations, smooth scrolling, custom cursor
- **Responsive Design** - Mobile-optimized layout
- **Pexels API Integration** - Curated thematic image feeds

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Visit `http://localhost:5173` in your browser.

## ⚙️ Setup Instructions

### 1. Add Pexels API Key

Get a free API key from [Pexels.com/api](https://www.pexels.com/api/)

Edit `.env.local`:

```
VITE_PEXELS_API_KEY=your_api_key_here
```

Without this, image galleries will fail gracefully but won't display images.

### 2. Custom Fonts

Your fonts are already configured in `src/styles/typography.css`:

- **Komika Display** (Editorial headings) - Located in `src/assets/komika_display/`
- **Mabook** (Body text) - Located in `src/assets/mabook/`

If you want to use different font files, update the `@font-face` declarations in `src/styles/typography.css`.

### 3. Resume

Add your resume as `public/resume.pdf`. The footer links to `/resume.pdf`.

### 4. Customize Content

Edit these files to personalize:

- **Site Title & Navigation** - [Header.jsx](src/components/Header.jsx)
- **Hero Tagline** - [Hero.jsx](src/components/Hero.jsx)
- **About Bio** - [About.jsx](src/components/About.jsx)
- **Projects List** - [Projects.jsx](src/components/Projects.jsx)
- **Contact Links** - [Contact.jsx](src/components/Contact.jsx)
- **Footer Info** - [Footer.jsx](src/components/Footer.jsx)

### 5. Color Palette

Update colors in `src/styles/variables.css`:

```css
--bone-white: #f5f1ed;
--warm-black: #2a2622;
--oxblood: #832d42;
--dark-teal: #1a4d4d;
--tarnished-gold: #a89968;
--soft-gray: #a9a8a4;
```

## 📁 File Structure

```
src/
├── components/          # React components
│   ├── Header.jsx       # Navigation
│   ├── Hero.jsx         # Hero section
│   ├── About.jsx        # Artist bio
│   ├── Projects.jsx     # Code projects
│   ├── Gallery.jsx      # Art gallery with mood filters
│   ├── ImageGallery.jsx # Reusable image grid component
│   ├── Shop.jsx         # Shop placeholder
│   ├── Contact.jsx      # Contact form
│   └── Footer.jsx       # Site footer
├── services/
│   └── pexelsAPI.js     # Pexels API integration
├── styles/
│   ├── variables.css    # CSS custom properties (colors, spacing, etc.)
│   ├── typography.css   # Font faces and text styling
│   └── global.css       # Global resets and utilities
├── assets/
│   ├── komika_display/  # Custom fonts (display)
│   └── mabook/          # Custom fonts (body)
├── App.jsx              # Root component
├── App.css              # App styles
└── main.jsx             # Entry point
```

## 🎯 Key Components

### Header

Sticky navigation with mobile hamburger menu. Customize nav links and branding.

### Hero

Fetches a random surreal image from Pexels as a parallax background. Falls back gracefully if API is unavailable.

### About

Two-column layout with asymmetrical image placement and photographer credits. Showcases artist and programmer personas.

### Gallery

Interactive gallery with mood-based filtering:

- `surreal` - Abstract, dreamlike
- `botanical` - Plants, flowers
- `sculpture` - 3D forms, statues
- `fabric` - Textures, textiles
- `shadow` - Light, silhouettes
- `museum` - Classical, galleries
- `vintage` - Retro, antique
- `collage` - Mixed media, abstract
- `marble` - Stone, minerals
- `gold` - Luxe, ornate

Add more moods by editing `SURREALIST_MOODS` in `src/services/pexelsAPI.js`.

### Image Service

`src/services/pexelsAPI.js` provides reusable functions:

```javascript
// Fetch images by mood
const images = await fetchImagesByMood('surreal', 12);

// Fetch single random image
const image = await fetchRandomImageByMood('botanical');

// Format image data for components
const formatted = formatImageData(pexelsImage);

// Preload multiple moods
const allImages = await preloadImagesByMoods(['surreal', 'botanical']);
```

## 🎨 Customization Guide

### Add a New Section

1. Create a new component file: `src/components/MySection.jsx`
2. Create matching styles: `src/components/MySection.css`
3. Import in `src/App.jsx` and add to the render tree
4. Use CSS variables from `variables.css` for consistent styling

### Change Colors

Edit color variables in `src/styles/variables.css`. All components use these variables, so changes will cascade throughout the site.

### Modify Typography

- Font sizes: `--text-xs` through `--text-5xl`
- Font families: `--font-display` (headings), `--font-body` (text)
- Line heights: `--lh-tight`, `--lh-normal`, `--lh-relaxed`
- Letter spacing: `--ls-tight`, `--ls-normal`, `--ls-wide`, `--ls-wider`

### Update Animation Timing

Adjust transition speeds in `variables.css`:

```css
--transition-fast: 200ms ease-out;
--transition-base: 300ms ease-out;
--transition-slow: 500ms ease-out;
```

### Add Hover Effects

Components use utility animations. Add custom ones to `global.css` and apply with `animation: keyframe-name duration`.

## 🔗 API Integration

### Pexels API

Free tier provides 200 requests/hour (sufficient for small portfolios).

Moods are mapped to image search queries. Customize by editing `SURREALIST_MOODS` object in `pexelsAPI.js`.

### Error Handling

- Missing API key: Components gracefully degrade
- Network error: Console warnings, empty galleries
- Fallback: Hero still displays without background image

## 📱 Responsive Design

- Mobile-first CSS approach
- Breakpoint: `768px`
- Touch-friendly buttons and interactions
- Hamburger menu navigation on mobile

## 🚢 Deployment

```bash
npm run build
```

Creates optimized build in `dist/`. Deploy to Netlify, Vercel, or any static host.

**Important:** Add environment variable to your hosting platform:
- Platform: Add `VITE_PEXELS_API_KEY` to environment variables

## 🎓 Beginner-Friendly Code

All code includes:

- Descriptive comments
- Clear variable names
- Simple component structure
- No advanced patterns (easy to modify)

## 📝 Notes

- Component files use plain CSS and CSS modules (no external CSS framework)
- React hooks: `useState`, `useEffect`
- No external UI libraries (all built from scratch)
- Code is production-ready but intentionally simple for learning

## 🔄 Future Enhancements

Suggested additions:

- [ ] Newsletter signup
- [ ] Blog/article section
- [ ] Actual e-commerce functionality
- [ ] Dark mode toggle
- [ ] Animation fine-tuning
- [ ] Performance optimization
- [ ] SEO meta tags
- [ ] Social media embeds

## 📄 License

Personalize this template as needed for your portfolio.

---

Built with care for The Menagerie of Lovely Things. 🖤
