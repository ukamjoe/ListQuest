document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-navbar');
    const navbar = document.getElementById('navbar');
    const taskInput = document.getElementById('task');
    const createButton = document.getElementById('create');
    const timeButton = document.getElementById('time');
    const taskTimeInput = document.getElementById('task-time');
    const tasksContainer = document.getElementById('tasks');

    // Initially hide the navbar
    navbar.style.display = 'none';

    // Add event listener to toggle button
    toggleButton.addEventListener('click', () => {
        if (navbar.style.display === 'none') {
            navbar.style.display = 'block';
            toggleButton.classList.remove('fa-bars');
            toggleButton.classList.add('fa-times');
        } else {
            navbar.style.display = 'none';
            toggleButton.classList.remove('fa-times');
            toggleButton.classList.add('fa-bars');
        }
        document.body.classList.toggle('navbar-open');
    });

    // Function to save tasks to localStorage
    const saveTasks = () => {
        const tasks = [];
        document.querySelectorAll('.task-wrapper').forEach(taskWrapper => {
            const taskContent = taskWrapper.querySelector('.task-content');
            const taskText = taskContent.querySelector('.task-text').innerText;
            const taskTime = taskContent.querySelector('.task-time').innerText;
            tasks.push({ task: taskText, time: taskTime });
        });
        try {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        } catch (error) {
            console.error("Error saving tasks to localStorage:", error);
        }
    };

    // Function to add a new task
    const addTask = (task, time, save = true) => {
        if (!task) return;

        // Create a new div for the task
        const taskWrapper = document.createElement('div');
        taskWrapper.classList.add('task-wrapper');

        const taskItem = document.createElement('div');
        taskItem.classList.add('task-item');
        taskItem.innerHTML = `
            <div class="task-content">
                <p class="task-text">${task}</p>
                ${time ? `<p class="task-time">${time}</p>` : ''}
                <div class="task-actions">
                    <button class="delete"><ion-icon name="trash-outline"></ion-icon></button>
                    <button class="edit"><ion-icon name="create-outline"></ion-icon></button>
                </div>
            </div>
        `;

        // Append the taskItem to the taskWrapper
        taskWrapper.appendChild(taskItem);

        // Append the taskWrapper to the tasksContainer
        tasksContainer.appendChild(taskWrapper);

        // Add delete functionality
        const deleteButton = taskItem.querySelector('.delete');
        deleteButton.addEventListener('click', () => {
            tasksContainer.removeChild(taskWrapper);
            saveTasks(); // Save tasks to localStorage
        });

        // Add edit functionality
        const editButton = taskItem.querySelector('.edit');
        editButton.addEventListener('click', () => {
            taskInput.value = task;
            taskTimeInput.value = time;
            tasksContainer.removeChild(taskWrapper);
            saveTasks(); // Save tasks to localStorage
        });

        if (save) {
            saveTasks(); // Save tasks to localStorage
        }

        // Clear input fields after adding task
        taskInput.value = '';
        taskTimeInput.value = ''; // Reset time input
    };

    // Function to validate task input
    const validateTaskInput = (task) => {
        if (!task.trim()) {
            alert('Task cannot be empty');
            return false;
        }
        return true;
    };

    // Event listener for create button
    createButton.addEventListener('click', () => {
        const task = taskInput.value.trim();
        const time = taskTimeInput.value;
        if (validateTaskInput(task)) {
            addTask(task, time);
            taskInput.value = '';
            taskTimeInput.value = ''; // Reset time input
        }
    });

    // Event listener for time button to show time input
    timeButton.addEventListener('click', () => {
        taskTimeInput.style.display = 'block';
        taskTimeInput.focus();
    });

    // Hide time input on change
    taskTimeInput.addEventListener('change', () => {
        taskTimeInput.style.display = 'none';
    });

    // Add task on Enter key press
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const task = taskInput.value.trim();
            const time = taskTimeInput.value;
            if (validateTaskInput(task)) {
                addTask(task, time);
                taskInput.value = '';
                taskTimeInput.value = ''; // Reset time input
            }
        }
    });

    // Load tasks from localStorage
    const loadTasks = () => {
        try {
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.forEach(task => {
                addTask(task.task, task.time, false);
            });
        } catch (error) {
            console.error("Error loading tasks from localStorage:", error);
        }
    };

    loadTasks(); // Load tasks when the page loads
});
