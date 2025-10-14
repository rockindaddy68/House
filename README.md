# 🏠 House - Immobilien- und Hausverwaltungs-App

Eine moderne, umfassende React TypeScript Anwendung zur professionellen Verwaltung von Immobilien, Mietern und Finanzen.

![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-18+-61DAFB)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Übersicht

**House** ist eine vollständige Lösung für Vermieter und Hausverwaltungen zur Verwaltung von:
- 🏢 **Gebäuden** mit mehreren Wohneinheiten
- 👥 **Mietern** mit detaillierter Mietstruktur (Kalt-/Warmmiete)
- 💰 **Finanzen** inkl. Steuervorauszahlungen und Nebenkostenabrechnung
- 🔧 **Reparaturen** und Instandhaltungsmaßnahmen
- 📄 **Dokumenten** und Belegverwaltung

### ✨ Highlights

- **Keine Datenbank erforderlich** - Alle Daten werden lokal im Browser gespeichert
- **Offline-fähig** - Funktioniert ohne Internetverbindung
- **Responsive Design** - Optimiert für Desktop, Tablet und Mobile
- **Echtzeit-Berechnungen** - Automatische Warmmiete- und Statistik-Berechnung
- **Persistent** - Daten bleiben nach Browser-Neustart erhalten

---

## 🚀 Quick Start

### Voraussetzungen

- **Node.js** 18+ und npm
- Moderner Webbrowser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Repository klonen
git clone https://github.com/rockindaddy68/House.git
cd House

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

Die App läuft dann unter **http://localhost:5173**

### Build für Production

```bash
npm run build
```

Die fertigen Dateien befinden sich dann im `dist/` Ordner.

---

## 🎯 Features

### 1. 🏢 Gebäudeverwaltung

- Unbegrenzte Anzahl von Gebäuden verwalten
- Detaillierte Gebäudeinformationen (Adresse, Baujahr, Einheiten)
- Farbcodierung für bessere Übersicht
- Automatische Statistiken (Gesamtmiete, Belegungsquote)
- Verknüpfung mit Mietern

**Beispiel:**
```typescript
{
  name: "Mehrfamilienhaus",
  address: "Musterstraße 15, 12345 Stadt",
  units: 5,
  yearBuilt: 1995,
  color: "#3B82F6"
}
```

### 2. 👥 Mieterverwaltung (Erweitert)

**Neue detaillierte Mietstruktur:**
- 💵 **Kaltmiete** - Nettomiete ohne Nebenkosten
- 🔥 **Heizkosten-Vorauszahlung** - Monatliche Vorauszahlung
- 🏘️ **Betriebskosten-Vorauszahlung** - Nebenkosten
- 💰 **Warmmiete** - Automatisch berechnet (Kalt + BK + Heizung)

**Weitere Features:**
- Kontaktdaten (E-Mail, Telefon)
- Vertragsdaten (Einzug, Vertragsende, Kaution)
- IBAN für Nebenkostenerstattungen
- Zuordnung zu Gebäuden
- Filter nach Gebäude

**Automatische Berechnung:**
```
Warmmiete = Kaltmiete + Betriebskosten + Heizkosten
```

### 3. 💰 Vermieter-Finanzen

**Einnahmen:**
- Automatische Berechnung aller Mieteinnahmen
- Sonstige Einnahmen erfassen

**Ausgaben:**
- Grundsteuer
- Gebäudeversicherungen
- Reparaturen & Instandhaltung
- Verwaltungskosten
- Steuerberater-Honorar

**Steuervorauszahlungen:**
- 4 Quartale pro Jahr
- Fälligkeitsdaten (10. März, Juni, Sept., Dez.)
- Status-Tracking (bezahlt/offen)
- Aktenzeichen Finanzamt

**Live-Berechnungen:**
- Gesamteinnahmen (automatisch aus Mieter-Daten)
- Gesamtausgaben
- Nettoeinkommen
- Steuervorauszahlungen gesamt

### 4. 📊 Dashboard

- Übersichtskarten mit KPIs
- Anzahl Gebäude und Mieter
- Gesamtmiete (Jahreseinnahmen)
- Belegungsquote
- Gebäudeübersicht mit Details

### 5. 🔧 Reparatur-Management (In Entwicklung)

**Geplante Features:**
- Reparaturen erfassen und verwalten
- Zuordnung zu Gebäuden/Wohnungen
- Handwerker-Kontakte
- Rechnungsverwaltung
- Steuerlich absetzbar markieren
- Status-Tracking (geplant → in Arbeit → abgeschlossen)

---

## 🛠️ Technologie-Stack

### Frontend
- **React 18+** - UI Framework mit Hooks
- **TypeScript** - Type-Safe JavaScript
- **Vite** - Schneller Build-Tool & Dev-Server
- **Tailwind CSS** - Utility-First CSS Framework
- **React Router** - Client-side Routing
- **Lucide React** - Moderne Icon-Bibliothek

### State Management
- **Zustand** - Lightweight State Management
- **localStorage** - Browser-Persistierung (keine Backend-DB nötig)

### Code-Qualität
- **ESLint** - Linting
- **TypeScript Strict Mode** - Maximale Type-Safety

---

## 📁 Projektstruktur

```
House/
├── src/
│   ├── components/              # React-Komponenten
│   │   ├── Dashboard.tsx        # Hauptübersicht
│   │   ├── BuildingManagement.tsx  # Gebäudeverwaltung
│   │   ├── TenantManagement.tsx    # Mieterverwaltung
│   │   └── LandlordFinances.tsx    # Vermieter-Finanzen
│   │
│   ├── store/                   # State Management
│   │   └── appStore.ts          # Zustand Store
│   │
│   ├── types/                   # TypeScript Interfaces
│   │   └── tenant.ts            # Alle Datenmodelle
│   │
│   ├── data/                    # Helper & Utilities
│   │   └── mockData.ts
│   │
│   ├── App.tsx                  # Hauptkomponente + Routing
│   ├── main.tsx                 # Entry Point
│   └── index.css                # Global Styles
│
├── public/                      # Statische Assets
├── CODE_DOCUMENTATION.md        # Ausführliche Code-Doku
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 📚 Datenmodelle

### Building (Gebäude)
```typescript
interface Building {
  id: string;
  name: string;
  address: string;
  units: number;
  yearBuilt?: number;
  color: string;
  totalRent: number;        // Automatisch berechnet
  occupiedUnits: number;    // Automatisch berechnet
}
```

### Tenant (Mieter) - ERWEITERT
```typescript
interface Tenant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  apartment: string;
  buildingId: string;
  
  // Neue Mietstruktur
  coldRent: number;              // Kaltmiete
  operatingCostsAdvance: number; // Betriebskosten VZ
  heatingCostsAdvance: number;   // Heizkosten VZ
  warmRent: number;              // Automatisch berechnet
  
  securityDeposit: number;
  moveInDate: string;
  leaseEndDate: string;
  active: boolean;
  iban?: string;
  bankName?: string;
}
```

### LandlordFinances (Vermieter-Finanzen)
```typescript
interface LandlordFinances {
  id: string;
  year: number;
  totalRentalIncome: number;    // Automatisch berechnet
  otherIncome: number;
  propertyTaxTotal: number;
  insuranceTotal: number;
  repairTotal: number;
  administrationCosts: number;
  taxAdvisorFee: number;
  taxAdvancePayments: TaxAdvancePayment[];
  totalExpenses: number;        // Automatisch berechnet
  netIncome: number;            // Automatisch berechnet
}
```

Vollständige Dokumentation: [CODE_DOCUMENTATION.md](./CODE_DOCUMENTATION.md)

---

## 💡 Verwendung

### 1. Gebäude anlegen

1. Navigiere zu **"Gebäude"**
2. Klicke auf **"Gebäude hinzufügen"**
3. Fülle die Felder aus:
   - Name (z.B. "Haus 15")
   - Adresse
   - Anzahl Einheiten
   - Optional: Baujahr, Beschreibung
   - Wähle eine Farbe
4. Speichern

### 2. Mieter hinzufügen

1. Navigiere zu **"Mieter"**
2. Klicke auf **"Mieter hinzufügen"**
3. Fülle die Pflichtfelder aus:
   - Vor- und Nachname
   - Gebäude auswählen
   - Wohnung/Einheit
4. Mietstruktur eingeben:
   - **Kaltmiete** (z.B. 500 €)
   - **Betriebskosten VZ** (z.B. 100 €)
   - **Heizkosten VZ** (z.B. 50 €)
   - Warmmiete wird automatisch berechnet (650 €)
5. Optional: Kontaktdaten, IBAN
6. Speichern

Die Warmmiete und alle Statistiken werden automatisch aktualisiert!

### 3. Vermieter-Finanzen verwalten

1. Navigiere zu **"Vermieter-Finanzen"**
2. Wähle das Jahr
3. Einnahmen werden automatisch berechnet
4. Trage Ausgaben ein:
   - Grundsteuer
   - Versicherungen
   - Reparaturen
   - Steuerberater
5. Erfasse Steuervorauszahlungen pro Quartal
6. Nettoeinkommen wird automatisch berechnet

---

## 🔒 Datenspeicherung

Alle Daten werden **lokal im Browser** gespeichert:
- ✅ Keine Cloud/Server erforderlich
- ✅ Volle Datenkontrolle
- ✅ DSGVO-konform (Daten verlassen nie den Browser)
- ✅ Kostenlos (keine Hosting-Gebühren)

**Hinweis:** Daten bleiben nur auf diesem Gerät/Browser gespeichert. Für Backups oder Synchronisation empfehlen wir:
- Browser-Daten regelmäßig sichern
- Oder Export-Funktion nutzen (geplant)

---

## 🚧 Roadmap

### Phase 1 (✅ Abgeschlossen)
- [x] Gebäudeverwaltung
- [x] Mieterverwaltung mit detaillierter Mietstruktur
- [x] Vermieter-Finanzen & Steuervorauszahlungen
- [x] Dashboard mit Statistiken
- [x] localStorage Persistierung
- [x] Code-Dokumentation

### Phase 2 (🚧 In Entwicklung)
- [ ] Reparatur-Management UI
- [ ] Dokumenten-Upload
- [ ] BuildingExpense Store-Integration
- [ ] Nebenkostenabrechnung erstellen

### Phase 3 (📋 Geplant)
- [ ] PDF-Export (Nebenkostenabrechnung, Steuerübersicht)
- [ ] Backup/Restore Funktion
- [ ] Multi-Language Support (DE, EN)
- [ ] Dunkler Modus
- [ ] Kalenderintegration für Termine
- [ ] E-Mail-Benachrichtigungen (Mietzahlungen, Fälligkeiten)

---

## 🤝 Contributing

Contributions sind willkommen! Bitte beachten Sie:

1. Fork das Repository
2. Erstelle einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committe deine Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffne einen Pull Request

---

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

---

## 👨‍💻 Autor

**rockindaddy68**
- GitHub: [@rockindaddy68](https://github.com/rockindaddy68)

---

## 🙏 Danksagungen

- React & TypeScript Community
- Tailwind CSS Team
- Zustand State Management
- Lucide Icons

---

## 📞 Support

Bei Fragen oder Problemen:
- 🐛 [Issue erstellen](https://github.com/rockindaddy68/House/issues)
- 📧 Kontakt über GitHub

---

## 📸 Screenshots

### Dashboard
Hauptübersicht mit Statistiken und Gebäudekarten

### Mieterverwaltung
Detaillierte Mieter-Ansicht mit automatischer Warmmiete-Berechnung

### Vermieter-Finanzen
Übersicht aller Einnahmen, Ausgaben und Steuervorauszahlungen

*(Screenshots werden noch hinzugefügt)*

---

**Entwickelt mit ❤️ für Vermieter und Hausverwaltungen**

⭐ Wenn Ihnen dieses Projekt gefällt, geben Sie ihm einen Stern auf GitHub!
