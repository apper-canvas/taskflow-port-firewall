import { addDays, addWeeks, addMonths, format, isAfter, isBefore, differenceInDays } from 'date-fns';

/**
 * Generates the next date based on recurrence pattern
 * @param {Date} baseDate - The starting date
 * @param {Object} recurrence - Recurrence configuration
 * @returns {Date} - The next date in the sequence
 */
export const getNextDate = (baseDate, recurrence) => {
  const date = new Date(baseDate);
  
  switch (recurrence.frequency) {
    case 'daily':
      return addDays(date, recurrence.interval || 1);
    
    case 'weekly':
      return addWeeks(date, recurrence.interval || 1);
    
    case 'monthly':
      return addMonths(date, recurrence.interval || 1);
    
    case 'custom':
      return addDays(date, recurrence.customInterval || 1);
    
    default:
      return addDays(date, 1);
  }
};

/**
 * Generates recurring task instances based on recurrence pattern
 * @param {Object} task - The base task
 * @returns {Array} - Array of task instances
 */
export const generateRecurringInstances = (task) => {
  if (!task.recurrence) return [task];
  
  const instances = [task]; // Include the original task
  const recurrence = task.recurrence;
  const startDate = recurrence.startDate || task.dueDate;
  const endDate = recurrence.endDate;
  const maxInstances = 10; // Limit for performance reasons
  
  let currentDate = new Date(startDate);
  let instanceCount = 1;
  
  // Generate a reasonable number of future instances
  while (instanceCount < maxInstances) {
    // Stop if we've reached the end date
    if (endDate && isAfter(currentDate, endDate)) break;
    
    // Calculate next occurrence date
    const nextDate = getNextDate(currentDate, recurrence);
    
    // Create a new instance with the calculated date
    const instance = {
      ...task,
      id: `${task.id}-${instanceCount}`,
      dueDate: nextDate,
      recurrence: {
        ...recurrence,
        parentId: task.id, // Link to parent task
        instanceNumber: instanceCount + 1
      }
    };
    
    instances.push(instance);
    currentDate = nextDate;
    instanceCount++;
  }
  
  return instances;
};

/**
 * Formats recurrence pattern for display
 * @param {Object} recurrence - Recurrence configuration
 * @returns {String} - Formatted recurrence description
 */
export const formatRecurrenceDescription = (recurrence) => {
  if (!recurrence) return 'One-time task';
  
  let description = '';
  
  switch (recurrence.frequency) {
    case 'daily':
      description = recurrence.interval > 1 
        ? `Every ${recurrence.interval} days` 
        : 'Daily';
      break;
    case 'weekly':
      description = recurrence.interval > 1 
        ? `Every ${recurrence.interval} weeks` 
        : 'Weekly';
      break;
    case 'monthly':
      description = recurrence.interval > 1 
        ? `Every ${recurrence.interval} months` 
        : 'Monthly';
      break;
    case 'custom':
      description = `Every ${recurrence.customInterval} days`;
      break;
  }
  
  return description;
};