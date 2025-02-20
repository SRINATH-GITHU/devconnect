# DevConnect

DevConnect is a modern social media platform built for developers to connect, share posts, follow others, like posts, and engage through comments. The project is powered by **Django** for the backend and **React + Vite** for the frontend, with **JWT authentication** for secure user sessions.

## Features

- **User Authentication** (JWT-based login/logout)
- **Post Creation & Management** (Create, edit, delete posts)
- **Follow System** (Follow/unfollow other users)
- **Like & Comment System** (Engage with posts through likes and comments)
- **Responsive UI** (Optimized for different screen sizes)

## Tech Stack

### Backend:
- Django (Python)
- Django REST Framework
- JWT Authentication
- MySQL (or SQLite for development)

### Frontend:
- React + Vite
- Tailwind CSS (for styling)
- Axios (for API requests)
- React Router (for navigation)

## Installation & Setup

### Backend Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/devconnect.git
   cd devconnect/backend
   ```
2. Create a virtual environment:
   ```sh
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install dependencies:
   ```sh
   pip install -r requirements.txt
   ```
4. Run migrations and start the server:
   ```sh
   python manage.py migrate
   python manage.py runserver
   ```

### Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd ../frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev 
   ```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
Feel free to modify this README to better fit your project's needs!
