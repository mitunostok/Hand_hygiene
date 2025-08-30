import React, { useState, useMemo } from 'react';
import { useAuditForm } from '../contexts/AuditFormContext';
import { useAuth } from '../contexts/AuthContext';
import { AuditSession, HHAction, ProfessionalCategory, Indication } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PROFESSIONAL_CATEGORY_LABELS, INDICATION_LABELS } from '../constants';
import { generateCSV, generatePDF } from '../utils/exportUtils';
import { FileDown, Trash2 } from 'lucide-react';
import ComplianceTable from '../components/ComplianceTable';


const Dashboard: React.FC = () => {
  const { sessions, clearSessionsForUser } = useAuditForm();
  const { currentUser } = useAuth();
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });

  const userSessions = useMemo(() => {
    if (!currentUser) return [];
    return sessions.filter(s => s.observerEmail === currentUser.email);
  }, [sessions, currentUser]);

  const filteredSessions = useMemo(() => {
    if (!dateFilter.start && !dateFilter.end) {
      return userSessions;
    }
    return userSessions.filter(session => {
      const sessionDate = new Date(session.date);
      const startDate = dateFilter.start ? new Date(dateFilter.start) : null;
      const endDate = dateFilter.end ? new Date(dateFilter.end) : null;
      
      if (startDate && sessionDate < startDate) return false;
      if (endDate && sessionDate > endDate) return false;
      return true;
    });
  }, [userSessions, dateFilter]);

  const handleExportCSV = () => {
    generateCSV(filteredSessions);
  };

  const handleExportPDF = () => {
    generatePDF(filteredSessions, complianceByProfData, complianceByIndicationData, overallCompliance);
  };
  
  const handleClearData = () => {
    if (currentUser && window.confirm('Are you sure you want to delete all of your audit data? This action cannot be undone.')) {
        clearSessionsForUser(currentUser.email);
    }
  };

  const overallCompliance = useMemo(() => {
    let totalOpportunities = 0;
    let totalCompliantActions = 0;
    filteredSessions.forEach(s => {
      s.columns.forEach(c => {
        c.opportunities.forEach(o => {
          if (o.action) {
            totalOpportunities++;
            if (o.action === HHAction.HR || o.action === HHAction.HW) {
              totalCompliantActions++;
            }
          }
        });
      });
    });
    return totalOpportunities > 0 ? (totalCompliantActions / totalOpportunities) * 100 : 0;
  }, [filteredSessions]);

  const complianceByProfData = useMemo(() => {
    const data: { [key in ProfessionalCategory]?: { opps: number, comp: number } } = {};
    filteredSessions.forEach(s => {
      s.columns.forEach(c => {
        if (!data[c.profCategory]) {
          data[c.profCategory] = { opps: 0, comp: 0 };
        }
        c.opportunities.forEach(o => {
          if (o.action) {
            data[c.profCategory]!.opps++;
            if (o.action === HHAction.HR || o.action === HHAction.HW) {
              data[c.profCategory]!.comp++;
            }
          }
        });
      });
    });
    return Object.entries(data)
        .filter(([prof]) => prof !== ProfessionalCategory.EMPTY)
        .map(([prof, values]) => ({
            name: PROFESSIONAL_CATEGORY_LABELS[prof as ProfessionalCategory] || 'Unknown',
            Compliance: values.opps > 0 ? (values.comp / values.opps) * 100 : 0,
        }));
  }, [filteredSessions]);
  
  const complianceByIndicationData = useMemo(() => {
    const data: { [key in Indication]?: { opps: number, comp: number } } = {};
     Object.values(Indication).forEach(ind => data[ind] = { opps: 0, comp: 0 });

    filteredSessions.forEach(s => {
        s.columns.forEach(c => {
            c.opportunities.forEach(o => {
                if (o.action && o.indications.length > 0) {
                   o.indications.forEach(ind => {
                       data[ind]!.opps++;
                       if (o.action === HHAction.HR || o.action === HHAction.HW) {
                           data[ind]!.comp++;
                       }
                   });
                }
            });
        });
    });

    return Object.entries(data).map(([ind, values]) => ({
        name: INDICATION_LABELS[ind as Indication].substring(0, 20),
        Compliance: values.opps > 0 ? (values.comp / values.opps) * 100 : 0,
    }));
}, [filteredSessions]);


  if (userSessions.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-700">No Audit Data Found</h2>
        <p className="mt-2 text-gray-500">Please complete and save an audit form to see statistics.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-brand-blue mb-4">Filters & Actions</h2>
        <div className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Start Date</label>
              <input type="date" value={dateFilter.start} onChange={e => setDateFilter({...dateFilter, start: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">End Date</label>
              <input type="date" value={dateFilter.end} onChange={e => setDateFilter({...dateFilter, end: e.target.value})} className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"/>
            </div>
             <div className="flex space-x-2">
                <button onClick={handleExportCSV} className="flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    <FileDown className="h-5 w-5 mr-1"/> CSV
                </button>
                <button onClick={handleExportPDF} className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    <FileDown className="h-5 w-5 mr-1"/> PDF
                </button>
                <button onClick={handleClearData} className="flex items-center bg-gray-700 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                    <Trash2 className="h-5 w-5 mr-1"/> Clear My Data
                </button>
            </div>
        </div>
      </div>
      
      <div className="p-6 bg-white rounded-lg shadow-md text-center">
        <h3 className="text-xl font-semibold text-gray-700">Overall Compliance Rate</h3>
        <p className="text-5xl font-bold text-brand-green mt-2">{overallCompliance.toFixed(2)}%</p>
      </div>
      
      <ComplianceTable sessions={filteredSessions} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Compliance by Professional Category</h3>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceByProfData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" domain={[0, 100]}/>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`}/>
                  <Legend />
                  <Bar dataKey="Compliance" fill="#0072C6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
           <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Compliance by Indication</h3>
             <ResponsiveContainer width="100%" height={300}>
              <BarChart data={complianceByIndicationData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" domain={[0, 100]}/>
                  <Tooltip formatter={(value: number) => `${value.toFixed(2)}%`}/>
                  <Legend />
                  <Bar dataKey="Compliance" fill="#2E7D32" />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>
    </div>
  );
};

export default Dashboard;