const express = require('express');
const bodyParser = require('body-parser');
const port = 5501;
const app = express();
const cors = require('cors');
app.use(cors());


app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

let todos = [
    {
        todo: "Homework",
        done: false,
        id: 1,
        category: "School",
        dueDate: "2021-03-01"
    },
];

let categories = ['All', 'Work', 'School', 'Home'];

// Get To-Dos
app.get('/todos', (req, res) => {
    res.json(todos);
});

// Post To-Do
app.post('/todos', (req, res) => {
    if (!req.body.todo) {
        return res.status(400).send("To-Do is required.");
    }

    const newTodo = {
        todo: req.body.todo,
        done: false,
        id: Date.now(),
        category: req.body.category,
        dueDate: req.body.dueDate
    };
    todos.push(newTodo);
    res.json(newTodo);
});

// Put To-Do
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
        return res.status(404).send("To-Do not found.");
    }

    todos[todoIndex].done = !todos[todoIndex].done;
    res.json(todos[todoIndex]);
});

// Delete To-Do
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
        return res.status(404).send("To-Do not found.");
    }

    todos.splice(todoIndex, 1);
    res.send("To-Do deleted successfully.");
});

// Get all To-Dos for a category
app.get('/category/:category/todos', (req, res) => {
    const category = req.params.category;
    const categoryTodos = todos.filter(todo => todo.category === category);
    res.json(categoryTodos);
});

// Get Categories
app.get('/categories', (req, res) => {
    res.json(categories);
});

// Post Category
app.post('/categories', (req, res) => {
    const newCategory = req.body.category;
    if (!newCategory) {
        return res.status(400).send("Category is required.");
    }

    categories.push(newCategory);
    res.send("Category added successfully.");
});

// Put Category
app.put('/categories/:category', (req, res) => {
    const oldCategory = req.params.category;
    const newCategory = req.body.category;
    const index = categories.findIndex(cat => cat === oldCategory);

    if (index === -1) {
        return res.status(404).send("Category not found.");
    }

    categories[index] = newCategory;
    res.send("Category updated successfully.");
});

// Delete Category
app.delete('/categories/:category', (req, res) => {
    const category = req.params.category;
    const index = categories.findIndex(cat => cat === category);

    if (index === -1) {
        return res.status(404).send("Category not found.");
    }

    categories.splice(index, 1);
    res.send("Category deleted successfully.");
});
