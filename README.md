# Legal Document Generator

A comprehensive web application that generates professional legal documents (Will and Power of Attorney) from user inputs. The application provides a secure, guided process from form completion through payment to final document download.

## Features

### Core Functionality
- **Document Types**: Last Will & Testament and Power of Attorney
- **Guided Forms**: 10-question forms with validation for each document type
- **PDF Generation**: Dynamic PDF creation from templates using user data
- **Preview System**: Watermarked preview before purchase
- **Payment Simulation**: Demo payment flow before final download
- **Secure Download**: Final documents without watermarks after payment

### User Experience
- **Professional Design**: Modern, clean interface with legal theme
- **Progress Tracking**: Visual progress indicators throughout the process
- **Form Persistence**: Automatic saving of form data in browser storage
- **Responsive Design**: Optimized for desktop and mobile devices
- **Inline Validation**: Real-time form validation with helpful error messages

### Security & Professional Standards
- **Watermarked Previews**: Non-downloadable previews with security watermarks
- **Session Management**: Secure session handling for document generation
- **Legal Templates**: Professional document templates meeting legal standards
- **Encrypted Generation**: Secure PDF generation process

## Architecture

### Frontend (React + TypeScript)
```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation sidebar
│   ├── Header.tsx           # Top header with branding
│   ├── Dashboard.tsx        # Main landing page
│   ├── DocumentForm.tsx     # Multi-step form component
│   ├── FormField.tsx        # Reusable form field component
│   └── ProgressBar.tsx      # Progress indicator
├── types/
│   └── index.ts             # TypeScript interfaces
└── App.tsx                  # Main application component
```

### Backend (Node.js + Express)
```
backend/
└── server.js               # Express server with PDF generation
```

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, CORS
- **PDF Generation**: pdf-lib (browser-compatible PDF creation)
- **Development**: Vite, ESLint, Concurrent execution
- **Styling**: Tailwind CSS with custom professional theme

## Prerequisites

- Node.js 16+ 
- npm or yarn package manager

## Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShanpreetSingh/LegalDocsApp
   cd project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```
   This command starts both frontend (port 5173) and backend (port 3001) concurrently.

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## Individual Server Commands

- **Frontend only**: `npm run dev:frontend`
- **Backend only**: `npm run dev:backend`

## End-to-End User Flow

### 1. Document Selection
- User selects either "Will" or "Power of Attorney" from the dashboard
- Each document type shows estimated completion time and included features

### 2. Form Completion
- Guided 10-question form with inline validation
- Form data automatically saved to browser storage
- Required field validation before proceeding
- Progress indicator shows completion status

### 3. Preview Generation
- Form data populates PDF template
- Watermarked preview generated and displayed
- Preview includes "PREVIEW - NOT FOR DOWNLOAD" watermarks
- Non-downloadable preview in embedded viewer

### 4. Payment Simulation
- Demo payment interface ($29.99 simulation)
- Secure payment processing simulation (2-second delay)
- Session-based payment verification

### 5. Final Document Download
- Clean PDF generated without watermarks
- Automatic download trigger
- Professional document formatting
- Legal template compliance

## PDF Template System

### Template Population
The application uses dynamic PDF generation where user form data populates predefined legal templates:

- **Will Template**: Includes testator information, beneficiaries, executor details, and legal clauses
- **Power of Attorney Template**: Includes principal and attorney-in-fact details, scope of authority, and legal framework

### Template Features
- Professional legal formatting
- Proper legal language and structure
- Dynamic content insertion
- Watermark system for previews
- Clean final versions for download

## Form Validation & Data Handling

### Validation Rules
- Required field enforcement
- Format validation (dates, phone numbers)
- Comprehensive error messaging
- Real-time validation feedback

### Data Persistence
- Browser localStorage for draft saving
- Session-based server storage during PDF generation
- Automatic cleanup after document completion

## API Endpoints

- `POST /api/generate-preview` - Generate watermarked PDF preview
- `POST /api/simulate-payment` - Process demo payment
- `POST /api/download-final` - Download final document
- `GET /api/health` - Server health check

## Production Deployment

### Frontend Build
```bash
npm run build
```

### Environment Variables
No environment variables required for basic functionality.

### Docker Support (Future Enhancement)
The application structure is designed for easy containerization:
- Separate frontend/backend concerns
- Standard Node.js dependencies
- Configuration-based setup

## Development Guidelines

### Code Organization
- Modular component structure
- TypeScript for type safety
- Reusable UI components
- Consistent naming conventions

### Styling Standards
- Tailwind CSS utility classes
- Professional legal theme colors
- Responsive design principles
- Consistent spacing system

## Legal Compliance Notes

This application generates document templates for educational and demonstration purposes. For actual legal documents:

1. Consult with qualified legal professionals
2. Ensure compliance with local/state laws
3. Verify witness and notarization requirements
4. Consider professional legal review

## Support & Maintenance

### Error Handling
- Comprehensive error messages
- Graceful fallback behavior
- User-friendly error reporting
- Console logging for debugging

### Performance Optimization
- Lazy loading of PDF generation
- Efficient form state management
- Optimized bundle size
- Fast development server

