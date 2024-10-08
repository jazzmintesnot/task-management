// Initialize app and load data
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('signupBtn').addEventListener('click', signUp);
    document.getElementById('loginBtn').addEventListener('click', login);
    document.getElementById('logoutBtn').addEventListener('click', logout);
    document.getElementById('addTaskBtn').addEventListener('click', addTask);

    loadCurrentUser();
});

let currentUser = null;

function signUp() {
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;

    if (!username || !password) {
        alert('Please fill in all fields');
        return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || {};
    if (users[username]) {
        alert('Username already exists');
        return;
    }

    users[username] = { password, tasks: [] };
    localStorage.setItem('users', JSON.stringify(users));

    alert('Sign-up successful! Please login.');
    document.getElementById('signupUsername').value = '';
    document.getElementById('signupPassword').value = '';
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem('users')) || {};

    if (users[username] && users[username].password === password) {
        currentUser = username;
        localStorage.setItem('currentUser', username);
        loadTasks();
        showTaskSection();
    } else {
        alert('Invalid username or password');
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showAuthSection();
}

function loadCurrentUser() {
    currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        loadTasks();
        showTaskSection();
    } else {
        showAuthSection();
    }
}

function showTaskSection() {
    document.getElementById('authSection').style.display = 'none';
    document.getElementById('taskSection').style.display = 'block';
}

function showAuthSection() {
    document.getElementById('authSection').style.display = 'block';
    document.getElementById('taskSection').style.display = 'none';
}

function addTask() {
    const taskName = document.getElementById('taskName').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    if (!taskName || !startDate || !endDate) {
        alert('Please fill in all fields');
        return;
    }

    const task = { taskName, startDate, endDate };
    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[currentUser].tasks.push(task);
    localStorage.setItem('users', JSON.stringify(users));

    loadTasks();
    document.getElementById('taskName').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
}

function loadTasks() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const tasks = users[currentUser].tasks || [];

    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.innerHTML = `${task.taskName} (Start: ${task.startDate}, End: ${task.endDate}) <button onclick="removeTask('${task.taskName}')">Remove</button>`;
        todoList.appendChild(taskItem);
    });
}

function removeTask(taskName) {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    users[currentUser].tasks = users[currentUser].tasks.filter(task => task.taskName !== taskName);
    localStorage.setItem('users', JSON.stringify(users));

    loadTasks();
}
