import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import { addTask, updateTask, deleteTask, setFilters } from '../features/taskSlice';
import RecurrenceSelector from './RecurrenceSelector';

const MainFeature = () => {
  // Initial task data
  const initialTasks = [
    {
      id: '1',
      title: 'Complete project proposal',
      description: 'Write up the proposal for the new client project',
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      project: 'Work'
    },
    {
      id: '2',
      title: 'Buy groceries',
      description: 'Get milk, eggs, bread, and vegetables',
      status: 'Not Started',
      priority: 'Medium', 
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      project: 'Personal'
    },
    {
      id: '3',
      title: 'Schedule team meeting',
      description: 'Arrange weekly sync for project updates',
      status: 'Completed',
      priority: 'Low',
      dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      project: 'Work'
    }
  ];

  // States for task management
  const dispatch = useDispatch();
  const { tasks, activeFilter, activePriority } = useSelector(state => state.tasks);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'Not Started',
    priority: 'Medium',
    dueDate: new Date(),
    project: 'Work',
    recurrence: null
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false);

  // Filter tasks based on active filters
  const getFilteredTasks = () => {
    const filtered = tasks.filter(task => {
      const statusMatch = activeFilter === 'all' || task.status === activeFilter;
      const priorityMatch = activePriority === 'all' || task.priority === activePriority;
      return statusMatch && priorityMatch;
    });
    
    const task = {
      ...newTask,
      id: Date.now().toString(),
      dueDate: new Date(newTask.dueDate)
    };
  };

  // Handlers for task CRUD operations
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    
    dispatch(addTask({
      ...newTask,
      dueDate: new Date(newTask.dueDate)
    }));
    
    setNewTask({
      title: '',
      description: '',
      status: 'Not Started',
      priority: 'Medium',
      dueDate: new Date(),
      project: 'Work',
      recurrence: null
    });
    setIsModalOpen(false);
    setShowRecurrenceOptions(false);
    toast.success(`Task ${newTask.recurrence ? 'and its recurrences ' : ''}added successfully!`);
  };

  const handleEditTask = (task) => {
    setEditingTask({
      ...task,
      dueDate: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate),
      recurrence: task.recurrence // Preserve recurrence settings
    });
    setIsModalOpen(true);
    setShowRecurrenceOptions(!!task.recurrence);
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    
    if (!editingTask.title.trim()) {
      toast.error("Task title cannot be empty");
      return;
    }
    
    dispatch(updateTask({
      id: editingTask.id,
      updates: {
        ...editingTask,
        dueDate: new Date(editingTask.dueDate)
      }
    }));
    
    setEditingTask(null);
    setIsModalOpen(false);
    setShowRecurrenceOptions(false);
    toast.success(`Task ${editingTask.recurrence ? 'and its recurrences ' : ''}updated successfully!`);
  };

  const handleDeleteTask = (id, isRecurring = false) => {
    if (isRecurring) {
      if (confirm("Delete just this instance or all recurring instances?")) {
        dispatch(deleteTask({ id, deleteAll: true }));
        toast.success("All recurring task instances deleted successfully!");
      } else {
        dispatch(deleteTask({ id, deleteAll: false }));
        toast.success("Task instance deleted successfully!");
      }
    } else {
      dispatch(deleteTask({ id, deleteAll: false }));
      toast.success("Task deleted successfully!");
    }
  };

  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTask({
      id: taskId,
      updates: { status: newStatus }
    }));
    
    if (newStatus === 'Completed') {
      toast.success("Task completed! Great job!");
    } else {
      toast.info(`Task status updated to ${newStatus}`);
    }
  };

  // Icon components
  const PlusIcon = getIcon('Plus');
  const EditIcon = getIcon('Edit');
  const TrashIcon = getIcon('Trash');
  const CalendarIcon = getIcon('Calendar');
  const CheckCircleIcon = getIcon('CheckCircle');
  const CircleIcon = getIcon('Circle');
  const XIcon = getIcon('X');
  const ArrowRightIcon = getIcon('ArrowRight');
  const AlertCircleIcon = getIcon('AlertCircle');
  const TagIcon = getIcon('Tag');
  const ClipboardIcon = getIcon('Clipboard');
  const RepeatIcon = getIcon('Repeat');
  const RefreshCwIcon = getIcon('RefreshCw');
  
  // Get priority or status color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'task-priority-high';
      case 'Medium': return 'task-priority-medium';
      case 'Low': return 'task-priority-low';
      default: return 'task-priority-medium';
    }
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Completed': 
        const CompletedIcon = getIcon('CheckCircle');
        return <CompletedIcon className="text-green-500" size={18} />;
      case 'In Progress': 
        const ProgressIcon = getIcon('Clock');
        return <ProgressIcon className="text-blue-500" size={18} />;
      case 'Not Started': 
        const NotStartedIcon = getIcon('Circle');
        return <NotStartedIcon className="text-gray-400" size={18} />;
      default: 
        const DefaultIcon = getIcon('Circle');
        return <DefaultIcon className="text-gray-400" size={18} />;
    }
  };

  // Framer motion variants
  const taskVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      x: -100,
      transition: { duration: 0.2 }
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return 'No date';
    const dateObj = date instanceof Date ? date : new Date(date);
    return format(dateObj, 'MMM dd, yyyy');
  };

  // Filter buttons configuration
  const statusFilters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'Not Started', label: 'Not Started' },
    { id: 'In Progress', label: 'In Progress' },
    { id: 'Completed', label: 'Completed' }
  ];

  const priorityFilters = [
    { id: 'all', label: 'All Priorities' },
    { id: 'Low', label: 'Low' },
    { id: 'Medium', label: 'Medium' },
    { id: 'High', label: 'High' }
  ];

  const filteredTasks = getFilteredTasks();
  
  const handleSetRecurrence = (recurrenceSettings) => {
    if (editingTask) {
      setEditingTask(prev => ({ ...prev, recurrence: recurrenceSettings }));
    } else {
      setNewTask(prev => ({ ...prev, recurrence: recurrenceSettings }));
    }
  };
  
  const handleFilterChange = (type, value) => dispatch(setFilters({ [type]: value }));

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl shadow-card p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold mb-1 flex items-center gap-2">
            <ClipboardIcon className="text-primary" />
            Task Management
          </h2>
          <p className="text-surface-600 dark:text-surface-300">
            Organize and track your tasks efficiently
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="btn btn-primary rounded-full flex items-center gap-2 px-5 py-2.5"
        >
          <PlusIcon size={18} />
          <span>Add New Task</span>
        </motion.button>
      </div>
      
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-2 text-surface-600 dark:text-surface-300">Filter by Status</h4>
            <div className="flex flex-wrap gap-2">
              {statusFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange('status', filter.id)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    activeFilter === filter.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-medium mb-2 text-surface-600 dark:text-surface-300">Filter by Priority</h4>
            <div className="flex flex-wrap gap-2">
              {priorityFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => handleFilterChange('priority', filter.id)}
                  className={`px-3 py-1.5 text-sm rounded-full transition-all ${
                    activePriority === filter.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Task List */}
      <div className="mt-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-surface-400 dark:text-surface-500 mb-4 inline-block"
            >
              <AlertCircleIcon size={40} />
            </motion.div>
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              {activeFilter !== 'all' || activePriority !== 'all' 
                ? "Try changing your filters or" 
                : "Get started by"}
              {" adding a new task."}
            </p>
            <button 
              onClick={() => {
                setEditingTask(null);
                setIsModalOpen(true);
              }}
              className="btn btn-primary"
            >
              Add Your First Task
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map(task => (
                <motion.div
                  key={task.id}
                  layout
                  variants={taskVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="task-item flex flex-col sm:flex-row justify-between gap-4"
                >
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <button 
                        onClick={() => handleStatusChange(
                          task.id, 
                          task.status === 'Completed' ? 'Not Started' : 'Completed'
                        )}
                        className="mt-1"
                      >
                        {task.status === 'Completed' ? (
                          <CheckCircleIcon className="text-green-500" />
                        ) : (
                          <CircleIcon className="text-surface-400 hover:text-surface-600 dark:hover:text-surface-300" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <h3 className={`font-medium mb-1 ${
                          task.status === 'Completed' ? 'line-through text-surface-500' : ''
                        }`}>
                          {task.title}
                        </h3>
                        
                        {task.description && (
                          <p className="text-sm text-surface-600 dark:text-surface-400 mb-3">
                            {task.description}
                          </p>
                        )}
                        
                        <div className="flex flex-wrap gap-2 items-center text-sm">
                          <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400">
                            <CalendarIcon size={14} />
                            <span>{formatDate(task.dueDate)}</span>
                            
                            {/* Recurring task indicator */}
                            {task.recurrence && (
                              <div className="flex items-center ml-2 text-primary" title="Recurring task">
                                <RefreshCwIcon size={14} />
                              </div>
                            )}
                            
                          </div>
                          
                          <div className={`task-tag ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </div>
                          
                          {task.project && (
                            <div className="task-tag bg-primary/10 text-primary dark:bg-primary/20">
                              {task.project}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex sm:flex-col justify-end sm:justify-center gap-2">
                    <button 
                      onClick={() => handleEditTask(task)}
                      className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                      aria-label="Edit task"
                    >
                      <EditIcon size={18} className="text-surface-500 hover:text-primary" />
                    </button>
                    
                    <button 
                      onClick={() => handleDeleteTask(task.id, !!task.recurrence)}
                      className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                      aria-label="Delete task"
                    >
                      <TrashIcon size={18} className="text-surface-500 hover:text-accent" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
      
      {/* Add/Edit Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed inset-0 bg-black/50 z-10"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white dark:bg-surface-800 rounded-xl shadow-lg z-20 p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon size={20} />
                </button>
              </div>
              
              <form onSubmit={editingTask ? handleUpdateTask : handleAddTask}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                        <div className="flex items-center justify-between">
                          <span>
                            Recurring Task
                          </span>
                          <button type="button" onClick={() => setShowRecurrenceOptions(!showRecurrenceOptions)} className="text-primary text-sm">
                            {showRecurrenceOptions ? 'Hide options' : 'Show options'}
                          </button>
                        </div>
                        {showRecurrenceOptions && (
                          <div className="mt-3 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                            <RecurrenceSelector 
                              recurrence={editingTask ? editingTask.recurrence : newTask.recurrence}
                              onChange={handleSetRecurrence}
                              taskDueDate={editingTask ? editingTask.dueDate : newTask.dueDate}
                            />
                          </div>
                        )}
                      </label>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                      Task Title <span className="text-accent">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter task title"
                      value={editingTask ? editingTask.title : newTask.title}
                      onChange={(e) => 
                        editingTask 
                          ? setEditingTask({...editingTask, title: e.target.value})
                          : setNewTask({...newTask, title: e.target.value})
                      }
                      required
                      className="input"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      placeholder="Enter task description"
                      rows="3"
                      value={editingTask ? editingTask.description : newTask.description}
                      onChange={(e) => 
                        editingTask 
                          ? setEditingTask({...editingTask, description: e.target.value})
                          : setNewTask({...newTask, description: e.target.value})
                      }
                      className="input resize-none"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        value={editingTask ? editingTask.status : newTask.status}
                        onChange={(e) => 
                          editingTask 
                            ? setEditingTask({...editingTask, status: e.target.value})
                            : setNewTask({...newTask, status: e.target.value})
                        }
                        className="input"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <select
                        value={editingTask ? editingTask.priority : newTask.priority}
                        onChange={(e) => 
                          editingTask 
                            ? setEditingTask({...editingTask, priority: e.target.value})
                            : setNewTask({...newTask, priority: e.target.value})
                        }
                        className="input"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={format(
                          editingTask 
                            ? new Date(editingTask.dueDate) 
                            : new Date(newTask.dueDate), 
                          'yyyy-MM-dd'
                        )}
                        onChange={(e) => {
                          const date = new Date(e.target.value);
                          if (editingTask) {
                            setEditingTask({...editingTask, dueDate: date});
                          } else {
                            setNewTask({...newTask, dueDate: date});
                          }
                        }}
                        className="input"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Project
                      </label>
                      <select
                        value={editingTask ? editingTask.project : newTask.project}
                        onChange={(e) => 
                          editingTask 
                            ? setEditingTask({...editingTask, project: e.target.value})
                            : setNewTask({...newTask, project: e.target.value})
                        }
                        className="input"
                      >
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Study">Study</option>
                        <option value="Health">Health</option>
                        <option value="Finance">Finance</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn btn-ghost"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="submit"
                    className="btn btn-primary flex items-center gap-2"
                  >
                    {editingTask ? 'Update Task' : 'Add Task'}
                    <ArrowRightIcon size={18} />
                  </button>
                </div>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MainFeature;