import React, { useState, useEffect } from 'react';
import { ProfessionalColumn, AuditSession, ProfessionalCategory } from '../types';
import { useAuditForm } from '../contexts/AuditFormContext';
import { useAuth } from '../contexts/AuthContext';
import { createInitialColumn, DEPARTMENTS, WARDS } from '../constants';
import ProfessionalColumnForm from '../components/ProfessionalColumnForm';
import { Plus, Save, Trash2 } from 'lucide-react';

const AuditForm: React.FC = () => {
  const { addSession } = useAuditForm();
  const { currentUser } = useAuth();

  const [headerData, setHeaderData] = useState({
    facility: '', service: '', ward: WARDS[0], department: DEPARTMENTS[0],
    country: '', city: '', periodNumber: '', sessionNumber: '', observer: ''
  });
  const [columns, setColumns] = useState<ProfessionalColumn[]>([createInitialColumn()]);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [duration, setDuration] = useState(0); // in seconds

  useEffect(() => {
    if (currentUser) {
      setHeaderData(prev => ({
        ...prev,
        facility: currentUser.facility,
        country: currentUser.country,
        city: currentUser.city,
        observer: currentUser.name,
      }));
    }
  }, [currentUser]);

  useEffect(() => {
    if (!startTime) {
      setDuration(0);
      return;
    }

    const intervalId = setInterval(() => {
      const seconds = Math.floor((new Date().getTime() - startTime.getTime()) / 1000);
      setDuration(seconds);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [startTime]);

  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setHeaderData({ ...headerData, [e.target.name]: e.target.value });
  };

  const startSession = () => {
    if(!startTime) {
      const newSessionNumber = String(Date.now());
      setStartTime(new Date());
      setHeaderData(prev => ({...prev, sessionNumber: newSessionNumber}));
      alert(`Session started. Session Number: ${newSessionNumber}`);
    } else {
      alert('Session already in progress.');
    }
  };
  
  const addColumn = () => {
    if (columns.length < 4) {
      setColumns([...columns, createInitialColumn()]);
    }
  };

  const removeColumn = (index: number) => {
    if (columns.length > 1) {
      setColumns(columns.filter((_, i) => i !== index));
    }
  };

  const handleSave = () => {
    if (!startTime || !currentUser) {
      alert('Please start the session first.');
      return;
    }
    const endTime = new Date();
    const durationInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);
    
    const session: AuditSession = {
      id: new Date().toISOString(),
      ...headerData,
      date: new Intl.DateTimeFormat('en-CA').format(startTime),
      startTime: startTime.toTimeString().slice(0, 5),
      endTime: endTime.toTimeString().slice(0, 5),
      sessionDuration: durationInMinutes,
      columns: columns.filter(col => col.profCategory !== ProfessionalCategory.EMPTY && col.opportunities.some(op => op.action !== null)),
      observerEmail: currentUser.email,
    };

    if(session.columns.length === 0) {
      alert('No data to save. Please fill out at least one opportunity for an assigned professional category.');
      return;
    }

    addSession(session);
    alert('Session saved successfully!');
    resetForm();
  };

  const resetForm = () => {
    setHeaderData(prev => ({
        ...prev,
        service: '',
        ward: WARDS[0],
        department: DEPARTMENTS[0],
        periodNumber: '',
        sessionNumber: '',
    }));
    setColumns([createInitialColumn()]);
    setStartTime(null);
  };
  
  const renderInput = (key: string, value: string) => {
    const readOnlyFields = ['facility', 'country', 'city', 'observer', 'sessionNumber'];
    const dropdownFields: {[key: string]: string[]} = {'department': DEPARTMENTS, 'ward': WARDS};

    if (dropdownFields[key]) {
      return (
        <select
          id={key}
          name={key}
          value={value}
          onChange={handleHeaderChange}
          className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
        >
          {dropdownFields[key].map(option => <option key={option} value={option}>{option}</option>)}
        </select>
      );
    }

    return (
       <input
        type="text"
        id={key}
        name={key}
        value={value}
        onChange={handleHeaderChange}
        readOnly={readOnlyFields.includes(key)}
        className={`mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm ${readOnlyFields.includes(key) ? 'bg-gray-100' : ''}`}
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">Observation Header</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(headerData).map(([key, value]) => (
            <div key={key}>
              <label htmlFor={key} className="block text-sm font-medium text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              {renderInput(key, value)}
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow-md">
         <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-brand-blue">Observations</h2>
             <div className="flex items-center space-x-4">
                <button
                  onClick={startSession}
                  disabled={!!startTime}
                  className="flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-400"
                >
                  {startTime ? `Session in Progress` : 'Start Session'}
                </button>
                {startTime && (
                  <span className="text-lg font-mono p-2 bg-gray-100 rounded-md shadow-inner">
                    {formatDuration(duration)}
                  </span>
                )}
                 <button onClick={addColumn} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300" disabled={columns.length >= 4}>
                   <Plus className="h-5 w-5 mr-1"/> Add HCW
                 </button>
             </div>
         </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col, index) => (
            <ProfessionalColumnForm 
              key={index} 
              columnIndex={index} 
              columnData={col} 
              setColumns={setColumns}
              removeColumn={removeColumn}
              canRemove={columns.length > 1}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-6">
         <button onClick={resetForm} className="flex items-center bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
           <Trash2 className="h-5 w-5 mr-2"/> Reset Form
         </button>
         <button onClick={handleSave} className="flex items-center bg-brand-green hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
           <Save className="h-5 w-5 mr-2"/> Save Session
         </button>
      </div>
    </div>
  );
};

export default AuditForm;