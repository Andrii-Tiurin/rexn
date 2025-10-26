# Ukrainisch-deutscher Rechnungs-Generator (SPA)

Ein Single-Page-React-Projekt (Vite + TailwindCSS), mit dem ukrainische Unternehmer professionelle deutsche Rechnungen für Kund:innen in Deutschland erstellen können. Die Eingabe kann auf Ukrainisch, Russisch oder Englisch erfolgen; das System übersetzt automatisch ins Deutsche und generiert ein druckfertiges PDF.

## ✨ Funktionsumfang
- Zweispaltiges Layout: Formular links, Live-Vorschau rechts (mobil untereinander).
- Logo-Upload per Drag & Drop.
- Automatische Rechnungsnummer (YYYYMMDD-NNN) und Berechnung von Netto-, MwSt.- und Gesamtbeträgen.
- Positionstabelle mit Mehrsprachigkeit und automatischer Übersetzung der Beschreibung.
- Wahlweise deutsche SEPA- oder ukrainische SWIFT-Zahlungsinformationen, inkl. GiroCode-QR für SEPA.
- Rechtliche Pflichtangaben sowie optionale Kleinunternehmer-Kennzeichnung gemäß §19 UStG.
- PDF-Vorschau, -Download, -Druck sowie Entwurf-Speicherung in `localStorage`.
- Deutsche E-Mail-Textbausteine für den Versand via SEPA oder SWIFT.
- Dunkel-/Hellmodus.

## 🧪 Lokale Entwicklung
```bash
npm install
npm run dev
```
Der Dev-Server startet standardmäßig auf [http://localhost:5173](http://localhost:5173).

### Produktion / Build
```bash
npm run build
npm run preview
```

> **Hinweis:** Für die Übersetzungsfunktion wird der öffentliche Dienst [LibreTranslate](https://libretranslate.de) verwendet. Eine Internetverbindung ist notwendig, damit die automatische Übersetzung funktioniert. Bei Ausfällen wird der Originaltext angezeigt.

## 📁 Projektstruktur (Auszug)
```
├── src
│   ├── App.jsx                # Hauptseite mit Formular, Vorschau und Aktionen
│   ├── components             # UI-Komponenten (Formular, Preview, Modale, etc.)
│   ├── data                   # Statische Unternehmens- und Zahlungsdaten
│   ├── hooks                  # Custom Hooks (z. B. Debounce)
│   └── utils                  # Übersetzungshelfer
├── public                     # (Optional) statische Assets
├── index.html                 # Vite-Einstiegspunkt
└── tailwind.config.cjs        # Tailwind-Konfiguration
```

## 🧾 Rechtliche Angaben
- Sole Proprietor Budnik Volodymyr Serhiiovych
- SWIFT-Daten: UA533052990000026001006705408 · BIC PBANUA2X · Bank PRIVATBANK
- Kontakte: toursmono@gmail.com · +380 63 832 34 90

## 📄 Lizenz
Dieses Demo-Projekt steht unter der MIT-Lizenz.
