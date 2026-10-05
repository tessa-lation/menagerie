#!/usr/bin/env bash

# Quick Setup Script for The Menagerie of Lovely Things
# Run this after cloning/creating the project

echo "🎨 The Menagerie of Lovely Things - Setup"
echo "=========================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local template..."
    cat > .env.local << 'EOF'
# Pexels API Key - Get your free key at https://www.pexels.com/api/
VITE_PEXELS_API_KEY=your_pexels_api_key_here
EOF
    echo "✅ Created .env.local - add your Pexels API key"
else
    echo "✅ .env.local already exists"
fi

echo ""
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env.local and add your Pexels API key"
echo "2. Add your resume to public/resume.pdf"
echo "3. Customize components in src/components/"
echo "4. Update colors in src/styles/variables.css"
echo "5. Run: npm run dev"
echo ""
echo "For detailed instructions, see PORTFOLIO_SETUP.md"
