import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const A4_WIDTH = 210;
const MARGIN = 20;

async function generatePdfFromElement(element, filename, mode = 'download') {
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff'
  });
  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = A4_WIDTH - MARGIN * 2;
  const pageHeight = (canvas.height * pageWidth) / canvas.width;
  pdf.addImage(imgData, 'PNG', MARGIN, MARGIN, pageWidth, pageHeight);

  if (mode === 'preview') {
    const dataUriString = pdf.output('datauristring');
    const win = window.open();
    if (win) {
      win.document.write(`<iframe width="100%" height="100%" src="${dataUriString}"></iframe>`);
    }
    return;
  }

  if (mode === 'print') {
    const blobUrl = pdf.output('bloburl');
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    iframe.onload = () => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    };
    return;
  }

  pdf.save(filename);
}

export default function PdfActions({ invoice, onSaveDraft, onShowEmail, onValidate }) {
  const handleAction = async (mode) => {
    if (onValidate && !onValidate()) {
      return;
    }
    const element = document.getElementById('invoice-preview');
    if (!element) return;
    const fileName = `Rechnung-${invoice.invoice.number || 'Entwurf'}.pdf`;
    await generatePdfFromElement(element, fileName, mode);
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        onClick={() => handleAction('preview')}
      >
        PDF Vorschau
      </button>
      <button
        type="button"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
        onClick={() => handleAction('download')}
      >
        PDF herunterladen
      </button>
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        onClick={() => handleAction('print')}
      >
        Drucken
      </button>
      <button
        type="button"
        className="rounded-md border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-600"
        onClick={onSaveDraft}
      >
        Entwurf speichern
      </button>
      <button
        type="button"
        className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        onClick={onShowEmail}
      >
        E-Mail-Text anzeigen
      </button>
    </div>
  );
}
