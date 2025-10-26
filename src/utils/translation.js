const cache = new Map();

const ENDPOINT = 'https://libretranslate.de/translate';

const fallbackDictionary = new Map(
  Object.entries({
    Hallo: 'Hallo',
    'Vielen Dank': 'Vielen Dank'
  })
);

const normalizeKey = (value) => value.trim().toLowerCase();

export async function translateToGerman(text) {
  if (!text) return '';
  const key = normalizeKey(text);
  if (cache.has(key)) {
    return cache.get(key);
  }
  if (fallbackDictionary.has(text)) {
    const translated = fallbackDictionary.get(text);
    cache.set(key, translated);
    return translated;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const response = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'auto',
        target: 'de',
        format: 'text'
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!response.ok) {
      throw new Error('Übersetzungsdienst nicht verfügbar');
    }
    const data = await response.json();
    if (data?.translatedText) {
      cache.set(key, data.translatedText);
      return data.translatedText;
    }
  } catch (error) {
    console.warn('Translation error', error);
  }
  cache.set(key, text);
  return text;
}

export async function translateInvoice(invoice) {
  const translations = { client: {}, items: [] };
  const fields = [
    ['client', 'company', invoice.client.company],
    ['client', 'address', invoice.client.address],
    ['client', 'city', invoice.client.city],
    ['client', 'country', invoice.client.country],
    ['client', 'email', invoice.client.email],
    ['client', 'phone', invoice.client.phone],
    ['invoice', 'notes', invoice.notes]
  ];

  const promises = fields.map(async ([group, field, value]) => {
    const translated = await translateToGerman(value || '');
    translations[group] = translations[group] || {};
    translations[group][field] = translated;
  });

  const itemPromises = invoice.items.map(async (item, index) => {
    const translated = await translateToGerman(item.name || '');
    translations.items[index] = { ...item, translation: translated };
  });

  await Promise.all([...promises, ...itemPromises]);
  return translations;
}
