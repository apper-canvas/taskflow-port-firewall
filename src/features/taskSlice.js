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
      if (newTask.recurrence) {
        const instances = generateRecurringInstances(newTask);
        instances.forEach(instance => {
          // Don't duplicate the first instance
          if (instance.id !== newTask.id) {
            state.tasks.push(instance);
          }
        });
      }
          state.tasks[taskIndex] = updates;
      const { id, updates } = action.payload;
      const taskIndex = state.tasks.findIndex(task => task.id === id);
      
      if (taskIndex !== -1) {
        // Check if this is a recurring task
        const originalTask = state.tasks[taskIndex];
        const isRecurring = originalTask.recurrence || updates.recurrence;
        // If recurrence settings changed, we need to handle differently
        if (JSON.stringify(originalTask.recurrence) !== JSON.stringify(updates.recurrence)) {
          state.tasks[taskIndex] = updates;
          if (originalTask.recurrence) {
              task.recurrence.parentId !== originalParentId ||
              task.id === id // Keep the task being updated
    
    // Delete a task (local state update after API call)
            );
          }
          
          // Update the task itself
          state.tasks[taskIndex] = { ...originalTask, ...updates };
          
          // Generate new instances if still recurring
      } else if (taskToDelete) {
            const updatedTask = state.tasks[taskIndex];
            const instances = generateRecurringInstances(updatedTask);
            instances.forEach(instance => {
            });
          }
        } else {
          // Simple update if recurrence hasn't changed
          state.tasks[taskIndex] = { ...originalTask, ...updates };
        }
        
        // Save to localStorage
        localStorage.setItem('tasks', JSON.stringify(state.tasks));
      }
export const { setLoading, setError, setTasks, addTask, updateTask, deleteTask, setFilters } = taskSlice.actions;
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