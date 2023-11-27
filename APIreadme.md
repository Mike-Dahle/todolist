# To-Do List API
## Introduction
This To-Do List API allows for managing a simple to-do list, including tasks and categories. It's built using Express.js and provides endpoints for creating, updating, deleting, and retrieving to-do items and categories.

## Setup and Installation
1. Ensure Node.js is installed on your system.
2. Clone the repository and navigate to the project directory.
3. Install dependencies:
```bash
npm install express body-parser cors
```
4. Start the server:
```bash
node server.js
```
## API Endpoints
### To-Dos
Get All To-Dos
- Endpoint: GET /data
- Description: Retrieve all to-do items.

Create a To-Do
- Endpoint: POST /todos
- Body:
    - todo: String (required)
    - category: String
    - dueDate: String (YYYY-MM-DD)
- Description: Add a new to-do item.

Update a To-Do
- Endpoint: PUT /todos/:id
- Parameters:
    - id: Integer (required)
- Body:
    - todo: String
    - done: Boolean
- Description: Update a to-do item's details.

Delete a To-Do
- Endpoint: DELETE /todos/:id
- Parameters:
    - id: Integer (required)
- Description: Delete a to-do item.

Clear Completed To-Dos
- Endpoint: DELETE /todos
- Description: Delete all completed to-do items.

### Categories
Get All Categories
- Endpoint: GET /categories
- Description: Retrieve all categories.

Get To-Dos by Category
- Endpoint: GET /category/:category/todos
- Parameters:
    - category: String (required)
- Description: Retrieve to-dos for a specific category.

Create a Category
- Endpoint: POST /categories
- Body:
    - category: String (required)
- Description: Add a new category.

Update a Category
- Endpoint: PUT /categories/:category
- Parameters:
    - category: String (required)
- Body:
    - category: String (required)
- Description: Update a category.

Delete a Category
- Endpoint: DELETE /categories/:category
- Parameters:
    - category: String (required)
- Description: Delete a category.

This API was made as part of a school project for my Web and App Development degree at UVU
