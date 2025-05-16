import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';

/**
 * Component for selecting recurrence options for a task
 */
const RecurrenceSelector = ({ 
  recurrence, 
  onChange, 
  taskDueDate,
  onClose = null
}) => {
  // Initialize state with provided recurrence or defaults
  const [recurrenceType, setRecurrenceType] = useState(
    recurrence ? recurrence.frequency : 'none'
  );
  
  const [interval, setInterval] = useState(
    recurrence?.interval || 1
  );
  
  const [customInterval, setCustomInterval] = useState(
    recurrence?.customInterval || 2
  );
  
  const [startDate, setStartDate] = useState(
    recurrence?.startDate || taskDueDate || new Date()
  );
  
  const [endDate, setEndDate] = useState(
    recurrence?.endDate || null
  );
  
  const [hasEndDate, setHasEndDate] = useState(
    !!recurrence?.endDate
  );

  // Icons
  const CalendarIcon = getIcon('Calendar');
  const RepeatIcon = getIcon('Repeat');
  const ClockIcon = getIcon('Clock');
  
  // When recurrence type changes, update the full recurrence object
  useEffect(() => {
    if (recurrenceType === 'none') {
      onChange(null);
      return;
    }
    
    const newRecurrence = {
      frequency: recurrenceType,
      interval: interval,
      startDate: startDate
    };
    
    if (recurrenceType === 'custom') {
      newRecurrence.customInterval = customInterval;
    }
    
    if (hasEndDate && endDate) {
      newRecurrence.endDate = endDate;
    }
    
    onChange(newRecurrence);
  }, [recurrenceType, interval, customInterval, startDate, endDate, hasEndDate]);
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <RepeatIcon size={18} className="text-primary" />
        <h3 className="text-lg font-medium">Recurrence Settings</h3>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Repeat</label>
        <select
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value)}
          className="input"
        >
          <option value="none">Don't repeat</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom</option>
        </select>
      </div>
      
      {recurrenceType !== 'none' && (
        <>
          {recurrenceType !== 'custom' ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Repeat every
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={interval}
                  onChange={(e) => setInterval(parseInt(e.target.value))}
                  className="input w-20"
                />
                <span>
                  {recurrenceType === 'daily' ? 'days' : 
                   recurrenceType === 'weekly' ? 'weeks' : 'months'}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                Custom interval (days)
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={customInterval}
                onChange={(e) => setCustomInterval(parseInt(e.target.value))}
                className="input w-full"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Start date
            </label>
            <input
              type="date"
              value={format(new Date(startDate), 'yyyy-MM-dd')}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="input"
            />
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="has-end-date"
                checked={hasEndDate}
                onChange={(e) => setHasEndDate(e.target.checked)}
              />
              <label htmlFor="has-end-date" className="text-sm font-medium">Set end date</label>
            </div>
            
            {hasEndDate && (
              <input
                type="date"
                value={endDate ? format(new Date(endDate), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                className="input"
                min={format(new Date(startDate), 'yyyy-MM-dd')}
              />
            )}
          </div>
        </>
      )}
      
      {onClose && (
        <div className="flex justify-end mt-4">
          <button 
            type="button"
            onClick={onClose}
            className="btn btn-primary"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
};

export default RecurrenceSelector;