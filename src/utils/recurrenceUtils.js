/**
 * Utility functions for handling recurring tasks
 */

/**
 * Generate instances of a recurring task based on its recurrence rules
 * @param {Object} task - The task with recurrence information
 * @param {number} instances - Number of instances to generate (default: 5)
 * @returns {Array} - Array of task instances
 */
export function generateRecurringInstances(task, instances = 5) {
  if (!task.isRecurring) return [task];
  
  const result = [];
  const type = task.recurrenceType || 'None';
  const interval = task.recurrenceInterval || 0;
  
  if (type === 'None' || interval <= 0) {
    return [task];
  }
  
  // Add the original task
  result.push(task);
  
  // Clone the original task for the base instance
  const baseTask = {...task};
  const baseDate = new Date(task.dueDate);
  
  // Generate subsequent instances
  for (let i = 1; i < instances; i++) {
    const instanceDate = new Date(baseDate);
    
    if (type === 'Daily') instanceDate.setDate(baseDate.getDate() + (i * interval));
    else if (type === 'Weekly') instanceDate.setDate(baseDate.getDate() + (i * 7 * interval));
    else if (type === 'Monthly') instanceDate.setMonth(baseDate.getMonth() + (i * interval));
    
    // Check if we've passed the end date
    if (task.recurrenceEndDate && instanceDate > new Date(task.recurrenceEndDate)) break;
    
    result.push({...baseTask, id: `${task.id}-${i}`, dueDate: instanceDate, parentTaskId: task.id});
  }
  
  return result;
}