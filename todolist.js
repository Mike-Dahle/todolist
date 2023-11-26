const addTask = document.querySelector('.add')
const input = document.querySelector('#textField')
const todoList = document.querySelector('.todoList')
const pendingText = document.querySelector('.pending')


//const tasks = []
//const categories = ['All', 'Work', 'School', 'Home']

function fetchTasks() {
    fetch('http://localhost:5501/data')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            populatetodoList(data.todos, data.categories);
            populateCategories(data.categories);
            pendingText.textContent = `You have ${pendingTasks(data.todos)} remaining task(s)`
        })
        .catch(error => console.error('Error:', error));
}

// populate the list
fetchTasks();

// Create a new task
function createTask() {
    const taskInput = document.querySelector('#textField'); // Task input field
    const categorySelect = document.querySelector('.categorySelector'); // Category select field
    const task = taskInput.value;
    const category = categorySelect.value; // Get selected category
    const dueDate = document.querySelector('.dateInput');
    const dueDateValue = dueDate.value;

    fetch('http://localhost:5501/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: task, category: category, dueDate: dueDateValue }),
    })
    .then(response => response.json())
    .then(() => {
        fetchTasks(); // Refresh the list
        taskInput.value = ''; // Clear the input field
    })
    .catch(error => console.error('Error:', error));
}

// Add a new task to the list
addTask.addEventListener('click', () => createTask());
const clearBtn = document.querySelector('.clear')
clearBtn.addEventListener('click', () => {clearDone()})

// Populate the todo list
function populatetodoList(tasks, categories) {
    // Clear the list
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

    categories.forEach((category) => {
        const ul = document.createElement('ul');
        ul.setAttribute('id', category);
        ul.innerHTML = `<h2>${category}</h2>`;
        todoList.appendChild(ul);
    });

    // Create list elements for each todo
    tasks.forEach((task) => {
        const li = document.createElement('li')
        li.setAttribute('id', task.id)
        const spanOne = document.createElement('span');
        const spanTwo = document.createElement('span');
        const trashIcon = document.createElement('i');
        const editIcon = document.createElement('i');
        const taskText = document.createElement('p');
        const dueDate = document.createElement('input');
        dueDate.setAttribute('type', 'date');
        dueDate.classList.add('dueDate')
        dueDate.value = task.dueDate;
        
        dueDate.addEventListener('change', (event) => {
            task.dueDate = event.target.value
        })
        
        taskText.textContent = task.todo;

        trashIcon.classList.add('fa', 'fa-trash');
        editIcon.classList.add('fa', 'fa-edit');
        spanOne.classList.add('editBtn');


        li.appendChild(taskText);
        li.appendChild(dueDate);
        li.appendChild(spanOne);
        li.appendChild(spanTwo);

        // check if task is done, if so add the done class
        if (task.done === true) {
            taskText.style.textDecoration = 'line-through';
        }

        spanOne.appendChild(editIcon);
        spanTwo.appendChild(trashIcon);
        spanOne.addEventListener('click', () => {editTask(task.id)});
        spanTwo.addEventListener('click', () => {
            deleteTask(task.id);
        });
        

        taskText.addEventListener('click', () => {markDone(task.id, task.done);})

        li.appendChild(spanOne);
        li.appendChild(spanTwo);
        
        const categoryUl = document.getElementById(task.category);
        if (categoryUl) {
            categoryUl.appendChild(li);
        }

        pendingText.textContent = `You have ${pendingTasks(tasks)} remaining task(s)`
        
    })
}




// for each item in the array if the task name matches the li item and its done, then delete it from the array
function deleteTask(taskId) {
    fetch(`http://localhost:5501/todos/${taskId}`, {
        method: 'DELETE',
    })
    .then(() => fetchTasks()) // Refresh the list
    .catch(error => console.error('Error:', error));
}


//check
function clearDone() {
    fetch('http://localhost:5501/todos', {
        method: 'DELETE'
    })
    .then(() => fetchTasks())
    .catch(error => console.error('Error:', error));
}


    

function pendingTasks(arr) {
    return arr.filter((arr) => arr.done === false).length
}

function editTask(taskId) {
    const newName = prompt("Enter new name for the task"); // Simple prompt for new name, replace with your logic
    if (!newName) return; // Exit if no new name is provided

    fetch(`http://localhost:5501/todos/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: newName }),
    })
    .then(() => fetchTasks())
    .catch(error => console.error('Error:', error));
}

function markDone(taskId, isDone) {
    fetch(`http://localhost:5501/todos/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done: !isDone }),
    })
    .then(() => fetchTasks())
    .catch(error => console.error('Error:', error));
}


function populateCategories(categories) {
    const categoryList = document.querySelector('.categoryList');
    const categorySelector = document.querySelector('.categorySelector');
    
    // Clear out existing li elements
    categoryList.innerHTML = '';
    categorySelector.innerHTML = '';

    categories.forEach((category) => {
        const li = document.createElement('li');
        const option = document.createElement('option');
        option.innerHTML = 
        `<option value="${category}">${category}</option>`;
        categorySelector.appendChild(option);
        li.classList.add('categories');
        li.innerHTML = 
        `<p>${category}</p>
            <div>
                <button class="catDelete" onclick="deleteCategory('${category}')"><span class="fa fa-trash"></span></button>
                <button class="catEdit" onclick="editCategory('${category}')"><span class="fa fa-edit"></span></button>
            </div>`;
        categoryList.appendChild(li);
    });
}

function addCategory() {
    const categoryInput = document.getElementById('categoryTextField');
    const newCategory = categoryInput.value;

    if (newCategory.trim() !== '') {
        fetch('http://localhost:5501/categories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: newCategory })
        })
        .then(() => {
            categoryInput.value = '';
            fetchTasks(); // Refresh categories
        })
        .catch(error => console.error('Error:', error));
    } else {
        alert('Please enter a category');
    }
}

function deleteCategory(category) {
    fetch(`http://localhost:5501/categories/${category}`, {
        method: 'DELETE'
    })
    .then(() => fetchTasks()) // Refresh categories
    .catch(error => console.error('Error:', error));
}


function editCategory(category) {
    const newName = prompt('Enter new category name', category);
    if (newName !== null && newName.trim() !== '') {
        fetch(`http://localhost:5501/categories/${category}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ category: newName })
        })
        .then(() => fetchTasks()) // Refresh categories
        .catch(error => console.error('Error:', error));
    }
}
