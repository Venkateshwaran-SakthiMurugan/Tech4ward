# Namma Vivasayi

A full-stack web platform connecting farmers from 6 villages directly to consumers. The platform collects crop production data from farmers, maintains a central inventory, and allows city users to view and order available produce.

## Features

- **Admin Panel**: Manage villages, farmers, inventory, and orders
- **Farmer Dashboard**: Add produce and view history
- **Customer Portal**: Browse available produce and place orders
- **Authentication**: Role-based access control

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: React.js with Vite
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   cd frontend
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

## Running the Application

### Development Mode

To run both the backend and frontend concurrently:
```
npm run dev
```

To run the backend only:
```
npm run server
```

To run the frontend only:
```
cd frontend
npm run dev
```

### Production Mode

1. Build the frontend:
   ```
   cd frontend
   npm run build
   ```

2. Start the server:
   ```
   npm start
   ```

## Initial Setup

1. Initialize the database with an admin user and villages:
   ```
   npm run init-db
   ```
   This will create:
   - Admin user (email: admin@nammavivasayi.com, password: admin123)
   - Six villages: Madurai, Coimbatore, Tirunelveli, Salem, Erode, Thanjavur

2. Log in as admin and add farmers for each village
3. Register farmer users
4. Register customer users

## Project Structure

- `/backend`: Server-side code
  - `/config`: Database configuration
  - `/controllers`: API controllers
  - `/middleware`: Express middleware
  - `/models`: Mongoose models
  - `/routes`: API routes

- `/frontend`: Client-side code
  - `/src`: Source files
    - `/components`: Reusable UI components
    - `/features`: Redux slices and services
    - `/pages`: Application pages

## License

MIT