import jsPDF from "jspdf";
import 'jspdf-autotable';

export const generatePdf = (data) => {
  const doc = new jsPDF('landscape');
  const headers = [
    ['Flag', 'ID Project', 'Marketing Name',
      'Project Code', 'Status Approval', 'klpd',
      'location name', 'pagu', 'Procurement Type',
      'Sub Dis Name', 'Type Item', 'Progress'
    ]
  ];
  const rows = data.map(row => [
    row.flag,
    row.id_project,
    row.marketing_name,
    row.project_code,
    row.status_approval,
    row.klpd,
    row.location_name,
    row.pagu,
    row.procurement_type,
    row.sub_dis_name,
    row.type_item,
    row.progress_description
  ]);

  const pageWidth = doc.internal.pageSize.getWidth();
  const columnWidth = pageWidth / headers[0].length;

  doc.autoTable({
    startY: 20,
    head: headers,
    body: rows,
    theme: 'grid',
    columnStyles: { 0: { cellWidth: columnWidth } },
  });

  // Simpan atau tampilkan PDF (tergantung pada kebutuhan)
  doc.save('project_data.pdf');
};