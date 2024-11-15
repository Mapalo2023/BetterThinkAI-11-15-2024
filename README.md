# BetterThink AI Pro

## Protected Modules

### 1. Brainstorm Module
Protected by `.brainstormlock.json`:
- `src/components/brainstorm/*`
- `src/store/brainstormStore.ts`
- `src/types/brainstorm.ts`

### 2. AI Automation Module
Protected by `.automationlock.json`:
- `src/components/automation/*`
- `src/store/automationStore.ts`
- `src/types/automation.ts`

### Making Changes

If you need to modify any locked files:

1. Document the proposed changes
2. Update the hash and lastModified date in the respective lock file
3. Submit for review

### Protected Features

#### Brainstorm Module
- AI-powered idea generation
- Manual idea input
- SIP/SPIT analysis
- Idea storage and persistence
- Idea export functionality
- SWOT analysis
- Performance metrics

#### AI Automation Module
- Business analysis
- Automation recommendations
- Efficiency metrics
- ROI calculations
- Opportunity identification
- Analysis storage and export
- Performance tracking

## Development

```bash
npm install
npm run dev
```

## Environment Variables

Required environment variables:

```
VITE_OPENAI_API_KEY=your_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```