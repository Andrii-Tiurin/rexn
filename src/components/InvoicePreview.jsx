import { entrepreneurInfo, legalNotices, swiftDetails, germanVatNote } from '../data/constants.js';

const formatCurrency = (value) =>
  Number(value || 0).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });

export default function InvoicePreview({
  invoice,
  totals,
  translations,
  sepaEnabled,
  includeSwift,
  reference
}) {
  const client = {
    ...invoice.client,
    ...translations?.client
  };
  const translatedNotes = translations?.invoice?.notes?.trim()
    ? translations.invoice.notes
    : invoice.notes;

  return (
    <div className="mx-auto w-full max-w-4xl rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-950" id="invoice-preview">
      <header className="flex items-start justify-between gap-4 border-b border-slate-200 pb-6 dark:border-slate-700">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-primary">Rechnung</p>
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {entrepreneurInfo.name}
          </h1>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            <p>{entrepreneurInfo.address}</p>
            <p>
              {entrepreneurInfo.email} · {entrepreneurInfo.phone}
            </p>
          </div>
        </div>
        {invoice.logo && (
          <div className="max-h-24 max-w-[160px]">
            <img
              src={invoice.logo}
              alt="Logo"
              className="h-full w-full object-contain"
            />
          </div>
        )}
      </header>

      <section className="grid gap-6 py-6 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Rechnung an</h2>
          <div className="space-y-1 text-sm text-slate-700 dark:text-slate-200">
            {client.company && <p className="font-semibold text-slate-800 dark:text-slate-100">{client.company}</p>}
            {client.address && <p>{client.address}</p>}
            {(client.zip || client.city) && (
              <p>
                {[client.zip, client.city].filter(Boolean).join(' ')}
              </p>
            )}
            {client.country && <p>{client.country}</p>}
            {client.email && <p>E-Mail: {client.email}</p>}
            {client.phone && <p>Telefon: {client.phone}</p>}
          </div>
        </div>
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Rechnungs-Nr.</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {invoice.invoice.number}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Rechnungsdatum</span>
            <span>{invoice.invoice.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Leistungsdatum</span>
            <span>{invoice.invoice.serviceDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Kundennummer</span>
            <span>{invoice.invoice.customerNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-slate-500">Fälligkeitsdatum</span>
            <span>{invoice.invoice.dueDate}</span>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
        <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-700">
          <thead className="bg-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800 dark:text-slate-200">
            <tr>
              <th className="px-4 py-3 text-left">Beschreibung</th>
              <th className="px-4 py-3 text-right">Menge</th>
              <th className="px-4 py-3 text-right">Einzelpreis</th>
              <th className="px-4 py-3 text-right">MwSt.</th>
              <th className="px-4 py-3 text-right">Gesamt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
            {invoice.items.map((item, index) => {
              const translatedItem = translations?.items?.[index]?.translation || item.name;
              const quantity = Number(item.quantity) || 0;
              const unitPrice = Number(item.unitPrice) || 0;
              const vatRate = Number(item.vatRate) || 0;
              const netTotal = quantity * unitPrice;
              const vatAmount = (netTotal * vatRate) / 100;
              return (
                <tr key={item.id}>
                  <td className="px-4 py-3 align-top text-left">
                    <p className="font-medium text-slate-800 dark:text-slate-100">{translatedItem}</p>
                    {item.name && translatedItem !== item.name && (
                      <p className="mt-1 text-xs text-slate-500">
                        Original: {item.name}
                      </p>
                    )}
                    {item.unit && (
                      <p className="mt-1 text-xs text-slate-400">Einheit: {item.unit}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                    {quantity} {item.unit}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                    {formatCurrency(unitPrice)}
                  </td>
                  <td className="px-4 py-3 text-right text-slate-600 dark:text-slate-300">
                    {vatRate.toLocaleString('de-DE')}%
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-100">
                    {formatCurrency(netTotal + vatAmount)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      <section className="mt-6 flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
          <p className="font-semibold uppercase tracking-wide text-slate-500">Zahlungsinformationen</p>
          {sepaEnabled && (
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Zahlung in Deutschland (SEPA)</p>
              <p>IBAN: {invoice.payment.sepa.iban}</p>
              {invoice.payment.sepa.bic && <p>BIC: {invoice.payment.sepa.bic}</p>}
              {invoice.payment.sepa.bankName && <p>Bank: {invoice.payment.sepa.bankName}</p>}
            </div>
          )}
          {includeSwift && (
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">Internationale Überweisung (SWIFT)</p>
              <p>IBAN: {swiftDetails.iban}</p>
              <p>BIC/SWIFT: {swiftDetails.bic}</p>
              <p>Bank: {swiftDetails.bankName}</p>
              <p>Empfänger: {swiftDetails.recipient}</p>
            </div>
          )}
          <p>Verwendungszweck: {reference}</p>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-500">Zwischensumme</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{formatCurrency(totals.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-500">MwSt.</dt>
              <dd className="font-medium text-slate-800 dark:text-slate-100">{formatCurrency(totals.vat)}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt className="text-slate-700 dark:text-slate-200">Gesamtbetrag</dt>
              <dd className="text-primary">{formatCurrency(totals.total)}</dd>
            </div>
          </dl>
        </div>
      </section>

      {invoice.invoice.vatNote && (
        <p className="mt-6 text-sm italic text-slate-500 dark:text-slate-300">{germanVatNote}</p>
      )}

      <section className="mt-6 text-sm text-slate-600 dark:text-slate-300">
        <p className="font-semibold text-slate-800 dark:text-slate-100">Rechtliche Hinweise</p>
        <p>{legalNotices.passport}</p>
        <p>{legalNotices.registration}</p>
        <p>{legalNotices.taxCertificate}</p>
      </section>

      <footer className="mt-8 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
        <p>{translatedNotes}</p>
        <p className="mt-2 text-xs text-slate-400">
          Zahlungsempfänger: {entrepreneurInfo.name} · Standort: Ukraine
        </p>
      </footer>
    </div>
  );
}
