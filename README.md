# BEBOAI CRM Frontend

A modern, fully-functional CRM frontend built with React, TypeScript, and Tailwind CSS, designed to work with the BEBOAI-03 production API.

## 🚀 Features

### ✅ Implemented Features
- **Modern Tech Stack**: React 18 + TypeScript + Vite
- **Responsive UI**: Tailwind CSS v4 with dark/light theme support
- **Authentication**: Complete JWT-based auth system with token refresh
- **API Integration**: Axios client with interceptors and automatic token refresh
- **State Management**: Zustand for global state
- **Data Fetching**: React Query (TanStack Query) for efficient data management
- **Full CRUD for Leads**:
  - List view with pagination and search
  - Create/Edit forms with validation
  - Detailed view with all fields
  - Delete with confirmation

### 🎨 UI Components
All reusable components are built with Tailwind CSS:
- Button, Input, Label, Textarea, Select
- Card, Badge, Table, Dialog
- Theme toggle (Dark/Light mode)
- Responsive sidebar navigation

### 📊 Modules
- ✅ **Leads** - Fully implemented with CRUD operations
- ⏳ **Accounts** - Service layer ready
- ⏳ **Contacts** - Service layer ready
- ⏳ **Opportunities** - Service layer ready
- ⏳ **Tasks** - Service layer ready
- ⏳ **Events** - Service layer ready
- ⏳ **Cases** - Service layer ready
- ⏳ **Teams** - Service layer ready
- ⏳ **Documents** - Service layer ready

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+
- npm or yarn
- API Backend running at: https://beboai-03-production.up.railway.app

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```

### 4. Preview Production Build
```bash
npm run preview
```

## 🌐 Deployment

### Deploy to Vercel

#### Method 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Or deploy to production directly
vercel --prod
```

#### Method 2: GitHub Integration
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will automatically detect Vite and configure the build
6. Click "Deploy"

The `vercel.json` configuration is already included in the project.

### Deploy to Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build the project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

### Deploy to Other Platforms
The built files are in the `dist` folder after running `npm run build`. You can deploy this folder to any static hosting service.

## 🔐 API Configuration

The API is configured in `src/lib/api-client.ts`:

```typescript
const API_BASE_URL = "https://beboai-03-production.up.railway.app/api";
```

### Authentication Flow
1. User logs in with email/password
2. Backend returns access token, refresh token, and organization API key
3. All subsequent requests include:
   - `Authorization: Bearer {access_token}` header
   - `org: {organization_api_key}` header
4. On 401 error, automatically refreshes token using refresh token
5. If refresh fails, redirects to login

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── leads/           # Lead-specific components
│   └── ProtectedRoute.tsx
├── layouts/
│   └── MainLayout.tsx   # Main app layout with sidebar
├── pages/
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   └── leads/
│       └── LeadsList.tsx
├── services/            # API service classes
│   ├── auth.service.ts
│   ├── crud.service.ts  # Generic CRUD service
│   ├── leads.service.ts
│   └── [other modules].service.ts
├── store/               # Zustand stores
│   ├── auth.store.ts
│   └── theme.store.ts
├── types/               # TypeScript interfaces
│   └── index.ts
├── lib/                 # Utility functions
│   ├── api-client.ts    # Axios instance with interceptors
│   └── utils.ts         # Helper functions
└── App.tsx              # Main app component with routing
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## 🎯 Next Steps

To complete the remaining modules, you can:

1. **Copy the Leads pattern** for other modules:
   - Copy `src/pages/leads/LeadsList.tsx`
   - Copy `src/components/leads/` folder
   - Update types and service imports
   - Add route to `App.tsx`

2. **Add more features**:
   - Comments system (API endpoints ready)
   - Attachments/file uploads (API endpoints ready)
   - Advanced filters and sorting
   - Bulk operations
   - Export functionality

3. **Enhance UI**:
   - Add loading skeletons
   - Improve error handling
   - Add toast notifications
   - Add confirmation dialogs

## 🐛 Troubleshooting

### Build Errors
- Make sure you're using Node.js 18+
- Delete `node_modules` and `package-lock.json`, then run `npm install`

### API Connection Issues
- Check that the API is accessible at https://beboai-03-production.up.railway.app
- Verify your credentials are correct
- Check browser console for detailed error messages

### Styling Issues
- Clear browser cache
- Make sure Tailwind CSS is properly configured
- Check that `index.css` is imported in `main.tsx`

## 📚 Documentation

- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [React Router Documentation](https://reactrouter.com)

## 📄 License

This project is proprietary software for BEBOAI.

## 🤝 Support

For issues or questions, please contact the development team.

---

**Built with ❤️ using React, TypeScript, and Tailwind CSS**
