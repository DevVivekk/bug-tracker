# Intersift Server

This project uses a **Node.js server** to run a custom Next.js application and provides a RESTful API for user, bug reporter, and admin functionalities.

## Project Structure

### 1. Models (`server/model/`)
Models define the data structure for MongoDB collections using Mongoose.

- **`user.ts`**: Defines the user schema (email, username, password, role).
- **`bugs.ts`**: Defines the bug schema (title, description, severity, createdBy, etc.).

### 2. Controllers (`server/controller/`)
Controllers contain the business logic for handling requests.

- **`userController/usersetup.ts`**: Handles user signup, login, and user info retrieval.
- **`reporterController/resporter.ts`**: Handles bug submission, updating, and fetching bugs for reporters.
- **`adminController/admin.ts`**: Handles admin actions like viewing and updating all bugs.

### 3. Routes (`server/router/`)
Routes define the API endpoints and connect them to controllers.

- **`userRoutes.ts`**: Endpoints for user signup, login, and info (`/server/api/v1/user`).
- **`reporterRoutes.ts`**: Endpoints for reporters to submit and view bugs (`/server/api/v1/reporter`).
- **`adminRoutes.ts`**: Endpoints for admin bug management (`/server/api/v1/admin`).

## How It Works

- The **Node.js server** (see [`server/server.ts`](server/server.ts)) runs Next.js and exposes API endpoints for user, reporter, and admin operations.
- All API requests are handled by Express and routed to the appropriate controller.
- MongoDB is used for data storage via Mongoose models.

## Getting Started

1. Install dependencies:
   ```sh
   npm install

2. Start thr App:
  ```sh
  npm run dev

3. Build the App:
  ```sh
  npm run build  

## Note
- Create .env and .env.local file. In the env file mentio MONGO_URL and PORT and in the env local file mention NEXT_PUBLIC_URL as http://localhost:3000 where the port should be same.  