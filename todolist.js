const addTask = document.querySelector('.add')
const input = document.querySelector('#textField')
const todoList = document.querySelector('.todoList')
const pendingText = document.querySelector('.pending')
const clearBtn = document.querySelector('.clear')

//const tasks = []
//const categories = ['All', 'Work', 'School', 'Home']

function fetchTasks() {
    fetch('http://localhost:5501/todos')
        .then(response => response.json())
        .then(data => {
            populatetodoList(data);
            pendingText.textContent = `You have ${pendingTasks(data)} remaining task(s)`
        })
        .catch(error => console.error('Error:', error));
}

// populate the list
fetchTasks();


/* populateCategories(categories);
populatetodoList(tasks); */

// Create a new task
function createTask() {
    const taskInput = document.getElementById('new-task-name'); // Assuming you have an input field with this ID
    const task = taskInput.value;
    const category = 'default'; // Modify as per your category logic
    const dueDate = '2021-01-01'; // Modify as per your due date logic

    fetch('http://localhost:5501/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ todo: task, category: category, dueDate: dueDate }),
    })
    .then(response => response.json())
    .then(() => {
        fetchTasks(); // Refresh the list
        taskInput.value = ''; // Clear the input field
    })
    .catch(error => console.error('Error:', error));
}



clearBtn.addEventListener('click', () => {clearDone(data)})

// Populate the todo list
function populatetodoList(tasks) {

    // Clear the list
    while (todoList.firstChild) {
        todoList.removeChild(todoList.firstChild);
    }

/*     categories.forEach((category) => {
        const ul = document.createElement('ul');
        ul.setAttribute('id', category);
        ul.innerHTML = `<h2>${category}</h2>`;
        todoList.appendChild(ul);
    }); */

    // Create list elements for each todo
    tasks.forEach((task) => {
        const li = document.createElement('li')
        li.setAttribute('id', task.Id)
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
        spanOne.addEventListener('click', () => {editTask(task.Id)});
        spanTwo.addEventListener('click', () => {
            deleteTask(task.Id);
        });
        

        taskText.addEventListener('click', (event) => {markDone(task.Id);})

        li.appendChild(spanOne);
        li.appendChild(spanTwo);
        
        const categoryUl = document.getElementById(task.category);
        if (categoryUl) {
            categoryUl.appendChild(li);
        }

        pendingText.textContent = `You have ${pendingTasks(tasks)} remaining task(s)`
        console.log(tasks)
    })
}

// Add a new task to the list
addTask.addEventListener('click', createTask);
/* addTask.addEventListener('click', () => {
    const categorySelect = document.querySelector('.categorySelector');
    const dueDate = document.querySelector('.dateInput');
    const category = categorySelect.value;
    if (input.value !== '') {
        createTask(input.value, category, dueDate.value)
        input.value = ''
        todoList.innerHTML = ''
        fetchTasks() 
    }      
}) */


// for each item in the array if the task name matches the li item and its done, then delete it from the array
function deleteTask(taskId) {
    fetch(`http://localhost:5501/todos/${taskId}`, {
        method: 'DELETE',
    })
    .then(() => fetchTasks()) // Refresh the list
    .catch(error => console.error('Error:', error));
}


//check
function clearDone(tasks) {
  data.filter((task) => task.done === true).forEach((task) => {
    const index = tasks.findIndex((task) => task.done === true);
    if (index > -1) {
        tasks.splice(index, 1);
        fetchTasks()
    }
  }
)}
    

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

function markDone(taskId) {
    fetch(`http://localhost:5501/todos/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ done: true }),
    })
    .then(() => fetchTasks())
    .catch(error => console.error('Error:', error));
}

/* 
function populateCategories() {
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
                <button class="catDelete" onclick="deleteCategory('${category}', ${tasks})"><span class="fa fa-trash"></span></button>
                <button class="catEdit" onclick="editCategory('${category}')"><span class="fa fa-edit"></span></button>
            </div>`;
        categoryList.appendChild(li);
    });
}

function addCategory() {
    // Get the input field
    const categoryInput = document.getElementById('categoryTextField');
  
    // Get the value of the input field
    const newCategory = categoryInput.value;
  
    // Check if the input field is not empty
    if (newCategory.trim() !== '') {
      // Add the new category to the categories array
      categories.push(newCategory);
  
      // Clear the input field
      categoryInput.value = '';
      populateCategories();
      populatetodoList(tasks);
    } else {
      alert('Please enter a category');
    }
  }

  function deleteCategory(category) {
    // Find the index of the category in the categories array
    const index = categories.indexOf(category);
    // If the category was found, remove it from the categories array
    if (index !== -1) {
        tasks.forEach((task) => {
            if (task.category === category) {
                task.category = 'All';
            }
        })
        categories.splice(index, 1);
    }
  
    // Update the displayed list
    populateCategories();
    populatetodoList(tasks);
}

function editCategory(category) {
    const catToEdit = categories.indexOf(category);

    if (catToEdit !== -1) {
        const newName = prompt('Enter new category name', categories[catToEdit]);
        if (newName !== null) {
            categories[catToEdit] = newName;
            tasks.forEach((task) => {
                if (task.category === category) {
                    task.category = newName;
                }
            })
            populateCategories();
            populatetodoList(tasks); // Pass the updated tasks array
        }
    }
} */