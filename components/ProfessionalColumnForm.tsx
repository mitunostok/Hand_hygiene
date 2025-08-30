
import React from 'react';
import { ProfessionalColumn, ProfessionalCategory, Indication, HHAction } from '../types';
import { PROFESSIONAL_CATEGORY_LABELS, INDICATION_LABELS, HHACTION_LABELS } from '../constants';
import { X } from 'lucide-react';

interface Props {
  columnIndex: number;
  columnData: ProfessionalColumn;
  setColumns: React.Dispatch<React.SetStateAction<ProfessionalColumn[]>>;
  removeColumn: (index: number) => void;
  canRemove: boolean;
}

const ProfessionalColumnForm: React.FC<Props> = ({ columnIndex, columnData, setColumns, removeColumn, canRemove }) => {

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateColumn(columnIndex, { ...columnData, profCategory: e.target.value as ProfessionalCategory });
  };

  const handleIndicationChange = (oppIndex: number, indication: Indication) => {
    const newOpportunities = [...columnData.opportunities];
    const currentIndications = newOpportunities[oppIndex].indications;
    if (currentIndications.includes(indication)) {
      newOpportunities[oppIndex].indications = currentIndications.filter(i => i !== indication);
    } else {
      newOpportunities[oppIndex].indications.push(indication);
    }
    updateColumn(columnIndex, { ...columnData, opportunities: newOpportunities });
  };

  const handleActionChange = (oppIndex: number, action: HHAction) => {
    const newOpportunities = [...columnData.opportunities];
    newOpportunities[oppIndex].action = action;
    updateColumn(columnIndex, { ...columnData, opportunities: newOpportunities });
  };
  
  const updateColumn = (index: number, newData: ProfessionalColumn) => {
    setColumns(prev => prev.map((col, i) => i === index ? newData : col));
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-3">
        <select
          value={columnData.profCategory}
          onChange={handleCategoryChange}
          className="block w-full text-sm font-bold p-2 border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue"
        >
          {Object.entries(PROFESSIONAL_CATEGORY_LABELS).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
        {canRemove && (
           <button onClick={() => removeColumn(columnIndex)} className="ml-2 text-red-500 hover:text-red-700">
             <X size={20} />
           </button>
        )}
      </div>

      <div className="space-y-4">
        {columnData.opportunities.map((opp, oppIndex) => (
          <div key={opp.id} className="p-3 bg-white rounded-md shadow-sm">
            <h4 className="font-bold text-gray-800">Opportunity {opp.id}</h4>
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-500 mb-1">Indication (select all that apply)</p>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {Object.values(Indication).map(ind => (
                  <label key={ind} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={opp.indications.includes(ind)}
                      onChange={() => handleIndicationChange(oppIndex, ind)}
                      className="h-4 w-4 rounded border-gray-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span>{ind}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="mt-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">HH Action (select one)</p>
              <div className="grid grid-cols-2 gap-1 text-sm">
                {Object.values(HHAction).map(act => (
                  <label key={act} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name={`action-${columnIndex}-${oppIndex}`}
                      checked={opp.action === act}
                      onChange={() => handleActionChange(oppIndex, act)}
                      className="h-4 w-4 border-gray-300 text-brand-blue focus:ring-brand-blue"
                    />
                    <span>{act}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalColumnForm;
