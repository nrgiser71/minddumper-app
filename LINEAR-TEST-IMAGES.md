# Linear Test Page - Image Replacement Guide

## Current Placeholder Images

The Linear test page (`/linear-test`) currently uses placeholder images that need to be replaced with professional Linear interface screenshots.

## Images to Replace

### 1. Hero Image
- **File**: `/public/linear-test/hero-image.jpg`
- **Recommended size**: 1600x1000px (16:10 ratio)
- **Content**: Main Linear interface showing issues/projects overview
- **Effect**: Uses `card-3d` class with subtle 3D transform

### 2. Projects Interface
- **File**: `/public/linear-test/projects.jpg`
- **Recommended size**: 1400x875px (16:10 ratio)  
- **Content**: Linear Projects view with roadmaps/initiatives
- **Effect**: Uses `angled` class with rotateX(8deg) rotateY(-8deg)

### 3. Issues Interface
- **File**: `/public/linear-test/issues.jpg`
- **Recommended size**: 1400x875px (16:10 ratio)
- **Content**: Linear Issues list with cycles/filters
- **Effect**: Uses `angled` class with 3D perspective

### 4. AI Features
- **File**: `/public/linear-test/ai-features.jpg`
- **Recommended size**: 1600x1000px (16:10 ratio)
- **Content**: Linear AI/Agents interface features
- **Effect**: Uses `angled` class with enhanced shadows

## Image Requirements

1. **High Resolution**: Minimum 1400px wide for crisp display
2. **Aspect Ratio**: 16:10 preferred (matches CSS aspect-ratio)
3. **Format**: PNG for transparency or high-quality JPG
4. **Interface Details**: Show realistic Linear interface elements
5. **Consistent Lighting**: Match Linear's dark theme aesthetic

## CSS Classes Available

- `.showcase-image` - Base styling with shadows and borders
- `.angled` - Adds 3D perspective rotation (rotateX: 8deg, rotateY: -8deg)
- `.card-3d` - Subtle 3D transform for hero images

## Replacement Process

1. Create/capture professional Linear screenshots
2. Edit with proper perspective and quality
3. Save to `/public/linear-test/` with same filenames
4. Rebuild and deploy

The CSS is optimized for professional screenshots with proper shadows, borders, and 3D effects that match Linear's design aesthetic.