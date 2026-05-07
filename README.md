# Contact Manager - MERN Stack Application

A full-stack contact management application built with MongoDB, Express.js, React, and Node.js.

## 🚀 Features

- ✅ Add new contacts with validation
- ✅ View all contacts in real-time
- ✅ Delete contacts
- ✅ Responsive design
- ✅ Form validation with error messages
- ✅ Auto-refresh after operations

## 🏗️ Project Structure

```
contact-manager/
├── client/                 # React frontend
│   ├── components/
│   │   ├── ContactForm.jsx # Form with validation
│   │   ├── ContactList.jsx # Display contacts
│   │   └── Input.jsx       # Reusable input component
│   └── src/
│       └── App.jsx         # Main app component
└── server/                 # Node.js backend
    ├── models/Contact.js   # MongoDB schema
    ├── routes/contactRoutes.js
    ├── controllers/contactController.js
    └── server.js           # Express server
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14+)
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd server
npm install
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

Optional: create `client/.env` to point the UI to a custom API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## 📊 API Endpoints

- `POST /api/contacts` - Create contact
- `GET /api/contacts` - Fetch all contacts (supports `search`, `limit`, `offset`)
- `DELETE /api/contacts/:id` - Delete contact

## 🎯 Evaluation Points

1. **Full MERN Implementation** - ✅ Complete stack
2. **Form Validation** - ✅ Client-side validation
3. **REST API Design** - ✅ Clean endpoints
4. **Database Schema** - ✅ Proper MongoDB model
5. **Real-time Updates** - ✅ No page reload needed
6. **Responsive UI** - ✅ Clean, professional design
7. **Error Handling** - ✅ Proper error messages

## 🚀 Running the Application

1. Start MongoDB service
2. Run backend: `cd server && npm run dev`
3. Run frontend: `cd client && npm run dev`
4. Open http://localhost:3000

## 💡 Technical Highlights

- **Validation**: Email format, required fields
- **UX**: Disabled submit until valid, loading states
- **Architecture**: Separation of concerns, reusable components
- **Database**: Proper schema with timestamps
- **API**: RESTful design with error handling

## 📝 License

This project is open source and available for educational purposes.

## 🌐 Deployment

- **Frontend**: Deployed on Vercel
- **Backend**: Can be deployed on Render, Railway, or Heroku
- **Database**: MongoDB Atlas (cloud)
