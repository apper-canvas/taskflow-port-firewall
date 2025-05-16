/**
 * Service for handling task-related operations with the Apper backend
 */

// Helper to get only updateable fields for create/update operations
const getUpdateableFields = (task) => {
  // Fields from the database schema marked as Updateable
  const updateableFields = [
    'Name',
    'Tags',
    'Owner',
    'title',
    'description',
    'status',
    'priority',
    'dueDate',
    'project',
    'recurrenceType',
    'recurrenceInterval',
    'recurrenceEndDate',
    'parentTaskId',
    'isRecurring'
  ];

  // Filter the task to only include updateable fields
  const filteredTask = {};
  updateableFields.forEach(field => {
    if (task[field] !== undefined) {
      filteredTask[field] = task[field];
    }
  });

  return filteredTask;
};

// Map task from application model to database model
const mapTaskToDbModel = (task) => {
  return {
    // Only include updateable fields
    Name: task.title,
    title: task.title,
    description: task.description,
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate,
    project: task.project,
    recurrenceType: task.recurrence?.type || 'None',
    recurrenceInterval: task.recurrence?.interval || 0,
    recurrenceEndDate: task.recurrence?.endDate || null,
    parentTaskId: task.recurrence?.parentId || null,
    isRecurring: !!task.recurrence,
    Tags: task.tags || []
  };
};

// Map task from database model to application model
const mapDbModelToTask = (dbTask) => {
  let recurrence = null;
  if (dbTask.isRecurring) {
    recurrence = {
      type: dbTask.recurrenceType,
      interval: dbTask.recurrenceInterval,
      endDate: dbTask.recurrenceEndDate ? new Date(dbTask.recurrenceEndDate) : null,
      parentId: dbTask.parentTaskId
    };
  }

  return {
    id: dbTask.Id,
    title: dbTask.title || dbTask.Name,
    description: dbTask.description || '',
    status: dbTask.status || 'Not Started',
    priority: dbTask.priority || 'Medium',
    dueDate: dbTask.dueDate ? new Date(dbTask.dueDate) : new Date(),
    project: dbTask.project || 'Work',
    recurrence: recurrence,
    tags: dbTask.Tags || [],
    createdBy: dbTask.CreatedBy,
    createdOn: dbTask.CreatedOn ? new Date(dbTask.CreatedOn) : null,
    modifiedOn: dbTask.ModifiedOn ? new Date(dbTask.ModifiedOn) : null
  };
};

/**
 * Fetch all tasks
 * @param {Object} filters - Optional filter criteria
 * @param {number} page - Page number for pagination
 * @param {number} limit - Number of items per page
 */
export const fetchTasks = async (filters = {}, page = 1, limit = 50) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Prepare filters
    const whereConditions = [];
    
    if (filters.status && filters.status !== 'all') {
      whereConditions.push({
        fieldName: 'status',
        operator: 'ExactMatch',
        values: [filters.status]
      });
    }
    
    if (filters.priority && filters.priority !== 'all') {
      whereConditions.push({
        fieldName: 'priority',
        operator: 'ExactMatch',
        values: [filters.priority]
      });
    }

    // Query parameters
    const params = {
      pagingInfo: {
        limit: limit,
        offset: (page - 1) * limit
      },
      orderBy: [
        {
          field: 'dueDate',
          direction: 'ASC'
        }
      ]
    };

    // Add where conditions if any exist
    if (whereConditions.length > 0) {
      params.where = whereConditions;
    }

    const response = await apperClient.fetchRecords('task29', params);
    
    if (!response || !response.data) {
      return { tasks: [], total: 0 };
    }

    // Map database models to application models
    const tasks = response.data.map(mapDbModelToTask);
    
    return { 
      tasks, 
      total: response.totalRecordCount || tasks.length 
    };
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * Get a single task by ID
 * @param {string} taskId - The task ID
 */
export const getTaskById = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const response = await apperClient.getRecordById('task29', taskId);
    
    if (!response || !response.data) {
      return null;
    }

    return mapDbModelToTask(response.data);
  } catch (error) {
    console.error(`Error fetching task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Create a new task
 * @param {Object} task - The task to create
 */
export const createTask = async (task) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Convert our task model to the database model
    const dbTask = mapTaskToDbModel(task);
    
    // Filter to only updateable fields and prepare structure for API
    const params = {
      records: [getUpdateableFields(dbTask)]
    };

    const response = await apperClient.createRecord('task29', params);
    
    if (!response || !response.success || !response.results || !response.results[0]?.success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to create task');
    }

    return mapDbModelToTask(response.results[0].data);
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * Update an existing task
 * @param {string} taskId - The ID of the task to update
 * @param {Object} updates - The fields to update
 */
export const updateTask = async (taskId, updates) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    // Convert our task model to the database model
    const dbUpdates = mapTaskToDbModel(updates);
    
    // Filter to only updateable fields and prepare structure for API
    const updateableFields = getUpdateableFields(dbUpdates);
    const params = {
      records: [{
        Id: taskId,
        ...updateableFields
      }]
    };

    const response = await apperClient.updateRecord('task29', params);
    
    if (!response || !response.success || !response.results || !response.results[0]?.success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to update task');
    }

    return mapDbModelToTask(response.results[0].data);
  } catch (error) {
    console.error(`Error updating task with ID ${taskId}:`, error);
    throw error;
  }
};

/**
 * Delete a task
 * @param {string} taskId - The ID of the task to delete
 */
export const deleteTask = async (taskId) => {
  try {
    const { ApperClient } = window.ApperSDK;
    const apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    const params = {
      RecordIds: [taskId]
    };

    const response = await apperClient.deleteRecord('task29', params);
    
    if (!response || !response.success || !response.results || !response.results[0]?.success) {
      throw new Error(response?.results?.[0]?.message || 'Failed to delete task');
    }

    return true;
  } catch (error) {
    console.error(`Error deleting task with ID ${taskId}:`, error);
    throw error;
  }
};