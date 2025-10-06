# Employee Management System

A full-stack CRUD application for managing employees built with Node.js, Express, SQLite, and vanilla JavaScript.

## Features

### Core Features ✅
- **Complete CRUD Operations**: Create, Read, Update, and Delete employees
- **RESTful API**: Well-structured backend API endpoints
- **SQLite Database**: Lightweight, file-based database for data persistence
- **Responsive UI**: Clean and modern interface with modal-based editing
- **Form Validation**: Both client-side and server-side validation
- **Search Functionality**: Filter employees by name, email, or position

### Bonus Features ✨
- **Search/Filter Bar**: Real-time search across all employee fields
- **Frontend Form Validation**: Immediate feedback for invalid inputs
- **Error Handling**: Comprehensive error messages and user feedback
- **Empty State**: Helpful UI when no employees exist
- **Animated UI**: Smooth transitions and hover effects

## Tech Stack

### Backend
- Node.js
- Express.js
- SQLite3
- CORS middleware

### Frontend
- Vanilla JavaScript (ES6+)
- HTML5
- CSS3 with animations
- Fetch API for AJAX requests

### Testing
- Jest
- Supertest

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd employee-management-system
```

2. **Install dependencies**
```bash
npm install
```

3. **Create public directory for frontend**
```bash
mkdir public
```

4. **Move index.html to public directory**
```bash
mv index.html public/
```

## Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The application will be available at `http://localhost:3000`

## Running Tests

### Run all tests
```bash
npm test
```

### Run tests with coverage report
```bash
npm test -- --coverage
```

### Run tests in watch mode
```bash
npm run test:watch
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees?search=term` | Search employees |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create new employee |
| PUT | `/api/employees/:id` | Update employee |
| DELETE | `/api/employees/:id` | Delete employee |

### Employee Object Structure
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "position": "Software Engineer",
  "created_at": "2024-01-01 10:00:00"
}
```

## Project Structure

```
employee-management-system/
├── server.js           # Express server and API routes
├── server.test.js      # Backend test suite
├── package.json        # Project dependencies
├── employees.db        # SQLite database 
├── public/
│   └── index.html      # Frontend application
└── README.md          # Project documentation
```

## Validation Rules

### Backend Validation
- **Name**: Required, non-empty string
- **Email**: Required, valid email format
- **Position**: Required, non-empty string

### Frontend Validation
- **Name**: Minimum 2 characters, maximum 100 characters
- **Email**: Valid email format
- **Position**: Minimum 2 characters, maximum 100 characters

## Features Demonstration

### Creating an Employee
1. Click "Add New Employee" button
2. Fill in the form with valid data
3. Click "Save Employee"
4. Employee appears in the table immediately

### Editing an Employee
1. Click "Edit" button next to any employee
2. Modify the information in the modal
3. Click "Save Employee"
4. Changes are reflected immediately

### Deleting an Employee
1. Click "Delete" button next to any employee
2. Confirm the deletion
3. Employee is removed from the table

### Searching Employees
1. Enter search term in the search bar
2. Click "Search" or press Enter
3. Table updates to show matching employees
4. Click "Clear" to reset the search

## Error Handling

The application handles various error scenarios:
- Duplicate email addresses
- Invalid email formats
- Missing required fields
- Network errors
- Database connection issues
- Non-existent employee operations

## Security Considerations

- Input sanitization to prevent XSS attacks
- SQL parameterized queries to prevent SQL injection
- CORS enabled for API access
- HTML escaping for displayed data

## Performance Features

- Efficient SQLite queries with indexing on email
- Debounced search functionality
- Minimal DOM manipulation
- CSS animations for smooth UX

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License