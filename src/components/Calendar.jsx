import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Edit2, Trash2, Plus, Clock, MapPin, Users } from 'lucide-react'; //for icons 
import { fetchTasks, createTask, updateTask, deleteTask } from '../api';

const Calendar = ({ token }) => {  // controls the calendar component
  const [currentDate, setCurrentDate] = useState(new Date()); //controls visible month
  const [reminders, setReminders] = useState([]);  //events in the calendar
  const [showModal, setShowModal] = useState(false);  //event creation popup
  const [editingReminder, setEditingReminder] = useState(null);  //Holds the current event being edited
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    category: 'personal',
    priority: 'medium',
    location: '',
  });   //Binds all event fields

  const categories = {  // Defines UI classes for different event types
    work: { 
      bg: 'bg-blue-100', 
      border: 'border-blue-500', 
      text: 'text-blue-900',
      dot: 'bg-blue-600',
      hover: 'hover:bg-blue-200'
    },
    personal: { 
      bg: 'bg-green-100', 
      border: 'border-green-500', 
      text: 'text-green-900',
      dot: 'bg-green-600',
      hover: 'hover:bg-green-200'
    },
    social: { 
      bg: 'bg-purple-100', 
      border: 'border-purple-500', 
      text: 'text-purple-900',
      dot: 'bg-purple-600',
      hover: 'hover:bg-purple-200'
    },
    other: { 
      bg: 'bg-orange-100', 
      border: 'border-orange-500', 
      text: 'text-orange-900',
      dot: 'bg-orange-600',
      hover: 'hover:bg-orange-200'
    }
  };

  // Generate calendar start and end dates
  const startOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1);
  const endOfMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  const startOfWeek = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };
  
  const endOfWeek = (date) => {
    const d = new Date(date);
    d.setDate(d.getDate() + (6 - d.getDay()));
    return d;
  };
  
  const format = (date, type) => {
    const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    const shortMonths = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    
    if (type === 'MMMM yyyy') return `${months[date.getMonth()]} ${date.getFullYear()}`;
    if (type === 'MMM yyyy') return `${shortMonths[date.getMonth()]} ${date.getFullYear()}`;
    if (type === 'd') return date.getDate();
    if (type === 'yyyy-MM-dd') return date.toISOString().split('T')[0];
    return date.toString();
  };
  
  const isSameMonth = (d1, d2) => d1.getMonth() === d2.getMonth() && d1.getFullYear() === d2.getFullYear();
  const isToday = (date) => new Date().toDateString() === date.toDateString();
  const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();
  
  //Creates an array of all the days shown in the calendar grid 
  const eachDay = (start, end) => {
    const days = [];
    const cur = new Date(start);
    while (cur <= end) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const openModal = (date) => {
    setFormData({ ...formData, date: format(date, 'yyyy-MM-dd') });
    setShowModal(true);
    setEditingReminder(null);
  };

  // Fetch tasks for the logged-in user
  useEffect(() => {
    if (!token) return;
    fetchTasks(token)
      .then((data) => {
        const parsed = data.map((ev) => ({
          ...ev,
          date: new Date(ev.date),
          category: ev.category || 'personal',
          time: ev.time || '',
          title: ev.title || 'Untitled Event',
        }));
        setReminders(parsed);
      })
      .catch((err) => {
        console.error('Error loading tasks:', err);
        setReminders([]);
      });
  }, [token]);

  // Create or update a task
  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.date || !formData.time) {
      alert('Please fill in all required fields (Title, Date, and Time)');
      return;
    }
    const event = {
      title: formData.title.trim(),
      date: formData.date,
      time: formData.time,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      location: formData.location,
    };
    try {
      if (editingReminder) {
        await updateTask(editingReminder._id || editingReminder.id, event, token);
      } else {
        await createTask(event, token);
      }
      // Refresh tasks
      fetchTasks(token).then((data) => {
        const parsed = data.map((ev) => ({
          ...ev,
          date: new Date(ev.date),
          category: ev.category || 'personal',
          time: ev.time || '',
          title: ev.title || 'Untitled Event',
        }));
        setReminders(parsed);
      });
      setShowModal(false);
      setFormData({ title: '', date: '', time: '', description: '', category: 'personal', priority: 'medium', location: '' });
      setEditingReminder(null);
    } catch (err) {
      alert('Error saving event');
    }
  };

  // Delete a task
  const handleDelete = async (id) => {
    try {
      await deleteTask(id, token);
      fetchTasks(token).then((data) => {
        const parsed = data.map((ev) => ({
          ...ev,
          date: new Date(ev.date),
          category: ev.category || 'personal',
          time: ev.time || '',
          title: ev.title || 'Untitled Event',
        }));
        setReminders(parsed);
      });
    } catch (err) {
      alert('Error deleting event');
    }
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = eachDay(
    startOfWeek(startOfMonth(currentDate)),
    endOfWeek(endOfMonth(currentDate))
  );

  //conflict handling
  const hasConflict = (events) => {
  const seen = {};
  for (let ev of events) {
    const key = `${ev.date.toDateString()}_${ev.time}`;
    if (seen[key]) return true;
    seen[key] = true;
  }
  return false;
};

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-2 sm:p-4">
  <div className="max-w-7xl mx-auto">
    {/* Calendar Container */}
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-4 sm:px-6 md:px-10 py-4 md:py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
                )
              }
              className="p-2 bg-white text-blue-200 rounded-lg shadow hover:bg-indigo-100 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white whitespace-nowrap">
              {format(currentDate, 'MMMM yyyy')}
            </h1>

            <button
              onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
                )
              }
              className="p-2 bg-white text-blue-200 rounded-lg shadow hover:bg-indigo-100 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={goToToday}
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
          >
            Today
          </button>
        </div>
      </div>


          {/* Weekdays Header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map((day) => (
              <div key={day} className="py-4 text-center font-semibold text-gray-700 border-r border-gray-200 last:border-r-0">
                <span className="hidden md:inline">{day}</span>
                <span className="md:hidden">{day.substring(0, 3)}</span>
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 border-l border-gray-200">
            {days.map((day, i) => {
              const sameMonth = isSameMonth(day, currentDate);
              const today = isToday(day);
              const dayString = format(day, 'yyyy-MM-dd');
              const dayReminders = reminders.filter(
                (r) => format(r.date, 'yyyy-MM-dd') === dayString
              );

              return (
                <div
                  key={i}
                  onClick={() => openModal(day)}
                  className={`group h-32 md:h-36 border-r border-b border-gray-200 last:border-r-0 p-2 relative cursor-pointer transition-all duration-200 ${
                    sameMonth 
                      ? today 
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'bg-white hover:bg-gray-50'
                      : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                  }`}
                >
                  {/* Day Number */}
                  <div className={`text-sm font-semibold mb-1 ${
                    today 
                      ? 'bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center'
                      : sameMonth
                        ? 'text-gray-700'
                        : 'text-gray-400'
                  }`}>
                    {format(day, 'd')}
                  </div>

                  {/* Add Event Hint */}
                  {sameMonth && dayReminders.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-30 transition-opacity duration-200">
                      <Plus className="w-6 h-6 text-gray-400" />
                    </div>
                  )}

                  {/* Events */}
                  <div className="space-y-1 overflow-hidden">
                    {dayReminders.slice(0, 3).map((reminder, idx) => (
                      <div 
                        key={reminder.id || idx}
                        className={`text-xs px-2 py-1 rounded-md border-2 ${categories[reminder.category || 'personal'].bg} ${categories[reminder.category || 'personal'].border} ${categories[reminder.category || 'personal'].text} truncate ${categories[reminder.category || 'personal'].hover} transition-all duration-200 shadow-sm`}
                        title={`${reminder.title} - ${formatTime(reminder.time)}`}
                      >
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-2 flex-shrink-0 ${categories[reminder.category || 'personal'].dot} shadow-sm`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="font-semibold truncate text-gray-900">{reminder.title}</div>
                            {reminder.time && (
                              <div className="text-xs font-medium text-gray-700">{formatTime(reminder.time)}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {dayReminders.length > 3 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{dayReminders.length - 3} more
                      </div>
                    )}
                     {hasConflict(dayReminders) && (
                     <div className="text-xs text-red-500 font-medium px-2 mt-1">⚠ Overlapping Events
                    </div>
  )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Event Summary */}
        {reminders.length > 0 && (
          <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Events</h3>
            <div className="space-y-3">
              {reminders
                .filter(r => r.date >= new Date(new Date().setHours(0, 0, 0, 0)))
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 5)
                .map((reminder) => (
                  <div key={reminder.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors duration-200 border border-gray-300">
                    <div className={`w-4 h-4 rounded-full ${categories[reminder.category].dot} shadow-sm`}></div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900">{reminder.title}</div>
                      <div className="text-sm text-gray-700 flex items-center space-x-4 font-medium">
                        <span>{format(reminder.date, 'MMM')} {format(reminder.date, 'd')}</span>
                        {reminder.time && (
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(reminder.time)}
                          </span>
                        )}
                        {reminder.location && (
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {reminder.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingReminder(reminder);
                          setFormData({ 
                            title: reminder.title || '',
                            date: format(reminder.date, 'yyyy-MM-dd'),
                            time: reminder.time || '',
                            description: reminder.description || '',
                            category: reminder.category || 'personal',
                            priority: reminder.priority || 'medium',
                            location: reminder.location || ''
                          });
                          setShowModal(true);
                        }}
                        className="p-2 rounded-lg bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition"
                      >
                        <Edit2 className="w-4 h-4 text-white" />
                      </button>
                      <button
                        onClick={() => handleDelete(reminder._id || reminder.id)}
                        className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Event popup - Modal*/}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">
                  {editingReminder ? 'Edit Event' : 'Create New Event'}
                </h2>
                <button 
                  onClick={() => setShowModal(false)}
                 className="p-2 rounded-full hover:bg-gray-100 transition"
  aria-label="Close"
                >
                  {/*close button*/}
                  <X className="w-5 h-5 text-white hover:text-red-500 transition" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Team Meeting, Doctor Appointment" 
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 
             focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
             outline-none transition-all duration-200
             text-gray-900 placeholder-gray-400"
                   required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input 
                      type="date" 
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200  text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                    <input 
                      type="time" 
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200  text-gray-900 placeholder-gray-400"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Conference Room A, 123 Main St" 
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-400"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    placeholder="Add additional details about your event..." 
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200 min-h-[80px] resize-none  text-gray-900 placeholder-gray-400"
                  />
                </div>
                {/*Catergory and Priority selection*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-4 gap-2">
                    {Object.entries(categories).map(([key, style]) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: key })}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 text-sm font-semibold capitalize ${
                          formData.category === key 
                            ? `${style.bg} ${style.border} ${style.text} shadow-lg ring-2 ring-offset-2 ring-indigo-500`
                            : 'bg-gray-100 border-gray-300 text-white hover:bg-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full mx-auto mb-1 ${formData.category === key ? style.dot : 'bg-white'} shadow-sm`}></div>
                        {key}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select 
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all duration-200  text-gray-900 placeholder-gray-400"
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
                {/*Submit button*/}
                <button 
                  type="button"
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-3 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl mt-6"
                >
                  {editingReminder ? 'Update Event' : 'Create Event'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;

