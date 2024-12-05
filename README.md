# SchoolHive

```markdown
# School Management Web App

A full-stack web application built with the **MERN stack** (MongoDB, Express, React, Node.js) and **PostgreSQL** for managing school data. This app allows users to search, view details, and add schools. It also uses **pgAdmin** for local database management.

The frontend is deployed using **Netlify**, and the backend is deployed on **Heroku**.

## Features

- **School Listing**: View all schools in a responsive grid layout.
- **School Details**: Click on a school card to see detailed information.
- **Add School**: Add new schools to the database.
- **Search Bar**: Search schools by name for quick access.
- **Pagination**: Navigate through school listings using pagination.
- **Responsive Design**: Optimized for mobile and desktop views.

## Tech Stack

- **Frontend**: React.js, CSS, HTML
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Database Management**: pgAdmin (local setup)
- **Deployment**: Heroku (backend), Netlify (frontend)

## Demo

Check out the live demo of the app:

- Frontend (Netlify): [Live Demo](https://your-netlify-app-url)
- Backend (Heroku): [API Documentation](https://your-heroku-backend-url)

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed on your local machine:

- **Node.js** (v14 or above)
- **npm** or **yarn**
- **PostgreSQL** (for local database management)
- **pgAdmin** (for managing your PostgreSQL database)

### Installation

1. Clone the repository to your local machine:
   ```bash
   git clone https://github.com/yourusername/school-management-app.git
   cd school-management-app
   ```

2. Install dependencies for both frontend and backend:
   
   - **Backend (Node.js & Express)**:
     ```bash
     cd backend
     npm install
     ```

   - **Frontend (React.js)**:
     ```bash
     cd frontend
     npm install
     ```

3. Setup PostgreSQL Database:

   - If you're using **pgAdmin**, create a new PostgreSQL database and connect to it locally.
   - If you're using a cloud PostgreSQL provider, you can skip the local setup and use the provided database connection URL.

4. Update your **.env** files in both the frontend and backend directories:

   - In the **backend/.env** file:
     ```env
     DB_HOST=localhost
     DB_PORT=5432
     DB_USER=your_username
     DB_PASSWORD=your_password
     DB_NAME=your_database_name
     ```
     (Or use a **Heroku Postgres** URL if deploying on Heroku.)

   - In the **frontend/.env** file (if necessary):
     ```env
     REACT_APP_API_URL=http://localhost:5000
     ```

5. Run the backend server:

   ```bash
   cd backend
   npm start
   ```

6. Run the frontend server:

   ```bash
   cd frontend
   npm start
   ```

   Now your application will be running locally at:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5001](http://localhost:5001)

## Database Configuration

### PostgreSQL Setup

If you are running a local PostgreSQL database, make sure to:

- Create a database for your app in **pgAdmin** or directly through the PostgreSQL shell.
- Import any required schema and data if needed.

For cloud databases (like **Heroku Postgres**), ensure the connection string is properly set in your backend `.env` file.

### Example Schema for Schools

```sql
CREATE TABLE schools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address TEXT,
    contact_email VARCHAR(255),
    website_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```


### Environment Variables

Make sure to configure the necessary environment variables in your deployment platform for both frontend and backend.

## Usage

1. **Homepage**: View a list of all schools. Use the search bar to filter schools by name.
2. **School Detail**: Click on any school to view detailed information.
3. **Add School**: Click the "Add School" button to add a new school.
4. **Pagination**: Navigate between pages of school listings.

## Contributing

We welcome contributions! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Thanks to [pgAdmin](https://www.pgadmin.org/) for database management.
- This project was built as part of my learning journey in full-stack development.

```

### Key Sections in the README:
1. **Features**: Lists the main features of the application.
2. **Tech Stack**: Describes the technologies used in the project.
3. **Demo**: Links to the live demo for frontend and backend.
4. **Getting Started**: Provides detailed setup instructions for running the app locally.
5. **Database Configuration**: Describes how to set up PostgreSQL locally or remotely.
6. **Deployment**: Provides instructions for deploying the frontend (Netlify) and backend (Heroku).
7. **Usage**: Explains how users can interact with the app once it’s running.
8. **Contributing**: Guidelines for contributing to the project.
9. **License**: Project license details.

Let me know if you need further modifications or adjustments!
