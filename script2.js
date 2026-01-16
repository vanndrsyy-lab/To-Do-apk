        const initialTasks = [
            { id: 1, text: "create-jsproject", completed: true },
            { id: 2, text: "deploy that", completed: false },
            { id: 3, text: "like this video", completed: false }
        ];
        
       
        const MAX_TASKS = 8; // Maximum number of tasks before showing "Completed"
        
       
        const taskInput = document.getElementById('task-input');
        const tasksContainer = document.getElementById('tasks-container');
        const progressCount = document.getElementById('progress-count');
        const progressPercent = document.getElementById('progress-percent');
        const progressFill = document.getElementById('progress-fill');
        const circleContainer = document.getElementById('circle-container');
        const circleText = document.getElementById('circle-text');
        const circleLabel = document.getElementById('circle-label');
        const listFullMessage = document.getElementById('list-full-message');
        
       
        let tasks = JSON.parse(localStorage.getItem('tasks')) || initialTasks;
        let customProgress = localStorage.getItem('customProgress') || null;
        let currentlyEditingTaskId = null;
        
        
        function renderTasks() {
            tasksContainer.innerHTML = '';
            
            if (tasks.length === 0) {
                tasksContainer.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <p>No tasks yet. Add a new task above!</p>
                    </div>
                `;
                updateCompletedLabel();
                updateListFullMessage();
                return;
            }
            
            tasks.forEach(task => {
                const taskItem = document.createElement('div');
                taskItem.className = `task-item ${task.completed ? 'completed' : ''}`;
                taskItem.dataset.id = task.id;
                
                const isEditing = currentlyEditingTaskId === task.id;
                
                taskItem.innerHTML = `
                    <label class="checkbox-container">
                        <input type="checkbox" class="checkbox-input" ${task.completed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                    </label>
                    <div class="task-text-container">
                        <span class="task-text ${isEditing ? 'editing' : ''}">${task.text}</span>
                        ${isEditing ? 
                            `<input type="text" class="task-edit-input" value="${task.text}" data-task-id="${task.id}">` : 
                            ''
                        }
                    </div>
                    <div class="task-actions">
                        <button class="edit-btn" data-task-id="${task.id}">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" data-task-id="${task.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                
                tasksContainer.appendChild(taskItem);
                
               
                const checkbox = taskItem.querySelector('.checkbox-input');
                if (checkbox) {
                    checkbox.addEventListener('change', function() {
                        toggleTask(task.id);
                    });
                }
            });
            
            updateProgress();
            updateCircle();
            updateCompletedLabel();
            updateListFullMessage();
            
    
            if (currentlyEditingTaskId) {
                const editInput = tasksContainer.querySelector(`.task-edit-input[data-task-id="${currentlyEditingTaskId}"]`);
                if (editInput) {
                    editInput.focus();
                    editInput.select();
                    
                    editInput.addEventListener('blur', () => {
                        saveTaskEdit(currentlyEditingTaskId, editInput.value);
                        currentlyEditingTaskId = null;
                        renderTasks();
                    });
                    
                    editInput.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            saveTaskEdit(currentlyEditingTaskId, editInput.value);
                            currentlyEditingTaskId = null;
                            renderTasks();
                        }
                    });
                }
            }
        }
        
        
        function updateProgress() {
            const completedTasks = tasks.filter(task => task.completed).length;
            const totalTasks = tasks.length;
            const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            
            progressCount.textContent = `${completedTasks} / ${totalTasks}`;
            progressPercent.textContent = `${progress}%`;
            progressFill.style.width = `${progress}%`;
        }
        
    
        function updateCircle() {
            if (customProgress) {
                circleText.textContent = customProgress;
            } else {
                const completedTasks = tasks.filter(task => task.completed).length;
                const totalTasks = tasks.length;
                circleText.textContent = `${completedTasks}/${totalTasks}`;
            }
        }
        
        
        function updateCompletedLabel() {
            if (tasks.length >= MAX_TASKS) {
                circleLabel.classList.add('visible');
            } else {
                circleLabel.classList.remove('visible');
            }
        }
        
        
        function updateListFullMessage() {
            if (tasks.length >= MAX_TASKS) {
                listFullMessage.classList.add('visible');
            } else {
                listFullMessage.classList.remove('visible');
            }
        }
        
       
        function addTask(text) {
            if (!text.trim()) return;
            
           
            if (tasks.length >= MAX_TASKS) {
                // Show feedback that list is full
                listFullMessage.style.color = '#ff6b6b';
                listFullMessage.textContent = '✗ List full!';
                setTimeout(() => {
                    listFullMessage.style.color = '';
                    listFullMessage.textContent = '✓ List full!';
                }, 500);
                return;
            }
            
            const newTask = {
                id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
                text: text.trim(),
                completed: false
            };
            
            tasks.push(newTask);
            saveTasks();
            renderTasks();
            taskInput.value = '';
            
            
            tasksContainer.scrollTop = tasksContainer.scrollHeight;
        }
        
        
        function toggleTask(id) {
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
                
                
                const taskItem = document.querySelector(`.task-item[data-id="${id}"]`);
                if (taskItem) {
                    if (task.completed) {
                        taskItem.style.transform = 'scale(1.02)';
                        setTimeout(() => {
                            taskItem.style.transform = 'scale(1)';
                        }, 200);
                    }
                }
            }
        }
        
        
        function deleteTask(id) {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            renderTasks();
        }
        
    
        function startEditingTask(id) {
            currentlyEditingTaskId = id;
            renderTasks();
        }
        
        
        function saveTaskEdit(id, newText) {
            if (!newText.trim()) return;
            
            const task = tasks.find(t => t.id === id);
            if (task) {
                task.text = newText.trim();
                saveTasks();
            }
        }
        
        
        function startEditingCircle() {
            const currentText = circleText.textContent;
            circleContainer.classList.add('editing');
            
            
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'circle-edit-input';
            input.value = currentText;
            input.placeholder = 'e.g., 2/4';
            input.maxLength = 10;
            
            circleContainer.innerHTML = '';
            circleContainer.appendChild(input);
            input.focus();
            input.select();
            
            
            input.addEventListener('blur', finishEditingCircle);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    finishEditingCircle();
                }
            });
            
           
            document.addEventListener('click', handleClickOutside);
        }
        
        function finishEditingCircle() {
            const input = circleContainer.querySelector('.circle-edit-input');
            if (!input) return;
            
            const newValue = input.value.trim();
            
            if (newValue) {
                customProgress = newValue;
                localStorage.setItem('customProgress', customProgress);
            } else {
                customProgress = null;
                localStorage.removeItem('customProgress');
            }
            
            circleContainer.classList.remove('editing');
            updateCircle();
            
            
            document.removeEventListener('click', handleClickOutside);
        }
        
        function handleClickOutside(e) {
            const circleContainer = document.getElementById('circle-container');
            if (!circleContainer.contains(e.target)) {
                finishEditingCircle();
            }
        }
        
       
        function resetCircleToAuto() {
            customProgress = null;
            localStorage.removeItem('customProgress');
            updateCircle();
        }
        
        
        function saveTasks() {
            localStorage.setItem('tasks', JSON.stringify(tasks));
        }
        
      
        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addTask(taskInput.value);
            }
        });
        
       
        circleContainer.addEventListener('click', startEditingCircle);
        
        
        circleContainer.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            resetCircleToAuto();
        });
        
        
        tasksContainer.addEventListener('click', (e) => {
            const taskId = e.target.closest('[data-task-id]')?.dataset.taskId;
            if (!taskId) return;
            
            const taskIdNum = parseInt(taskId);
            
            
            if (e.target.closest('.edit-btn')) {
                e.stopPropagation();
                startEditingTask(taskIdNum);
                return;
            }
            
           
            if (e.target.closest('.delete-btn')) {
                e.stopPropagation();
                deleteTask(taskIdNum);
                return;
            }
            

            if (e.target.classList.contains('task-text')) {
                startEditingTask(taskIdNum);
            }
        });
        
        renderTasks();