import { createSlice } from '@reduxjs/toolkit';
import { format, addDays, addWeeks, addMonths } from 'date-fns';
import { generateRecurringInstances } from '../utils/recurrenceUtils';

// Initial tasks data
const initialTasks = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Write up the proposal for the new client project',
    status: 'In Progress',
    priority: 'High',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    project: 'Work',
    recurrence: null
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Get milk, eggs, bread, and vegetables',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    project: 'Personal',
    recurrence: null
  },
  {
    id: '3',
    title: 'Schedule team meeting',
    description: 'Arrange weekly sync for project updates',
    status: 'Completed',
    priority: 'Low',
    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    project: 'Work',
    recurrence: null
  }
];

// Load tasks from localStorage if available
const loadState = () => {
  try {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks === null) {
      return initialTasks;
    }
    return JSON.parse(savedTasks, (key, value) => {
      // Convert stored date strings back to Date objects
      if (key === 'dueDate' || key === 'startDate' || key === 'endDate') {
        return value ? new Date(value) : null;
      }
      return value;
    });
  } catch (err) {
    console.error('Error loading tasks from localStorage:', err);
    return initialTasks;
  }
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: loadState(),
    filteredTasks: [],
    activeFilter: 'all',
    activePriority: 'all'
  },
  reducers: {
    addTask: (state, action) => {
      const newTask = {
        ...action.payload,
        id: Date.now().toString()
      };
      
      state.tasks.push(newTask);
      
      // If task is recurring, generate initial instances
      if (newTask.recurrence) {
        const instances = generateRecurringInstances(newTask);
        instances.forEach(instance => {
          if (instance.id !== newTask.id) { // Avoid duplicating the first instance
            state.tasks.push(instance);
          }
        });
      }
      
      // Save to localStorage
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        // Check if this is a recurring task
        const originalTask = state.tasks[taskIndex];
        const isRecurring = originalTask.recurrence || updates.recurrence;
        
        // If recurrence settings changed, we need to handle differently
        if (JSON.stringify(originalTask.recurrence) !== JSON.stringify(updates.recurrence)) {
          // Remove all future instances if recurrence is being modified
          if (originalTask.recurrence) {
            const originalParentId = originalTask.recurrence.parentId || originalTask.id;
            state.tasks = state.tasks.filter(task => 
              !task.recurrence || 
              task.recurrence.parentId !== originalParentId ||
              task.id === id // Keep the task being updated
            );
          }
          
          // Update the task itself
          state.tasks[taskIndex] = { ...originalTask, ...updates };
          
          // Generate new instances if still recurring
          if (updates.recurrence) {
            const updatedTask = state.tasks[taskIndex];
            const instances = generateRecurringInstances(updatedTask);
            instances.forEach(instance => {
              if (instance.id !== updatedTask.id) { // Avoid duplicating the first instance
                state.tasks.push(instance);
              }
            });
          }
        } else {
          // Simple update if recurrence hasn't changed
          state.tasks[taskIndex] = { ...originalTask, ...updates };
        }
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
    },
    deleteTask: (state, action) => {
      const { id, deleteAll } = action.payload;
      const taskToDelete = state.tasks.find(task => task.id === id);
      
      if (taskToDelete && taskToDelete.recurrence && deleteAll) {
        // Delete all instances of the recurring task
        const parentId = taskToDelete.recurrence.parentId || taskToDelete.id;
        state.tasks = state.tasks.filter(task => 
          !task.recurrence || task.recurrence.parentId !== parentId
        );
      } else {
        // Delete just this task
        state.tasks = state.tasks.filter(task => task.id !== id);
      }
      
      // Save to localStorage
      localStorage.setItem('tasks', JSON.stringify(state.tasks));
    },
    setFilters: (state, action) => {
      state.activeFilter = action.payload.status || state.activeFilter;
      state.activePriority = action.payload.priority || state.activePriority;
    }
  }
});

export const { addTask, updateTask, deleteTask, setFilters } = taskSlice.actions;
export default taskSlice.reducer;