import { useEffect, useMemo, useState } from 'react';
import InvoiceForm from './components/InvoiceForm.jsx';
import InvoicePreview from './components/InvoicePreview.jsx';
import PdfActions from './components/PdfActions.jsx';
import EmailTemplates from './components/EmailTemplates.jsx';
import useDebounce from './hooks/useDebounce.js';
import { defaultInvoice, emailTemplates, swiftDetails } from './data/constants.js';
import { translateInvoice } from './utils/translation.js';
import { isValid as isValidIban } from 'iban';

const STORAGE_KEY = 'invoice-generator-draft-v1';

const generateInvoiceNumber = () => {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(
    date.getDate()
  ).padStart(2, '0')}`;
  const suffix = Math.floor(Math.random() * 900 + 100);
  return `${ymd}-${suffix}`;
};

const computeTotals = (items) => {
  return items.reduce(
    (acc, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      const vatRate = Number(item.vatRate) || 0;
      const net = quantity * unitPrice;
      const vat = (net * vatRate) / 100;
      acc.subtotal += net;
      acc.vat += vat;
      acc.total += net + vat;
      return acc;
    },
    { subtotal: 0, vat: 0, total: 0 }
  );
};

function getReference(invoice) {
  const invoiceNumber = invoice.invoice.number;
  const customerNumber = invoice.invoice.customerNumber;
  if (invoiceNumber && customerNumber) return `${invoiceNumber} ${customerNumber}`;
  return invoiceNumber || customerNumber || '';
}

export default function App() {
  const [invoice, setInvoice] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return {
            ...defaultInvoice,
            ...parsed,
            invoice: { ...defaultInvoice.invoice, ...parsed.invoice },
            client: { ...defaultInvoice.client, ...parsed.client },
            items: parsed.items?.length ? parsed.items : defaultInvoice.items
          };
        } catch (error) {
          console.warn('Draft parsing error', error);
        }
      }
    }
    return {
      ...defaultInvoice,
      invoice: { ...defaultInvoice.invoice, number: generateInvoiceNumber() }
    };
  });
  const [translations, setTranslations] = useState({ client: {}, items: [] });
  const [translationLoading, setTranslationLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-color-scheme: dark)').matches : false
  );
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState([]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const debouncedInvoice = useDebounce(invoice, 600);

  useEffect(() => {
    let isMounted = true;
    const runTranslation = async () => {
      setTranslationLoading(true);
      try {
        const translated = await translateInvoice(debouncedInvoice);
        if (isMounted) {
          setTranslations(translated);
        }
      } catch (error) {
        console.warn('Translation failed', error);
      } finally {
        if (isMounted) setTranslationLoading(false);
      }
    };

    runTranslation();
    return () => {
      isMounted = false;
    };
  }, [debouncedInvoice]);

  const totals = useMemo(() => computeTotals(invoice.items), [invoice.items]);
  const reference = useMemo(() => getReference(invoice), [invoice]);

  const handleFieldChange = (path, value) => {
    setInvoice((prev) => {
      const updated = { ...prev };
      let current = updated;
      for (let i = 0; i < path.length - 1; i += 1) {
        current[path[i]] = { ...current[path[i]] };
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return updated;
    });
  };

  const handleItemChange = (index, field, value) => {
    setInvoice((prev) => {
      const items = prev.items.map((item, idx) =>
        idx === index
          ? {
              ...item,
              [field]: field === 'name' ? value : value ?? 0
            }
          : item
      );
      return { ...prev, items };
    });
  };

  const handleAddItem = () => {
    setInvoice((prev) => {
      const nextId = prev.items.length ? Math.max(...prev.items.map((item) => item.id)) + 1 : 1;
      return {
        ...prev,
        items: [
          ...prev.items,
          {
            id: nextId,
            name: '',
            quantity: 1,
            unit: 'Stk.',
            unitPrice: 0,
            vatRate: 0,
            translation: ''
          }
        ]
      };
    });
  };

  const handleRemoveItem = (index) => {
    setInvoice((prev) => {
      if (prev.items.length <= 1) return prev;
      return { ...prev, items: prev.items.filter((_, idx) => idx !== index) };
    });
  };

  const handleSepaChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      payment: {
        ...prev.payment,
        sepa: {
          ...prev.payment.sepa,
          [field]: value
        }
      }
    }));
  };

  const handleLogoUpload = (imageData) => {
    setInvoice((prev) => ({ ...prev, logo: imageData }));
  };

  const handleLogoRemove = () => {
    setInvoice((prev) => ({ ...prev, logo: null }));
  };

  const validateInvoice = () => {
    const messages = [];
    if (!invoice.client.company) messages.push('Empfängername ist erforderlich.');
    if (!invoice.invoice.number) messages.push('Rechnungsnummer fehlt.');
    if (!invoice.invoice.date) messages.push('Rechnungsdatum fehlt.');
    if (!invoice.items.length || !invoice.items.some((item) => item.name.trim())) {
      messages.push('Mindestens eine Position mit Beschreibung wird benötigt.');
    }
    if (invoice.payment.sepa.iban) {
      const isSepaIban =
        isValidIban(invoice.payment.sepa.iban) &&
        invoice.payment.sepa.iban.trim().toUpperCase().startsWith('DE');
      if (!isSepaIban) {
        messages.push('Die angegebene SEPA-IBAN ist ungültig.');
      }
    }
    if (!swiftDetails.bic) {
      messages.push('SWIFT-BIC ist erforderlich.');
    }
    if (messages.length) {
      setFeedbackMessages(messages.map((text) => ({ type: 'error', text })));
      return false;
    }
    setFeedbackMessages([]);
    return true;
  };

  const handleSaveDraft = () => {
    const timestamp = new Date().toISOString();
    const payload = { ...invoice, lastSaved: timestamp };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    setInvoice(payload);
    setFeedbackMessages([{ type: 'success', text: 'Entwurf erfolgreich gespeichert.' }]);
  };

  useEffect(() => {
    if (!invoice.invoice.number) {
      setInvoice((prev) => ({
        ...prev,
        invoice: { ...prev.invoice, number: generateInvoiceNumber() }
      }));
    }
  }, [invoice.invoice.number]);

  const handleShowEmail = () => {
    if (!validateInvoice()) {
      setShowEmailModal(false);
      return;
    }
    setShowEmailModal(true);
  };

  const formattedEmailTemplates = useMemo(() => {
    const amount = totals.total.toLocaleString('de-DE', {
      style: 'currency',
      currency: 'EUR'
    });
    const replacements = {
      '{invoiceNumber}': invoice.invoice.number,
      '{dueDate}': invoice.invoice.dueDate || '---',
      '{reference}': reference,
      '{amount}': amount,
      '{entrepreneur}': invoice.company?.name || defaultInvoice.company.name
    };

    const replaceAll = (template) =>
      Object.entries(replacements).reduce(
        (acc, [token, value]) => acc.replaceAll(token, value),
        template
      );

    return {
      sepa: replaceAll(emailTemplates.sepa),
      swift: replaceAll(emailTemplates.swift)
    };
  }, [totals.total, invoice.invoice.number, invoice.invoice.dueDate, reference, invoice.company?.name]);

  const sepaEnabled = Boolean(
    invoice.payment.sepa.iban &&
      invoice.payment.sepa.iban.trim().toUpperCase().startsWith('DE') &&
      isValidIban(invoice.payment.sepa.iban)
  );

  const showSwift = true;

  return (
    <div className="min-h-screen bg-slate-100 pb-16 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-primary">Ukraine → Deutschland</p>
            <h1 className="mt-1 text-3xl font-semibold">Professioneller Rechnungs-Generator</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
              Erfassen Sie Rechnungsdaten in Russisch, Ukrainisch oder Englisch. Die Vorschau und PDF-Ausgabe werden automatisch ins professionelle Deutsch übersetzt.
            </p>
          </div>
          <button
            type="button"
            className="self-start rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            onClick={() => setDarkMode((prev) => !prev)}
          >
            {darkMode ? 'Hellmodus' : 'Dunkelmodus'}
          </button>
        </header>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <InvoiceForm
              invoice={invoice}
              totals={totals}
              onFieldChange={handleFieldChange}
              onItemChange={handleItemChange}
              onAddItem={handleAddItem}
              onRemoveItem={handleRemoveItem}
              onSepaChange={handleSepaChange}
              onLogoUpload={handleLogoUpload}
              onLogoRemove={handleLogoRemove}
            />
          </div>

          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                  Vorschau auf Deutsch
                </h2>
                {translationLoading && (
                  <span className="text-xs font-medium text-primary">Übersetzung...</span>
                )}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Originaltexte werden automatisch übersetzt. Die Vorschau zeigt das finale PDF-Layout.
              </p>
            </div>
            <InvoicePreview
              invoice={invoice}
              totals={totals}
              translations={translations}
              sepaEnabled={sepaEnabled}
              includeSwift={showSwift}
              reference={reference}
            />
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <PdfActions
                invoice={invoice}
                onSaveDraft={handleSaveDraft}
                onShowEmail={handleShowEmail}
                onValidate={validateInvoice}
              />
              {feedbackMessages.length > 0 && (
                <ul className="mt-4 space-y-2 text-sm">
                  {feedbackMessages.map((message, index) => (
                    <li
                      key={index}
                      className={
                        message.type === 'error'
                          ? 'text-rose-500'
                          : 'text-emerald-500'
                      }
                    >
                      • {message.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      <EmailTemplates
        open={showEmailModal}
        onClose={() => setShowEmailModal(false)}
        templates={formattedEmailTemplates}
      />
    </div>
  );
}
