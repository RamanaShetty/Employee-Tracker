# Employee Tracker

This is a full-stack application for tracking employee work activities. Follow the steps below to set up and run the application.

## Setup and Running the Application

1. **Install Dependencies, Set Environment Variables, and Start Application**  
   Copy and paste the following commands in your terminal:

   ```bash
   # Install dependencies for client and server
   cd employee-tracker-client && npm install
   cd ../employee-tracker-server && npm install

   # Create .env file with necessary environment variables
   echo "MONGO_URI=<your mongodb connection string>" > employee-tracker-server/config/.env
   echo "JWT_SECRET=employee_work_tracking_system" >> employee-tracker-server/config/.env

   # Start the client
   cd ../employee-tracker-client && npm run dev

   # Open a new terminal tab or window for the server
   cd ../employee-tracker-server && npm run start

   # To access the application, use the following credentials:
   Email: john.doe@example.com
   Password: john123
   Role: superadmin
   ```

**Note: We have used MongoDB Compass instead of Atlas. So all the collections are exported and are available in the MongoSchema Folder**
