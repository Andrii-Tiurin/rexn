import LogoUpload from './LogoUpload.jsx';
import LineItemsTable from './LineItemsTable.jsx';
import PaymentDetails from './PaymentDetails.jsx';
import { germanVatNote } from '../data/constants.js';

export default function InvoiceForm({
  invoice,
  totals,
  onFieldChange,
  onItemChange,
  onAddItem,
  onRemoveItem,
  onSepaChange,
  onLogoUpload,
  onLogoRemove
}) {
  return (
    <div className="space-y-8">
      <LogoUpload logo={invoice.logo} onUpload={onLogoUpload} onRemove={onLogoRemove} />

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Kundendaten</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Firma / Name
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.client.company}
              onChange={(event) => onFieldChange(['client', 'company'], event.target.value)}
              placeholder="Text in RU/UA/EN"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Straße und Hausnummer
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.client.address}
              onChange={(event) => onFieldChange(['client', 'address'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">PLZ</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.client.zip}
              onChange={(event) => onFieldChange(['client', 'zip'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Stadt</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.client.city}
              onChange={(event) => onFieldChange(['client', 'city'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Land</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.client.country}
              onChange={(event) => onFieldChange(['client', 'country'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">E-Mail</label>
            <input
              type="email"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.client.email}
              onChange={(event) => onFieldChange(['client', 'email'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">Telefon</label>
            <input
              type="tel"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.client.phone}
              onChange={(event) => onFieldChange(['client', 'phone'], event.target.value)}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Rechnungsdetails</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Rechnungs-Nr.
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.invoice.number}
              onChange={(event) => onFieldChange(['invoice', 'number'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Rechnungsdatum
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.invoice.date}
              onChange={(event) => onFieldChange(['invoice', 'date'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Leistungsdatum
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.invoice.serviceDate}
              onChange={(event) => onFieldChange(['invoice', 'serviceDate'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Kunden-Nr.
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.invoice.customerNumber}
              onChange={(event) => onFieldChange(['invoice', 'customerNumber'], event.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Fälligkeitsdatum
            </label>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
              value={invoice.invoice.dueDate}
              onChange={(event) => onFieldChange(['invoice', 'dueDate'], event.target.value)}
            />
          </div>
          <div className="md:col-span-2 flex items-center gap-3">
            <input
              id="vatNote"
              type="checkbox"
              className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-600"
              checked={invoice.invoice.vatNote}
              onChange={(event) => onFieldChange(['invoice', 'vatNote'], event.target.checked)}
            />
            <label htmlFor="vatNote" className="text-sm text-slate-600 dark:text-slate-300">
              {germanVatNote}
            </label>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <LineItemsTable items={invoice.items} onChange={onItemChange} onAdd={onAddItem} onRemove={onRemoveItem} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <PaymentDetails
          invoice={invoice}
          totals={totals}
          showSepa={Boolean(invoice.payment.sepa.iban)}
          showSwift={true}
          onSepaChange={onSepaChange}
        />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
          Zusätzliche Hinweise
        </h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">
          Diese Notiz wird automatisch ins Deutsche übersetzt und im PDF-Fußtext angezeigt.
        </p>
        <textarea
          rows={4}
          className="mt-4 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-950/50 dark:text-slate-100"
          value={invoice.notes}
          onChange={(event) => onFieldChange(['notes'], event.target.value)}
        />
      </section>
    </div>
  );
}
