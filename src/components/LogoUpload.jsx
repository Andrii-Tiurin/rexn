import { useRef } from 'react';

export default function LogoUpload({ logo, onUpload, onRemove }) {
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      {logo ? (
        <div className="space-y-2">
          <img src={logo} alt="Logo" className="mx-auto max-h-24 object-contain" />
          <div className="flex justify-center gap-2 text-sm">
            <button
              type="button"
              className="rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
              onClick={() => fileInputRef.current?.click()}
            >
              Logo ersetzen
            </button>
            <button
              type="button"
              className="rounded-md border border-transparent bg-rose-500 px-3 py-1 font-medium text-white shadow-sm hover:bg-rose-600"
              onClick={onRemove}
            >
              Entfernen
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-medium">Logo hochladen</p>
          <p>Bild hier ablegen oder klicken, um eine Datei auszuwählen.</p>
          <button
            type="button"
            className="rounded-md border border-slate-300 px-3 py-1 font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800"
            onClick={() => fileInputRef.current?.click()}
          >
            Datei wählen
          </button>
        </div>
      )}
    </div>
  );
}
