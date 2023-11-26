const express = require('express');
const bodyParser = require('body-parser');
const port = 5501;
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use(bodyParser.json());

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

let data = {
    "todos": [
        {
            todo: "Homework",
            done: false,
            id: 1,
            category: "School",
            dueDate: "2021-03-01"
        },
    ],
    "categories": ['All', 'Work', 'School', 'Home'],
}

app.get('/data', (req, res) => {
    res.json(data);
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
    data.todos.push(newTodo); // Fixed variable name
    res.json(newTodo);
});

// Put To-Do
app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = data.todos.findIndex(todo => todo.id === id);

    if (todoIndex === -1) {
        return res.status(404).send("To-Do not found.");
    }

    // Check if the 'done' property is present
    if (req.body.hasOwnProperty('done')) {
        data.todos[todoIndex].done = req.body.done;
    }

    // Check if the 'todo' property (task name) is present
    if (req.body.hasOwnProperty('todo')) {
        data.todos[todoIndex].todo = req.body.todo;
    }

    res.json(data.todos[todoIndex]);
});



// Delete To-Do
app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = data.todos.findIndex(todo => todo.id === id);

    if (index !== -1) {
        data.todos.splice(index, 1);
        res.json({ message: 'Todo deleted successfully.' });
    } else {
        res.status(404).json({ message: 'Todo not found.' });
    }
});

// Get all To-Dos for a category
app.get('/category/:category/todos', (req, res) => {
    const category = req.params.category;
    const categoryTodos = data.todos.filter(todo => todo.category === category); // Fixed variable name
    res.json(categoryTodos);
});

// Get Categories
app.get('/categories', (req, res) => {
    res.json(data.categories);
});

// Post Category
app.post('/categories', (req, res) => {
    const newCategory = req.body.category;
    if (!newCategory) {
        return res.status(400).send("Category is required.");
    }

    data.categories.push(newCategory); // Fixed variable name
    res.send("Category added successfully.");
});

// Put Category
app.put('/categories/:category', (req, res) => {
    const oldCategory = req.params.category;
    const newCategory = req.body.category;
    const index = data.categories.findIndex(cat => cat === oldCategory); // Fixed variable name

    if (index === -1) {
        return res.status(404).send("Category not found.");
    }

    data.categories[index] = newCategory; // Fixed variable name
    res.send("Category updated successfully.");
});

// Delete Category
app.delete('/categories/:category', (req, res) => {
    const category = req.params.category;
    const index = data.categories.findIndex(cat => cat === category); // Fixed variable name

    if (index === -1) {
        return res.status(404).send("Category not found.");
    }

    data.categories.splice(index, 1); // Fixed variable name
    res.send("Category deleted successfully.");
});

app.delete('/todos', (req, res) => {
    data.todos = data.todos.filter(todo => !todo.done);
    res.send('Completed tasks cleared');
});


