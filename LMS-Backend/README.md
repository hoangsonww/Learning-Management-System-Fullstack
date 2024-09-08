# Learning Management System Backend

This is the backend of a Learning Management System (LMS) built using Django and Django REST Framework. The backend provides a comprehensive REST API to manage users, courses, categories, lessons, quizzes, questions, choices, enrollments, progress, and notifications.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Server](#running-the-server)
- [Using the Admin Interface](#using-the-admin-interface)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Testing the APIs](#testing-the-apis)
  - [Using `curl`](#using-curl)
  - [Using Postman](#using-postman)
  - [Using Swagger UI](#using-swagger-ui)
- [Seeding Sample Data](#seeding-sample-data)

## Prerequisites

- Python 3.6 or higher
- MongoDB running locally or remotely
- Redis running locally or remotely

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/hoangsonww/Fullstack-Learning-Management-System.git
   cd Fullstack-Learning-Management-System/LMS-Backend
   ```

2. **Create and Activate a Virtual Environment**

   ```bash
   python -m venv .venv
   # On Windows
   .venv\Scripts\activate
   # On macOS/Linux
   source .venv/bin/activate
   ```

3. **Install Required Packages**

   ```bash
   pip install -r requirements.txt
   ```

4. **Configure MongoDB and Redis**

   - Make sure MongoDB and Redis are running on your machine or have the correct connection strings in `settings.py`.
   
   - If you don't have MongoDB and Redis installed, run the following commands to install them:
     - For MacOS/Linux:
       ```bash
       brew tap mongodb/brew
       brew install mongodb-community
       brew services start mongodb-community
       brew install redis
       redis-server
       ```  
       
     - For Windows:
       - Download and install MongoDB from [here](https://www.mongodb.com/try/download/community).
       - Download and install Redis from [here](https://redis.io/download).

5. **Apply Migrations**

   Make sure all migrations are applied:

   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create a Superuser**

   To access the Django admin interface, you need to create a superuser:

   ```bash
   python manage.py createsuperuser
   ```

   Follow the prompts to set up the username, email, and password. 
   Be sure to store or remember these credentials for later use. You will need them to log in to the admin interface and test the API endpoints

7. **Seed Sample Data**

   Run the following command to seed the database with sample data:

   ```bash
   python manage.py seed_sample_data
   ```

## Running the Server

Start the Django development server:

```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`.

## Using the Admin Interface

To use the Django admin interface:

1. Go to [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/).
2. Log in using the superuser credentials you created.
3. You can manage users, courses, categories, lessons, quizzes, questions, choices, enrollments, progress, and notifications directly from the admin interface.

## API Endpoints

| Endpoint                             | Method | Description                                |
|--------------------------------------|--------|--------------------------------------------|
| `/api/users/`                        | GET    | Retrieve a list of all users.              |
| `/api/users/{id}/`                   | GET    | Retrieve a specific user instance.         |
| `/api/users/`                        | POST   | Create a new user instance.                |
| `/api/users/{id}/`                   | PUT    | Update a specific user instance.           |
| `/api/users/{id}/`                   | DELETE | Delete a specific user instance.           |
| `/api/courses/`                      | GET    | Retrieve a list of all courses.            |
| `/api/courses/{id}/`                 | GET    | Retrieve a specific course instance.       |
| `/api/courses/`                      | POST   | Create a new course instance.              |
| `/api/courses/{id}/`                 | PUT    | Update a specific course instance.         |
| `/api/courses/{id}/`                 | DELETE | Delete a specific course instance.         |
| `/api/categories/`                   | GET    | Retrieve a list of all categories.         |
| `/api/categories/{id}/`              | GET    | Retrieve a specific category instance.     |
| `/api/categories/`                   | POST   | Create a new category instance.            |
| `/api/categories/{id}/`              | PUT    | Update a specific category instance.       |
| `/api/categories/{id}/`              | DELETE | Delete a specific category instance.       |
| ...                                  | ...    | ... (Add endpoints for lessons, quizzes, etc.) |

## Authentication

**Important**: Most API endpoints require authentication. You must first log in to obtain an authentication token.

1. **Log in to Get a Token**

   Use the `/api/auth/login/` endpoint to log in and get a token.

   ```bash
   curl -X POST http://127.0.0.1:8000/api/auth/login/ -H "Content-Type: application/json" -d '{
     "username": "your_username",
     "password": "your_password"
   }'
   ```

   This will return a response with a token. You must include this token in the `Authorization` header as `Token <your_token_here>` for all subsequent API requests.

2. **Use the Token in API Requests**

   Include the token in the `Authorization` header:

   ```bash
   -H "Authorization: Token <your_token_here>"
   ```

## Testing the APIs

You can test the API using `curl`, Postman, or Swagger UI.

### Using `curl`

To test the API using `curl`, use the commands below. Replace `<your_token_here>` with the token obtained from the login endpoint.

- **List All Users**

  ```bash
  curl -X GET http://127.0.0.1:8000/api/users/ -H "Content-Type: application/json" -H "Authorization: Token <your_token_here>"
  ```

- **Create a New Course**

  ```bash
  curl -X POST http://127.0.0.1:8000/api/courses/ -H "Content-Type: application/json" -H "Authorization: Token <your_token_here>" -d '{
    "title": "New Course",
    "description": "This is a new course description.",
    "instructor": "{user_id}",
    "category": "{category_id}",
    "price": 150.00,
    "published": true
  }'
  ```

Repeat similar `curl` commands for other endpoints.

### Using Postman

1. Open Postman.
2. Create a new request for each endpoint.
3. Set the method (GET, POST, PUT, DELETE) and URL (e.g., `http://127.0.0.1:8000/api/users/`).
4. Under the "Authorization" tab, choose "Bearer Token" and paste your token.
5. Send the request and check the response.

### Using Swagger UI

1. Navigate to the Swagger UI at [http://127.0.0.1:8000/swagger/](http://127.0.0.1:8000/swagger/).
2. Click on an endpoint to expand it.
3. Click the "Try it out" button.
4. Enter the required parameters and authentication token (`Bearer <your_token_here>`) in the "Authorization" header.
5. Click "Execute" to see the API response.

## Seeding Sample Data

If you want to seed the database with realistic sample data, you can run the `seed_sample_data` management command:

```bash
python manage.py seed_sample_data
```

This command will populate the database with randomly generated users, courses, categories, lessons, quizzes, questions, choices, enrollments, progress records, and notifications.

## Conclusion

With the setup complete, you can now fully explore and test the API endpoints of the Learning Management System backend using either `curl`, Postman, or the Swagger UI. Don't forget to authenticate first by logging in to obtain a token!
