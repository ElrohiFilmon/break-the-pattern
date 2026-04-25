# PatternBreaker Addis - Powered by Jeles AI

Break the patterns that hold you back with intelligent AI analysis from Jeles. Get real insights, actionable steps, and meaningful progress on the challenges you care about.

## Features

- **Jeles AI Integration**: Real-time AI analysis of challenges and patterns using the Jeles API
- **Challenge Analysis**: Submit any challenge and get comprehensive insights including:
  - Pattern recognition and root cause analysis
  - Sentiment analysis (positive, neutral, challenging)
  - Confidence scoring for analysis reliability
  - Actionable next steps
- **Challenge History**: Track all your challenges and analyses over time
- **Shareable Cards**: Export and share your challenges and Jeles insights as downloadable PNG cards
- **Analytics Dashboard**: Monitor your progress with detailed statistics on challenges analyzed
- **Dark Theme**: Beautiful, modern interface optimized for focused work
- **Fully Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 16 with React 19
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **AI**: Jeles API for intelligent challenge analysis
- **State Management**: React Context API with localStorage persistence
- **Analytics**: Custom event tracking system
- **Export**: html2canvas for card generation

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm (or npm/yarn)
- Jeles API key (get one at https://jeles.ai)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pattern-breaker-addis
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Jeles API key to `.env.local`:
```
NEXT_PUBLIC_JELES_API_URL=https://api.jeles.ai
JELES_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
pnpm dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/app
  /challenge
    /[id]        - Challenge detail page with Jeles analysis
    page.tsx     - Challenge submission page
  /history       - View all past challenges
  /stats         - Analytics dashboard
  layout.tsx     - Root layout with providers
  page.tsx       - Home page

/components
  /ui            - shadcn/ui components
  jeles-response-card.tsx    - Displays Jeles analysis results
  navigation.tsx - Main navigation header

/lib
  jeles-client.ts       - Jeles API client wrapper
  types.ts              - TypeScript type definitions
  context.tsx           - React Context for app state
  storage.ts            - localStorage management
  analytics.ts          - Event tracking system
  share.ts              - Sharing utilities
```

## Core Pages

### Home (`/`)
- Hero section introducing PatternBreaker Addis
- Overview of how Jeles AI analysis works
- Quick links to start a challenge

### Challenge (`/challenge`)
- Text input for describing a pattern or challenge
- Form submission with loading states
- Error handling for API failures

### Challenge Detail (`/challenge/[id]`)
- Full Jeles AI analysis display with:
  - Challenge title and description
  - Key insights (numbered list)
  - Recommended action items
  - Sentiment and confidence metrics
- Shareable card preview
- Export and sharing options

### History (`/history`)
- List of all past challenges
- Quick preview of analysis for each challenge
- Status indicators (analyzing, analyzed)
- Clear history option

### Stats (`/stats`)
- Key metrics dashboard
- Sentiment breakdown of analyses
- Recent activity log
- Quick navigation to create new challenges

## API Integration

### Jeles Client

The app uses a custom Jeles API client (`lib/jeles-client.ts`) that handles:
- Challenge analysis requests
- Response retrieval
- Stream-based analysis (for real-time updates)
- Error handling and recovery
- API authentication

### Environment Variables

```env
# Required
JELES_API_KEY=your_api_key_here

# Optional
NEXT_PUBLIC_JELES_API_URL=https://api.jeles.ai
DEBUG_ANALYTICS=false
```

## Data Persistence

- All challenges and analyses are saved to browser localStorage
- History persists across sessions
- Clear history option available on the History page

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard:
   - `JELES_API_KEY`
4. Deploy!

### Other Platforms

The app is a standard Next.js application and can be deployed to any platform that supports Node.js:
- Netlify
- Railway
- Fly.io
- Docker containers

## Building for Production

```bash
pnpm build
pnpm start
```

## Contributing

This project is configured for easy customization. Key areas to extend:

- Add more analysis types in the Jeles client
- Create additional dashboard views
- Enhance the sharing system
- Add user authentication
- Integrate with a backend database

## License

MIT

## Support

For issues with the app, please open an issue in the repository.

For Jeles API support, visit https://jeles.ai

## Acknowledgments

- Built with Next.js and React
- Styled with Tailwind CSS and shadcn/ui
- Powered by Jeles AI for intelligent pattern analysis
