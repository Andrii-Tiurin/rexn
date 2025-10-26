export const entrepreneurInfo = {
  name: 'Sole Proprietor Budnik Volodymyr Serhiiovych',
  address:
    'Ukraine, 15011, Zhytomyr Region, Korosten, SAKKO I VANTSETTI Street, bld. 5/47, apt. 12',
  email: 'toursmono@gmail.com',
  phone: '+380638323490'
};

export const swiftDetails = {
  iban: 'UA533052990000026001006705408',
  bankName: 'PJSC CB "PRIVATBANK"',
  mfo: '305299',
  bic: 'PBANUA2X',
  recipient: entrepreneurInfo.name,
  address: entrepreneurInfo.address,
  taxId: '3419810813',
  email: entrepreneurInfo.email,
  phone: entrepreneurInfo.phone
};

export const legalNotices = {
  passport:
    'Pass: Serie ВН №474956, ausgestellt von Korosten MV UMVS Ukraine, Oblast Schytomyr, 27.11.2009',
  registration: 'Registrierungsbescheinigung №23060000000017601 (12.02.2020)',
  taxCertificate: 'Einheitssteuer-Bescheinigung №2006263400073 (17.02.2020)'
};

export const germanVatNote = 'Hinweis gemäß §19 UStG: Es wird keine Umsatzsteuer ausgewiesen.';

export const defaultInvoice = {
  locale: 'de-DE',
  currency: 'EUR',
  company: {
    name: entrepreneurInfo.name,
    email: entrepreneurInfo.email,
    phone: entrepreneurInfo.phone,
    address: entrepreneurInfo.address
  },
  client: {
    company: '',
    address: '',
    zip: '',
    city: '',
    country: '',
    email: '',
    phone: ''
  },
  invoice: {
    number: '',
    date: new Date().toISOString().substring(0, 10),
    serviceDate: new Date().toISOString().substring(0, 10),
    customerNumber: '',
    dueDate: '',
    vatNote: false
  },
  items: [
    {
      id: 1,
      name: '',
      quantity: 1,
      unit: 'Stk.',
      unitPrice: 0,
      vatRate: 0,
      translation: ''
    }
  ],
  payment: {
    sepa: {
      iban: '',
      bic: '',
      bankName: ''
    }
  },
  notes: 'Vielen Dank für Ihren Auftrag. Bei Fragen: toursmono@gmail.com, +380638323490.',
  logo: null,
  lastSaved: null
};

export const emailTemplates = {
  sepa: `Betreff: Rechnung {invoiceNumber} – Zahlung per SEPA\n\nSehr geehrte Damen und Herren,\n\nbitte finden Sie im Anhang die Rechnung {invoiceNumber} mit Fälligkeitsdatum {dueDate}.\nDie Zahlung können Sie bequem per SEPA-Überweisung vornehmen.\nVerwendungszweck: {reference}\nRechnungsbetrag: {amount}\n\nBei Rückfragen stehe ich Ihnen gerne zur Verfügung.\n\nMit freundlichen Grüßen\n{entrepreneur}`,
  swift: `Betreff: Rechnung {invoiceNumber} – internationale Überweisung\n\nSehr geehrte Damen und Herren,\n\nbitte begleichen Sie die Rechnung {invoiceNumber} bis spätestens {dueDate} mittels internationaler Überweisung (SWIFT).\nVerwendungszweck: {reference}\nRechnungsbetrag: {amount}\n\nFür eventuelle Bankspesen bitte "SHA" oder "OUR" vereinbaren.\n\nVielen Dank im Voraus.\n\nMit freundlichen Grüßen\n{entrepreneur}`
};
