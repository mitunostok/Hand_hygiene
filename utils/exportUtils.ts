import { AuditSession, HHAction, Indication } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateCSV = (sessions: AuditSession[]) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "SessionID,Date,Facility,Observer,ProfCategory,Opportunity,Indication_bef-pat,Indication_bef-asept,Indication_aft-bf,Indication_aft-pat,Indication_aft-psurr,Action,IsCompliant\n";

  sessions.forEach(session => {
    session.columns.forEach(column => {
      column.opportunities.forEach(opp => {
        if (opp.action) {
          const row = [
            session.id,
            session.date,
            session.facility,
            session.observer,
            column.profCategory,
            opp.id,
            opp.indications.includes(Indication.BEF_PAT) ? '1' : '0',
            opp.indications.includes(Indication.BEF_ASEPT) ? '1' : '0',
            opp.indications.includes(Indication.AFT_BF) ? '1' : '0',
            opp.indications.includes(Indication.AFT_PAT) ? '1' : '0',
            opp.indications.includes(Indication.AFT_P_SURR) ? '1' : '0',
            opp.action,
            (opp.action === HHAction.HR || opp.action === HHAction.HW) ? '1' : '0',
          ];
          csvContent += row.join(",") + "\n";
        }
      });
    });
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "hand_hygiene_audit.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export const generatePDF = (
  sessions: AuditSession[], 
  complianceByProf: any[], 
  complianceByIndication: any[], 
  overallCompliance: number
) => {
  const doc = new jsPDF();
  
  doc.text("Hand Hygiene Compliance Report", 14, 16);
  doc.setFontSize(11);
  doc.text(`Report Generated: ${new Date().toLocaleDateString()}`, 14, 22);

  doc.setFontSize(16);
  doc.text(`Overall Compliance: ${overallCompliance.toFixed(2)}%`, 14, 35);
  
  doc.setFontSize(12);
  doc.text("Compliance by Professional Category", 14, 45);
  autoTable(doc, {
    startY: 48,
    head: [['Category', 'Compliance (%)']],
    body: complianceByProf.map(item => [item.name, item.Compliance.toFixed(2)]),
  });

  const finalY = (doc as any).lastAutoTable.finalY;
  doc.text("Compliance by Indication", 14, finalY + 10);
  autoTable(doc, {
    startY: finalY + 13,
    head: [['Indication', 'Compliance (%)']],
    body: complianceByIndication.map(item => [item.name, item.Compliance.toFixed(2)]),
  });

  doc.save("hand_hygiene_report.pdf");
};
