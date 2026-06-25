"# trip-ai-backend" 


# TripAI Backend ✈️

An AI-powered travel itinerary generator. Users upload a travel document (ticket, booking confirmation, or passport), and the AI extracts trip details and generates a complete day-by-day itinerary.

## Features

- 🔐 JWT-based user authentication (Register / Login)
- 📄 Travel document upload (PDF / Image) via Multer
- 🤖 AI-powered extraction of trip details — destination, dates, flight number, hotel name, traveler names — using Google Gemini
- 🗺️ AI-generated day-by-day itinerary with morning / afternoon / evening activity suggestions
- 📚 Per-user trip history, stored in MongoDB
- 🖼️ Downloadable itinerary as PDF or Image (frontend feature)

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JSON Web Tokens (JWT), bcrypt for password hashing |
| File Uploads | Multer |
| AI / LLM | Google Gemini API (gemini-2.5-flash) |
| HTTP Client | Axios |
| Frontend (separate repo) | React, React Router, Tailwind CSS, Axios, html2canvas-pro, jsPDF, react-hot-toast |

## Project Structure

```
trip-ai-backend/
├── src/
│   ├── config/
│   │   └── db.js                    # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js        # Register / Login logic
│   │   └── itineraryController.js   # Upload, AI extraction, itinerary generation
│   ├── models/
│   │   ├── User.js                  # User schema
│   │   └── Itinerary.js             # Itinerary schema
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── itineraryRoutes.js
│   └── middlewares/
│       ├── authMiddleware.js        # JWT verification (protect routes)
│       └── uploadMiddleware.js      # Multer config for file uploads
├── .env.example
├── .gitignore
├── server.js                         # App entry point
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A MongoDB database (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)
- A [Google Gemini API key](https://aistudio.google.com/app/apikey) (free tier available)

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory (see `.env.example` for reference):
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   The server will run at `http://localhost:5000`.

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and receive a JWT | No |

### Itinerary

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/api/itinerary/generate` | Upload a document and generate an AI itinerary | Yes |
| GET | `/api/itinerary/history` | Get the logged-in user's trip history | Yes |
| GET | `/api/itinerary/:id` | Get a single itinerary by ID | Yes |

> Protected routes require an `Authorization: Bearer <token>` header.

## Notes & Limitations

- The Gemini free tier has rate limits (commonly 20 requests/day for some models on the free tier). For production use, enabling billing on the Gemini API is recommended.
- Uploaded files are deleted from the server immediately after AI processing completes.
- This is the backend only — see the frontend repository for the React client.

## License

MIT
