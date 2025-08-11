# 🐾 PetCareLocal - Pet Care Service Directory

A comprehensive local pet care service directory built with Next.js, helping pet owners find trusted veterinarians, groomers, trainers, and pet sitters in their area.

## 🌟 Features

### 🔍 Smart Service Discovery
- **Advanced Search**: Find pet services by location and category
- **Smart Filters**: Emergency services, insurance acceptance, current hours
- **Service Categories**: Veterinary, Grooming, Boarding, Training, Pet Sitting
- **Real-time Availability**: Shows currently open services

### 🏥 Service Profiles
- **Detailed Information**: Hours, contact info, services offered
- **Service Badges**: Emergency care, insurance acceptance, certifications
- **Customer Reviews**: Verified reviews and ratings
- **Specialties**: Pet types and specialized services

### 📱 User Experience
- **Mobile-First Design**: Responsive across all devices
- **WCAG 2.2 AA Compliant**: Full accessibility support
- **Fast Performance**: Optimized loading and interactions
- **SEO Optimized**: Structured data and meta tags

### 📚 Expert Content
- **Pet Care Blog**: Expert guides and tips
- **Local Insights**: Area-specific pet care advice
- **Service Guides**: How to choose the right provider

### 💰 Revenue Generation
- **Strategic Ad Placement**: Header, sidebar, and mobile ad zones
- **Affiliate Marketing**: Pet product recommendations
- **Sponsored Listings**: Premium service placement

## 🛠 Tech Stack

- **Framework**: Next.js 15 with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Styling**: Tailwind CSS with custom components
- **APIs**: Google Places API for service discovery
- **Deployment**: Netlify-ready configuration
- **Analytics**: Vercel Analytics integration

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Places API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/danbivins/pet-care.git
   cd pet-care
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   DATABASE_URL="postgresql://..."
   GOOGLE_PLACES_API_KEY="your_api_key"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Core Models

**PetService** - Main service provider model
- Basic info (name, address, contact)
- Service type (veterinary, grooming, boarding, etc.)
- Specialties and certifications
- Business details (hours, pricing, insurance)

**ServiceAppointment** - Booking and appointment tracking
- Appointment details and duration
- Service type and pricing estimates
- Customer notes and source tracking

**Review** - Customer feedback system
- Ratings and review text
- Verification status and author info
- Date tracking and source attribution

## 🎨 Design System

### Accessibility Features
- **Skip Navigation**: Direct access to main content
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: ARIA labels and semantic HTML
- **High Contrast**: Support for high contrast mode
- **Focus Indicators**: Clear focus states for all interactive elements

### Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Enhanced layout for tablets
- **Desktop Experience**: Full-featured desktop interface

## 📈 SEO & Performance

### Structured Data
- Local business schema markup
- Article schema for blog content
- Service-specific structured data

### Performance Optimizations
- **Image Optimization**: Next.js automatic image optimization
- **Code Splitting**: Lazy loading for heavy components
- **Caching**: API response caching
- **Core Web Vitals**: Optimized loading performance

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run typecheck    # Run TypeScript checks
npm run prisma:studio # Open Prisma Studio
```

### Project Structure

```
src/
├── app/                 # Next.js 13+ app directory
│   ├── api/            # API routes
│   ├── blog/           # Blog pages and articles
│   ├── pet-services/   # Service detail pages
│   └── globals.css     # Global styles and accessibility
├── components/         # Reusable UI components
├── lib/               # Utility functions and configurations
└── prisma/            # Database schema and migrations
```

## 🚀 Deployment

### Netlify Deployment

1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `.next`
4. Add environment variables in Netlify dashboard
5. Deploy!

### Environment Variables for Production

```env
DATABASE_URL="your_production_database_url"
GOOGLE_PLACES_API_KEY="your_api_key"
NEXT_PUBLIC_SITE_URL="https://your-domain.com"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support, please open an issue on GitHub or contact the development team.

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Advanced booking system
- [ ] Service provider dashboard
- [ ] Mobile app development
- [ ] AI-powered service recommendations
- [ ] Integration with veterinary records systems

---

Built with ❤️ for pet owners and their beloved companions 🐾