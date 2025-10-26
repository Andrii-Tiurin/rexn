import { useMemo } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { isValid as isValidIban } from 'iban';
import { swiftDetails } from '../data/constants.js';

const generateReference = (invoiceNumber, customerNumber) => {
  if (invoiceNumber && customerNumber) return `${invoiceNumber} ${customerNumber}`;
  if (invoiceNumber) return invoiceNumber;
  return customerNumber || '';
};

function buildGiroCode({
  name,
  iban,
  bic,
  amount,
  purpose,
  creditorReference,
  information
}) {
  const payload = [
    'BCD',
    '002',
    '1',
    'SCT',
    bic || '',
    name,
    iban,
    '',
    amount ? `EUR${amount.toFixed(2)}` : '',
    purpose || '',
    creditorReference || '',
    information || ''
  ]
    .map((line) => line.normalize('NFKD'))
    .join('\n');

  return payload;
}

export default function PaymentDetails({
  invoice,
  totals,
  showSepa,
  showSwift,
  onSepaChange
}) {
  const sepaValid = useMemo(() => {
    const iban = invoice.payment.sepa.iban?.trim();
    if (!iban) return false;
    return isValidIban(iban) && iban.toUpperCase().startsWith('DE');
  }, [invoice.payment.sepa.iban]);

  const amount = totals.total;
  const reference = generateReference(invoice.invoice.number, invoice.invoice.customerNumber);

  const giroCode = useMemo(() => {
    if (!sepaValid) return '';
    return buildGiroCode({
      name: invoice.company.name,
      iban: invoice.payment.sepa.iban.replace(/\s+/g, ''),
      bic: invoice.payment.sepa.bic,
      amount,
      purpose: 'RECHNUNG',
      information: reference
    });
  }, [sepaValid, invoice, amount, reference]);

  const displaySepaBlock = showSepa && sepaValid;

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Zahlungsinformationen
        </h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              IBAN (Deutschland)
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="DE..."
              value={invoice.payment.sepa.iban}
              onChange={(event) => onSepaChange('iban', event.target.value.toUpperCase())}
            />
            {invoice.payment.sepa.iban && !sepaValid && (
              <p className="mt-1 text-xs text-rose-500">
                Bitte geben Sie eine gültige deutsche IBAN ein, um SEPA zu nutzen.
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              BIC
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="GENODEF1XXX"
              value={invoice.payment.sepa.bic}
              onChange={(event) => onSepaChange('bic', event.target.value.toUpperCase())}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300">
              Bankname
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              placeholder="Bank"
              value={invoice.payment.sepa.bankName}
              onChange={(event) => onSepaChange('bankName', event.target.value)}
            />
          </div>
        </div>
      </div>

      {displaySepaBlock && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-md mb-2 font-semibold text-slate-800 dark:text-slate-100">
            Zahlung in Deutschland (SEPA)
          </h4>
          <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200">
            <p>
              <span className="font-semibold">Empfänger:</span> {invoice.company.name}
            </p>
            <p>
              <span className="font-semibold">IBAN:</span> {invoice.payment.sepa.iban}
            </p>
            <p>
              <span className="font-semibold">BIC:</span> {invoice.payment.sepa.bic}
            </p>
            <p>
              <span className="font-semibold">Bank:</span> {invoice.payment.sepa.bankName}
            </p>
            <p>
              <span className="font-semibold">Verwendungszweck:</span> {reference}
            </p>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2">
            <QRCodeSVG value={giroCode} size={144} includeMargin level="M" />
            <p className="text-xs text-slate-500">SEPA-GiroCode für schnelle Überweisungen.</p>
          </div>
        </div>
      )}

      {showSwift && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h4 className="text-md mb-2 font-semibold text-slate-800 dark:text-slate-100">
            Internationale Überweisung (SWIFT)
          </h4>
          <div className="grid gap-2 text-sm text-slate-700 dark:text-slate-200">
            <p>
              <span className="font-semibold">Empfänger:</span> {swiftDetails.recipient}
            </p>
            <p>
              <span className="font-semibold">Adresse:</span> {swiftDetails.address}
            </p>
            <p>
              <span className="font-semibold">IBAN:</span> {swiftDetails.iban}
            </p>
            <p>
              <span className="font-semibold">Bank:</span> {swiftDetails.bankName}
            </p>
            <p>
              <span className="font-semibold">BIC/SWIFT:</span> {swiftDetails.bic}
            </p>
            <p>
              <span className="font-semibold">MFO:</span> {swiftDetails.mfo}
            </p>
            <p>
              <span className="font-semibold">Steuer-ID:</span> {swiftDetails.taxId}
            </p>
            <p>
              <span className="font-semibold">E-Mail:</span> {swiftDetails.email}
            </p>
            <p>
              <span className="font-semibold">Telefon:</span> {swiftDetails.phone}
            </p>
            <p>
              <span className="font-semibold">Verwendungszweck:</span> {reference}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
