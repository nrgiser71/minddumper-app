#!/bin/bash

# Push MindDumper to GitHub

echo "📤 Pushing MindDumper to GitHub..."
echo "=================================="

cd "/Users/janbuskens/Library/CloudStorage/Dropbox/To Backup/Baas Over Je Tijd/Software/Minddumper/minddumper-app"

# Push to GitHub
git push -u origin main

echo ""
echo "✅ Done! Je code staat nu op:"
echo "https://github.com/nrgiser71/minddumper-app"
echo ""
echo "🚀 Volgende stap: Ga naar Vercel.com en import deze GitHub repo!"