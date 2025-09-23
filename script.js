const loginForm = document.getElementById('login-form');
const loginScreen = document.getElementById('login-screen');
const desktop = document.getElementById('desktop');
const passwordInput = document.getElementById('password');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = passwordInput.value;

    if (password === 'password') {
        loginScreen.classList.add('hidden');
        desktop.classList.remove('hidden');
        createWindow('Welcome', 'Welcome to Windows 11!');
    } else {
        alert('Incorrect password');
    }
});

const startButton = document.getElementById('start-button');
const startMenu = document.getElementById('start-menu');

startButton.addEventListener('click', () => {
    startMenu.classList.toggle('hidden');
});

desktop.addEventListener('click', (e) => {
    if (e.target === desktop) {
        startMenu.classList.add('hidden');
    }
});

const clockElement = document.getElementById('clock');

function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}`;
    clockElement.textContent = timeString;
}

updateClock();
setInterval(updateClock, 1000);

function createWindow(title, content) {
    const windowDiv = document.createElement('div');
    windowDiv.className = 'window';
    windowDiv.innerHTML = `
        <div class="title-bar">
            <div class="title">${title}</div>
            <div class="window-buttons">
                <div class="window-button minimize-button"></div>
                <div class="window-button maximize-button"></div>
                <div class="window-button close-button"></div>
            </div>
        </div>
        <div class="window-content">
            ${content}
        </div>
        <div class="resize-handle top-left"></div>
        <div class="resize-handle top-right"></div>
        <div class="resize-handle bottom-left"></div>
        <div class="resize-handle bottom-right"></div>
        <div class="resize-handle top"></div>
        <div class="resize-handle bottom"></div>
        <div class="resize-handle left"></div>
        <div class="resize-handle right"></div>
    `;

    desktop.appendChild(windowDiv);

    const titleBar = windowDiv.querySelector('.title-bar');
    const closeButton = windowDiv.querySelector('.close-button');
    const minimizeButton = windowDiv.querySelector('.minimize-button');
    const maximizeButton = windowDiv.querySelector('.maximize-button');

    // Close, Minimize, Maximize
    closeButton.addEventListener('click', () => windowDiv.remove());
    minimizeButton.addEventListener('click', () => windowDiv.classList.add('hidden'));
    maximizeButton.addEventListener('click', () => windowDiv.classList.toggle('maximized'));


    // Dragging
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    titleBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        dragOffsetX = e.clientX - windowDiv.getBoundingClientRect().left;
        dragOffsetY = e.clientY - windowDiv.getBoundingClientRect().top;
        windowDiv.style.zIndex = 10;
    });

    // Resizing
    const resizeHandles = windowDiv.querySelectorAll('.resize-handle');
    let isResizing = false;
    let resizeDirection;
    let resizeInitialX, resizeInitialY;
    let resizeInitialWidth, resizeInitialHeight;
    let resizeInitialLeft, resizeInitialTop;

    resizeHandles.forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeDirection = handle.className.replace('resize-handle ', '');
            resizeInitialX = e.clientX;
            resizeInitialY = e.clientY;
            const rect = windowDiv.getBoundingClientRect();
            resizeInitialWidth = rect.width;
            resizeInitialHeight = rect.height;
            resizeInitialLeft = rect.left;
            resizeInitialTop = rect.top;
            e.stopPropagation();
        });
    });

    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const x = e.clientX - dragOffsetX;
            const y = e.clientY - dragOffsetY;
            windowDiv.style.left = `${x}px`;
            windowDiv.style.top = `${y}px`;
        } else if (isResizing) {
            const dx = e.clientX - resizeInitialX;
            const dy = e.clientY - resizeInitialY;

            if (resizeDirection.includes('right')) {
                windowDiv.style.width = `${resizeInitialWidth + dx}px`;
            }
            if (resizeDirection.includes('bottom')) {
                windowDiv.style.height = `${resizeInitialHeight + dy}px`;
            }
            if (resizeDirection.includes('left')) {
                windowDiv.style.width = `${resizeInitialWidth - dx}px`;
                windowDiv.style.left = `${resizeInitialLeft + dx}px`;
            }
            if (resizeDirection.includes('top')) {
                windowDiv.style.height = `${resizeInitialHeight - dy}px`;
                windowDiv.style.top = `${resizeInitialTop + dy}px`;
            }
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        isResizing = false;
        windowDiv.style.zIndex = 1;
    });
}

const explorerButton = document.getElementById('explorer-button');

explorerButton.addEventListener('click', () => {
    const explorerContent = `
        <ul class="file-list">
            <li>[Folder] Documents</li>
            <li>[Folder] Downloads</li>
            <li>[Folder] Pictures</li>
            <li>[File] resume.pdf</li>
            <li>[File] project-plan.docx</li>
        </ul>
    `;
    createWindow('File Explorer', explorerContent);
});
