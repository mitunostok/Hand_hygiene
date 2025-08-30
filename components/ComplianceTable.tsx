import React, { useMemo } from 'react';
import { AuditSession, HHAction } from '../types';

interface Props {
  sessions: AuditSession[];
}

interface MonthlyStats {
  actions: number;
  opportunities: number;
  missed: number;
}

const ComplianceTable: React.FC<Props> = ({ sessions }) => {
  const monthlyData = useMemo(() => {
    const data: Record<string, MonthlyStats> = {};

    sessions.forEach(session => {
      const sessionDate = new Date(session.date);
      // Adjust for timezone to ensure date parts are consistent regardless of user's timezone
      const adjustedDate = new Date(sessionDate.valueOf() + sessionDate.getTimezoneOffset() * 60 * 1000);

      const monthYear = adjustedDate.toLocaleString('en-GB', { month: 'short', year: '2-digit' }).replace(' ', '-');
      
      if (!data[monthYear]) {
        data[monthYear] = { actions: 0, opportunities: 0, missed: 0 };
      }

      session.columns.forEach(col => {
        col.opportunities.forEach(opp => {
          if (opp.action) {
            data[monthYear].opportunities++;
            if (opp.action === HHAction.HR || opp.action === HHAction.HW) {
              data[monthYear].actions++;
            }
          }
        });
      });
    });

    Object.values(data).forEach(monthStats => {
        monthStats.missed = monthStats.opportunities - monthStats.actions;
    });

    return data;
  }, [sessions]);

  const sortedMonths = useMemo(() => {
    return Object.keys(monthlyData).sort((a, b) => {
      const dateA = new Date(`01-${a.replace('-', ' ')}`);
      const dateB = new Date(`01-${b.replace('-', ' ')}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [monthlyData]);

  if (sortedMonths.length === 0) {
      return null;
  }

  const renderCell = (value: number | string, key: string) => (
      <td key={key} className="px-4 py-2 border text-center">{value}</td>
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">Monthly Compliance Summary</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border text-left font-semibold text-gray-600">Hand hygiene compliance</th>
              {sortedMonths.map(month => <th key={month} className="px-4 py-2 border font-semibold text-gray-600">{month}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border font-medium text-gray-700">Total No of hand hygiene actions performed</td>
              {sortedMonths.map(month => renderCell(monthlyData[month].actions, `${month}-actions`))}
            </tr>
            <tr>
              <td className="px-4 py-2 border font-medium text-gray-700">Total No of hand hygiene Opportunities</td>
              {sortedMonths.map(month => renderCell(monthlyData[month].opportunities, `${month}-opps`))}
            </tr>
            <tr className="font-bold bg-blue-50">
              <td className="px-4 py-2 border text-brand-blue">Hand hygiene compliance rate</td>
              {sortedMonths.map(month => {
                  const data = monthlyData[month];
                  const rate = data.opportunities > 0 ? ((data.actions / data.opportunities) * 100).toFixed(0) + '%' : '#DIV/0!';
                  return renderCell(rate, `${month}-rate`);
              })}
            </tr>
            <tr>
              <td className="px-4 py-2 border font-medium text-gray-700">Benchmark - 85%</td>
              {sortedMonths.map(month => renderCell('85%', `${month}-benchmark`))}
            </tr>
            <tr>
              <td className="px-4 py-2 border font-medium text-gray-700">Missed opportunity</td>
              {sortedMonths.map(month => renderCell(monthlyData[month].missed, `${month}-missed`))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComplianceTable;
