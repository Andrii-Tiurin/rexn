export default function LineItemsTable({ items, onChange, onAdd, onRemove }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Leistungen</h3>
        <button
          type="button"
          className="rounded-md bg-primary px-3 py-1 text-sm font-medium text-white shadow-sm hover:bg-primary-dark"
          onClick={onAdd}
        >
          Position hinzufügen
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
          <thead className="bg-slate-50 dark:bg-slate-800">
            <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-300">
              <th className="px-4 py-3">Beschreibung</th>
              <th className="px-4 py-3">Menge</th>
              <th className="px-4 py-3">Einheit</th>
              <th className="px-4 py-3">Einzelpreis (€)</th>
              <th className="px-4 py-3">MwSt. (%)</th>
              <th className="px-4 py-3">Gesamt</th>
              <th className="px-4 py-3">&nbsp;</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-sm dark:divide-slate-700 dark:bg-slate-900 dark:text-slate-100">
            {items.map((item, index) => {
              const total = Number(item.quantity) * Number(item.unitPrice || 0);
              return (
                <tr key={item.id} className="align-top">
                  <td className="px-4 py-3">
                    <textarea
                      rows={3}
                      className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50"
                      placeholder="Beschreibung in RU/UA/EN"
                      value={item.name}
                      onChange={(event) => onChange(index, 'name', event.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50"
                      value={item.quantity}
                      onChange={(event) => onChange(index, 'quantity', Number(event.target.value))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      className="w-20 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50"
                      value={item.unit}
                      onChange={(event) => onChange(index, 'unit', event.target.value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-28 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50"
                      value={item.unitPrice}
                      onChange={(event) => onChange(index, 'unitPrice', Number(event.target.value))}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="w-24 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50"
                      value={item.vatRate}
                      onChange={(event) => onChange(index, 'vatRate', Number(event.target.value))}
                    />
                  </td>
                  <td className="px-4 py-3 text-right font-medium">
                    {total.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="rounded-md bg-rose-500 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm hover:bg-rose-600"
                        onClick={() => onRemove(index)}
                      >
                        Entfernen
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
