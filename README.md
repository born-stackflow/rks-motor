# MotoBrand Website

A premium Italian motorcycle brand website built with Next.js 14, featuring both B2C and B2B functionality.

## 🏍️ Features

### Core Functionality
- **B2C Customer Portal**: Motorcycle browsing, parts catalog, enquiry forms
- **B2B Trade Portal**: Dealer applications, bulk orders, trade pricing
- **Content Management**: Full Sanity CMS integration
- **Email System**: Professional email templates with Resend
- **Responsive Design**: Mobile-first, fully responsive interface

### Pages & Sections
- **Homepage**: Hero slider, featured models, company stats
- **Models Catalog**: Advanced filtering, comparison, specifications
- **Parts Catalog**: Compatibility filtering, technical specifications  
- **About**: Company story, values, timeline, team
- **Dealers**: Location finder, dealer information
- **News**: Blog posts, press releases, announcements
- **Prices**: Model pricing, financing options
- **Media**: Press resources, brand assets, technical specs
- **Contact**: B2C enquiry forms, contact information
- **Trade**: B2B portal, dealer applications

### Technical Features
- **Next.js 14**: App Router, TypeScript, Server Components
- **Sanity CMS**: Headless content management
- **Email Templates**: Professional Resend integration
- **SEO Optimized**: Structured data, sitemap, meta tags
- **Form Validation**: Zod schemas, error handling
- **Future-Ready**: Zucchetti ERP integration preparation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Sanity account
- Resend account (for emails)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd motorcycle-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env.local
   ```
   Configure the environment variables in `.env.local`:
   - Sanity project ID and token
   - Resend API key
   - Email recipients
   - Other optional services

4. **Set up Sanity CMS**
   ```bash
   cd sanity
   npm install
   npx sanity init
   npx sanity deploy
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **View the website**
   Open [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
motorcycle-website/
├── app/                    # Next.js 14 App Router
│   ├── (pages)/           # Main website pages
│   ├── api/               # API routes for forms
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── layout/           # Layout components
├── lib/                  # Utility functions
│   ├── email-templates/  # Email templates
│   └── seo.ts           # SEO utilities
├── sanity/               # Sanity CMS configuration
│   ├── schemas/         # Content schemas
│   └── desk/           # Desk structure
└── public/              # Static assets
```

## 📱 Pages Overview

| Page | Route | Purpose |
|------|-------|---------|
| Homepage | `/` | Brand showcase, featured content |
| Models | `/models` | Motorcycle catalog with filtering |
| Model Detail | `/models/[slug]` | Individual model specifications |
| Parts | `/parts` | Parts catalog with compatibility |
| Part Detail | `/parts/[slug]` | Individual part specifications |
| About | `/about` | Company story and values |
| Dealers | `/dealers` | Dealer finder and information |
| News | `/news` | News articles and press releases |
| Prices | `/prices` | Model pricing and financing |
| Media | `/media` | Press resources and brand assets |
| Contact | `/contact` | B2C enquiry forms |
| Trade | `/trade` | B2B portal and information |
| Trade Apply | `/trade/apply` | B2B dealer applications |

## 🎨 Design System

### Colors
- **MotoBrand Red**: `#E63946`
- **Slate Blue**: `#1D3557` 
- **Golden Yellow**: `#FFD166`
- **Pure White**: `#FFFFFF`

### Typography
- **Primary**: Inter (body text, UI elements)
- **Display**: Syne (headings, hero text)

### Components
All UI components are built with Tailwind CSS and follow consistent design patterns:
- Button variants (primary, outline, ghost)
- Card layouts with hover effects
- Badge components for categories
- Form inputs with validation states
- Responsive navigation and layout

## 📧 Email System

Professional email templates for all enquiry types:

### Customer Confirmations
- **B2C Enquiries**: Motorcycle and parts enquiries
- **B2B Applications**: Trade partner applications
- **Parts Requests**: Both B2C and B2B parts orders

### Team Notifications
- **Sales Alerts**: New enquiries with priority levels
- **Trade Applications**: B2B partner requests
- **Parts Orders**: Bulk and individual part requests

## 🔌 API Endpoints

| Endpoint | Method | Purpose |
|----------|---------|---------|
| `/api/enquiry-b2c` | POST | B2C motorcycle enquiries |
| `/api/enquiry-b2b` | POST | B2B trade applications |
| `/api/enquiry-b2c-parts` | POST | B2C parts enquiries |
| `/api/enquiry-b2b-parts` | POST | B2B bulk parts orders |

## 📊 Content Management

### Sanity Schemas
- **bikeModel**: Motorcycle specifications and details
- **bikePart**: Parts catalog with compatibility
- **dealer**: Authorized dealer network
- **blogPost**: News articles and press releases
- **b2cEnquiry**: Customer enquiry management
- **b2bEnquiry**: Trade partner applications
- **mediaAsset**: Press resources and brand assets

### Desk Structure
- **Content**: Models, Parts, News, Dealers
- **Enquiries**: Separate B2C and B2B sections
- **Media**: Press resources and brand assets
- **Settings**: Site configuration and globals

## 🚀 Deployment

### Environment Setup
1. Configure production environment variables
2. Set up Sanity production dataset
3. Configure email service (Resend)
4. Set up domain and SSL

### Recommended Platforms
- **Vercel** (recommended for Next.js)
- **Netlify** 
- **AWS/Azure/GCP** with Docker

### Pre-deployment Checklist
- [ ] Environment variables configured
- [ ] Sanity CMS deployed and populated
- [ ] Email templates tested
- [ ] SEO metadata verified
- [ ] Performance optimization complete
- [ ] Security headers configured

## 🔧 Customization

### Adding New Models
1. Add model data in Sanity CMS
2. Upload model images
3. Configure specifications and features
4. Set pricing and availability

### Email Template Customization
1. Edit templates in `/lib/email-templates/`
2. Update branding and content
3. Test email rendering
4. Deploy changes

### Integration Setup
- **Zucchetti ERP**: Configure API endpoints when ready
- **Payment Processing**: Stripe integration for direct sales
- **Analytics**: Google Analytics/GTM setup
- **CDN**: Image optimization and delivery

## 🎯 Commands to View Your Work

### Start Development Server
```bash
cd /mnt/c/Users/Lenovo/Desktop/ITALIAN\ CLIENT/motorcycle-website
npm run dev
```
Then open: http://localhost:3000

### Launch Sanity Studio
```bash
cd /mnt/c/Users/Lenovo/Desktop/ITALIAN\ CLIENT/motorcycle-website/sanity
npm run dev
```
Then open: http://localhost:3333

### Build for Production
```bash
npm run build
npm start
```

## 📞 Support

For technical support or customization requests:
- **Email**: tech@techlogies.com
- **Documentation**: Check component docs in `/docs/`
- **Issues**: Report bugs via project repository

## 📄 License

This project is proprietary and confidential. Unauthorized copying, distribution, or modification is strictly prohibited.

---

**Built by Tech Logies** - Premium web development solutions