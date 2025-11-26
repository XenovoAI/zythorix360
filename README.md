# Zythorix360 - NEET & JEE Preparation Platform

A comprehensive educational platform for NEET & JEE preparation, offering study materials, question banks, and practice tests. Built with Next.js 14, Supabase, and Razorpay.

## Features

- 📚 **Comprehensive Study Materials** - Expert-curated content for Physics, Chemistry, Biology, and Mathematics
- 🎯 **Practice Tests** - Mock exams and assessments to track progress
- 💳 **Secure Payments** - Integrated with Razorpay for seamless transactions
- 👥 **User Management** - Complete authentication and user dashboard
- 📊 **Analytics** - Track downloads, performance, and progress
- 🎨 **Modern UI** - Beautiful, responsive design with purple theme
- 📱 **Mobile Friendly** - Optimized for all devices

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Payments**: Razorpay
- **Deployment**: Vercel
- **UI Components**: Radix UI, Lucide React

## Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/zythorix360.git
   cd zythorix360
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your actual values
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Razorpay Configuration
NEXT_PUBLIC_RAZORPAY_KEY_ID=your-razorpay-key-id
RAZORPAY_KEY_SECRET=your-razorpay-secret

# App Configuration
NEXT_PUBLIC_APP_URL=https://www.zythorix360.com

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

## Database Setup

1. Create a new Supabase project
2. Run the SQL migration script (see setup guide)
3. Configure Row Level Security policies
4. Set up storage buckets for materials and thumbnails

## Deployment

### Vercel (Recommended)

1. Install Vercel CLI: `npm install -g vercel`
2. Deploy: `vercel`
3. Add environment variables in Vercel dashboard
4. Configure custom domain

### Manual Deployment

1. Build the project: `npm run build`
2. Start the server: `npm start`

## Project Structure

```
zythorix360/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── components/        # React components
│   ├── (pages)/          # Page components
│   ├── globals.css       # Global styles
│   └── layout.js         # Root layout
├── lib/                   # Utility functions
├── public/               # Static assets
├── .env.local.example    # Environment variables template
└── package.json          # Dependencies and scripts
```

## Key Features

### Study Materials
- Physics, Chemistry, Biology, Mathematics
- Class 10, 11, 12, and Dropper content
- Free and premium materials
- Instant downloads

### Payment System
- Razorpay integration
- Coupon system
- Influencer commissions
- Transaction tracking

### User Management
- Supabase authentication
- User dashboard
- Download history
- Progress tracking

### Admin Panel
- Material management
- User analytics
- Payment tracking
- Influencer management

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email zythorix360@gmail.com or visit our website at [www.zythorix360.com](https://www.zythorix360.com).

## Acknowledgments

- Built with ❤️ for students preparing for NEET & JEE
- Powered by Supabase and Vercel
- UI components from Radix UI and Tailwind CSS