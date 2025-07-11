# Inviter - Modern Invitation Management System

A web application that revolutionizes how invitations are sent and managed through SMS, featuring real-time response tracking, beautiful templates, and a seamless user experience.

## 🌟 Features

### Core Features (Implemented)
- **Modern UI/UX**: Clean, responsive design with real-time updates
- **SMS-Based Invitations**: Send invitations via clickable SMS links
- **No App Required for Recipients**: Recipients can respond through a web interface
- **Real-Time Status Tracking**: Track who viewed, responded, and their answers
- **Message System**: Recipients can leave optional messages with their responses
- **Secure Authentication**: OAuth2 with Google/Apple sign-in support
- **Response Analytics**: Dashboard with response rates and statistics

### Nice-to-Have Features (Implemented)
- **Invitation Templates**: Pre-designed templates for various event types
- **Custom Response Options**: Customizable YES/NO button text
- **Expiration Dates**: Set deadlines for responses
- **Reminder System**: Infrastructure for sending reminders to non-responders

## 🏗️ Architecture

### Technology Stack

#### Backend (Python)
- **Framework**: FastAPI
- **Database**: PostgreSQL (SQLite for development)
- **ORM**: SQLAlchemy
- **Authentication**: JWT tokens with OAuth2 support
- **SMS Service**: Twilio
- **Security**: bcrypt for password hashing, secure link generation

#### Frontend (React)
- **Framework**: React 18 with React Router v6
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Context API
- **HTTP Client**: Axios
- **Icons**: Heroicons
- **Date Handling**: date-fns

## 📁 Project Structure

```
inviter-app/
├── backend/
│ ├── pycache/ # Python bytecode cache
│ ├── venv/ # Python virtual environment
│ ├── main.py # FastAPI application entry point
│ ├── models.py # SQLAlchemy database models
│ ├── schemas.py # Pydantic validation schemas
│ ├── database.py # Database configuration
│ ├── auth.py # Authentication utilities
│ ├── utils.py # Helper functions (SMS, links)
│ ├── init_db.py # Database initialization
│ ├── requirements.txt # Python dependencies
│ ├── .env.example # Environment variables template
│ └── inviter.db # SQLite database file
│
├── frontend/
│ ├── node_modules/ # NPM dependencies
│ ├── public/ # Static assets
│ ├── src/
│ │ ├── components/
│ │ │ ├── DarkModeToggle.js # Theme switcher
│ │ │ ├── ErrorBoundary.js # Error handling
│ │ │ ├── InvitationForm.js # Creation form
│ │ │ ├── InvitationList.js # Invitation cards
│ │ │ ├── InvitationPreview.js # Live preview
│ │ │ ├── LoadingSpinner.js # Loading indicator
│ │ │ ├── Navbar.js # Navigation bar
│ │ │ ├── PrivateRoute.js # Protected routes
│ │ │ ├── RecipientSelector.js # Contact selection
│ │ │ ├── StatsCard.js # Analytics cards
│ │ │ └── TemplateSelector.js # Template picker
│ │ ├── contexts/
│ │ │ ├── AuthContext.js # Authentication state
│ │ │ ├── NotificationContext.js # Toast notifications
│ │ │ └── ThemeContext.js # Theme management
│ │ ├── services/
│ │ │ ├── api.js
│ │ ├── pages/
│ │ │ ├── CreateInvitation.js # Multi-step creation
│ │ │ ├── Dashboard.js # Main dashboard
│ │ │ ├── InvitationDetails.js # Detailed view
│ │ │ ├── Login.js # Authentication
│ │ │ ├── ResponsePage.js # Public response page
│ │ │ └── Signup.js # User registration
│ │ ├── App.js # Main React component
│ │ ├── App.css # Main App css React component
│ │ ├── index.css # Main Index css React component
│ │ └── index.js # React entry point
│ ├── .env # Frontend environment vars
│ ├── package.json # NPM dependencies
│ ├── package-lock.json # Lockfile
│ └── tailwind.config.js # Tailwind CSS config
│
├── .gitignore # Version control exclusions
└── README.md # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Python 3.9+
- Node.js 16+
- PostgreSQL (optional, SQLite works for development)
- Twilio account (for SMS functionality)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/inviter.git
   cd inviter/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head  # If using Alembic
   # Or let SQLAlchemy create tables on first run
   ```

6. **Start the backend server**
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   # Create .env file
   echo "REACT_APP_API_URL=http://localhost:8000" > .env
   ```

4. **Start the development server**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000`

## 🔑 API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login with credentials
- `GET /auth/me` - Get current user profile

### Invitations
- `POST /invitations` - Create new invitation
- `GET /invitations` - List user's invitations
- `GET /invitations/{id}` - Get invitation details
- `DELETE /invitations/{id}` - Cancel invitation

### Responses (Public)
- `GET /respond/{link}` - Get invitation for response
- `POST /respond/{link}` - Submit response

### Messages
- `GET /invitations/{id}/messages` - Get invitation messages
- `PUT /messages/{id}/read` - Mark message as read

### Analytics
- `GET /analytics/dashboard` - Get dashboard statistics

## 🔒 Security Features

1. **Secure Link Generation**: Each recipient gets a unique, cryptographically secure link
2. **JWT Authentication**: Stateless authentication with expiring tokens
3. **Password Hashing**: BCrypt with salt for password storage
4. **CORS Protection**: Configured for production domains
5. **Rate Limiting**: Prevent abuse of public endpoints
6. **Input Validation**: Pydantic schemas validate all inputs
7. **SQL Injection Protection**: SQLAlchemy ORM prevents SQL injection

## 📱 SMS Integration

The app uses Twilio for SMS delivery. Each invitation generates:
- A short, friendly message
- A secure, unique link for each recipient
- No authentication required for recipients

Example SMS:
```
Hi Sarah! John invited you: Team Meeting Tomorrow. 
Respond here: https://invite.app/r/abc123
```

## 🎨 UI/UX Highlights

- **Real-time Preview**: See how your invitation looks while creating it
- **Progress Visualization**: Visual progress bars show response rates
- **Mobile-First Design**: Fully responsive for all devices
- **Accessibility**: WCAG compliant with semantic HTML
- **Loading States**: Skeleton screens and smooth transitions
- **Error Handling**: User-friendly error messages

## 🚧 Future Enhancements

### Phase 2 Features
- [ ] Email invitation support
- [ ] Recurring invitations
- [ ] Calendar integration (Google, Outlook)
- [ ] Advanced analytics and reports
- [ ] Bulk import from CSV/Excel
- [ ] Custom branding options

### Phase 3 Features
- [ ] Native mobile apps (iOS/Android)
- [ ] WhatsApp integration
- [ ] Video invitation messages
- [ ] RSVP for multi-event series
- [ ] Waitlist management
- [ ] QR code check-in

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by the complexity of modern event planning
- Built with modern web technologies
- Designed for simplicity and efficiency

## 📞 Support

For questions or support, please open an issue on GitHub or contact support@inviter.app

---

**Made with ❤️ by the Inviter Team**
