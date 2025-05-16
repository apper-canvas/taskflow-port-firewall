import { createSlice } from '@reduxjs/toolkit';
import { generateRecurringInstances } from '../utils/recurrenceUtils';

// Empty initial state - data will come from database
const initialState = {
  tasks: [],
  filteredTasks: [],
  activeFilter: 'all',
  activePriority: 'all',
  isLoading: false,
  error: null,
  lastUpdated: null
}

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    // Set loading state
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    
    // Set tasks from API response
    setTasks: (state, action) => {
      state.tasks = action.payload;
      state.isLoading = false;
      state.error = null;
      state.lastUpdated = new Date().toISOString();
    },
    
    // Add a task (local state update after API call)
    addTask: (state, action) => {
      const newTask = action.payload;
      
      state.tasks.push(newTask);
      
      // If task is recurring, generate instances
      if (newTask.isRecurring) {
        const instances = generateRecurringInstances(newTask);
        instances.forEach(instance => {
          // Don't duplicate the first instance
          if (instance.id !== newTask.id) {
            state.tasks.push(instance);
          }
        });
      }
    },
    
    // Update a task (local state update after API call)
    updateTask: (state, action) => {
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        const originalTask = state.tasks[taskIndex];
        state.tasks[taskIndex] = { ...originalTask, ...updates };
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
    },
    
    setFilters: (state, action) => {
      state.activeFilter = action.payload.status || state.activeFilter;
      state.activePriority = action.payload.priority || state.activePriority;
    }
  }
});

export const { setLoading, setError, setTasks, addTask, updateTask, deleteTask, setFilters } = taskSlice.actions;
export default taskSlice.reducer;