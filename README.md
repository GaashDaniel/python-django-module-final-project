# ArticleHub - Blog Platform

ArticleHub is a modern blogging platform that allows users to read, and comment articles. The project consists of a Django backend and a React frontend.

## Project Structure

The project is divided into two main parts:

### Backend (server)

- Built with Django and Django REST Framework
- Provides API for article, comment, and user management
- Includes:
  - `blog` - for article and comment management
  - `core` - for authentication and permissions

### Frontend (client)

- Built with React and Vite
- Uses libraries:
  - Material-UI for user interface
  - React Router for routing
  - JWT for user authentication

## Technologies

### Backend

- Django 5.0
- Django REST Framework
- PostgreSQL
- JWT authentication
- django-taggit for tag management
- django-filter for result filtering
- django-cors-headers for CORS support

### Frontend

- React 19
- Vite 6
- Material UI 7
- React Router 7

## Functionality

### User Management

- User registration and authentication
- User roles: regular users, editors and administrators
- JWT token-based authentication

### Article Management

- Articles include title, content, publication date, and author
- Articles can have tags (for categorization)
- All users can view articles
- Only administrators or editors can create, edit, or delete articles

### Comment Management

- Registered users can add comments to articles
- Comments include content, username, and date
- Administrators can delete inappropriate comments

## API Endpoints

### Authentication

- `POST /api/register/` - Register a new user
- `POST /api/token/` - Obtain JWT token for login
- `POST /api/token/refresh/` - Refresh JWT token

### Articles

- `GET /api/articles/` - Get list of all articles
- `GET /api/articles/?query=<search>` - Search articles by title, content, or tags
- `GET /api/articles/<id>/` - Get a specific article
- `POST /api/articles/` - Create a new article (admin or editor only)
- `PUT /api/articles/<id>/` - Update an article (admin or article owner only)
- `DELETE /api/articles/<id>/` - Delete an article (admin or article owner only)

### Comments

- `GET /api/articles/<id>/comments/` - Get all comments for a specific article
- `POST /api/articles/<id>/comments/` - Add a comment to an article (registered users only)
- `DELETE /api/comments/<id>/` - Delete a comment (admin only)

## Access Control

### Regular Users

- Can register and login
- Can view articles
- Can add comments to articles

### Editors

- Can create, edit, and delete own articles

### Administrators

- Can create, edit, and delete articles
- Can delete any user's comments

## Installation and Setup

### Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL

### Backend Setup

1. Clone the repository:

   ```
   git clone <repository_url>
   cd articlehub/server/articlehub
   ```

2. Create a virtual environment and install dependencies:

   ```
   python -m venv .venv
   source .venv/bin/activate   # On Unix systems
   # or
   .venv\Scripts\activate      # On Windows
   pip install -r requirements.txt
   ```

3. Configure the `.env` file with the required parameters:

   ```
   DEBUG=True
   SECRET_KEY=<your_secret_key>
   DB_NAME=articlehub_db
   DB_USER=<your_database_username>
   DB_PASSWORD=<your_database_password>
   DB_HOST=localhost
   DB_PORT=<your_database_port>
   ```

4. Create a new PostgreSQL database named articlehub_db using pgAdmin:

   Open pgAdmin
   Right-click on Databases → Create → Database
   Set the Database name to articlehub_db
   Click Save

5. Apply migrations and start the server:

   ```
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the client directory:

   ```
   cd articlehub/client
   ```

2. Install packages and start the development server:
   ```
   npm install
   npm run dev
   ```
