const express = require('express');
const bodyParser = require('body-parser');
const port = 5501;
const app = express();
const urlencoded = require('express').urlencoded;
app.use(bodyParser.json());
app.use(urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
})

let todos = [
    {
        todo: "Homework",
        done: false,
        Id: 1,
    },
    {
        todo: "Work",
        done: false,
        Id: 2,
    },
    {
        todo: "Clean",
        done: false,
        Id: 3,
    },
]

let = categories = ['All', 'Work', 'School', 'Home'];

// Get To-Dos
app.get('/api/todos', (req, res) => {
    res.send(todos);
});

// Post To-Do
app.post('/api/todos', (req, res) => {
    todos.push({
        todo: req.body.todo,
        done: false,
        id: Date.now(),
        category: req.body.category,
        dueDate: req.body.dueDate
    });
    res.send("To-Do added successfully.");
});

// Put To-Do
app.put('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find((todo) => todo.id === id);
    todo.done = !todo.done;
    res.send("To-Do updated successfully.");
});

// Delete To-Do
app.delete('/api/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    todos = todos.filter((todo) => todo.id !== id);
    res.send("To-Do deleted successfully.");
});

// Get all To-Dos for a category
app.get('/api/todos/:category', (req, res) => {
    const category = req.params.category;
    const categoryTodos = todos.filter((todo) => todo.category === category);
    res.send(categoryTodos);
});

// Get Categories  
app.get('/api/categories', (req, res) => {
    res.send(categories);
});

// Post Category
app.post('/api/categories', (req, res) => {
    categories.push(req.body.category);
    res.send("Category added successfully.");
});

// Put Category
app.put('/api/categories/:category', (req, res) => {
    const category = req.params.category;
    const newCategory = req.body.category;
    const index = categories.findIndex((cat) => cat === category);
    categories[index] = newCategory;
    res.send("Category updated successfully.");
});

// Delete Category
app.delete('/api/categories/:category', (req, res) => {
    const category = req.params.category;
    categories = categories.filter((cat) => cat !== category);
    res.send("Category deleted successfully.");
});