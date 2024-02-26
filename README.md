# Bookworms

Welcome to Bookworms! Bookworms is a web application built with Flask for the backend and React for the frontend. It provides a platform for users to manage their book collection, add reviews for books, and interact with other book enthusiasts.

## Features

- User authentication: Users can register and login to the platform.
- Books catalog and details: Users can see all those books and check detail about each of them.
- Add Books: Logged-in users can add new books to the database, providing details such as title, author, description, and image.
- Add Reviews: Logged-in users can add reviews for books, including their own review and rating.
- Edit Reviews: Logged-in users have the ability to edit their own reviews after submission.
- User Profile: Each user has a profile with an image and description (Note: Editing profile is not yet implemented).
- JWT Tokens: Authentication is handled using JWT tokens.
- SQLite Database: Books, users, and reviews are stored in an SQLite database.

## Technologies Used

- **Backend**: Flask
- **Frontend**: React
- **Database**: SQLite
- **Authentication**: JWT Tokens

## Getting Started

To get started with Bookworms, follow these steps:

### Prerequisites

- Python 3.x
- Node.js
- npm

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/your_username/bookworms.git
   ```

2. Navigate to the backend directory and install Python dependencies:

   ```
   cd ../flask-server
   pip install -r requirements.txt
   ```

3. Navigate to the frontend directory and install npm dependencies:
   ```
   cd ../client
   npm install
   ```

### Configuration

1. Set up the SQLite database by running the following commands from the backend directory:
  ```
  flask db init
  flask db migrate
  flask db upgrade
  ```

2. Configure the backend by creating a .env file in the backend directory and providing the following variables:
  ```
  SECRET_KEY=your_secret_key
  DATABASE_URL=sqlite:///path/to/your/database.db
  ```

### Running the Application

  1. Start the Flask backend:
  ```
  cd ../flask-server
  flask run
  ```

2. Start the React frontend:
  ```
  cd ../client
  npm start
  ```

3. Visit http://localhost:3000 in your web browser to access the application.

## Contributing
I welcome contributions from the community! If you'd like to contribute to Bookworms, please fork the repository, make your changes, and submit a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Thank you for using Bookworms! If you have any questions or feedback, feel free to reach out to us. Happy reading! 📚🐛


