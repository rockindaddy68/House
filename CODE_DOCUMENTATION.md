# House - Code-Dokumentation

## 📁 Projektstruktur

```
House/
├── src/
│   ├── components/          # React-Komponenten
│   │   ├── Dashboard.tsx           # Hauptübersicht mit Statistiken
│   │   ├── BuildingManagement.tsx  # Gebäudeverwaltung
│   │   ├── TenantManagement.tsx    # Mieterverwaltung
│   │   └── LandlordFinances.tsx    # Vermieter-Finanzen
│   ├── store/              # State Management
│   │   └── appStore.ts            # Zustand Store mit localStorage
│   ├── types/              # TypeScript Interfaces
│   │   └── tenant.ts              # Alle Datenmodelle
│   ├── data/               # Daten & Utilities
│   │   └── mockData.ts            # Helper-Funktionen
│   ├── App.tsx             # Hauptkomponente mit Routing
│   └── main.tsx            # Entry Point
├── public/                 # Statische Assets
└── package.json           # Dependencies
```

---

## 🏗️ Datenmodelle (src/types/tenant.ts)

### 1. **Building** - Gebäude
Repräsentiert ein Gebäude/Haus mit allen wichtigen Informationen.

**Wichtigste Felder:**
- `id` - Eindeutige ID
- `name` - Gebäudename (z.B. "Haus 15")
- `address` - Vollständige Adresse
- `units` - Anzahl Wohneinheiten
- `totalRent` - Automatisch berechnete Gesamtmiete
- `occupiedUnits` - Automatisch berechnete belegte Einheiten

### 2. **Tenant** - Mieter (ERWEITERT)
Enthält alle Mieterinformationen inkl. detaillierter Mietstruktur.

**Neue Felder:**
- `coldRent` - Kaltmiete (Nettomiete ohne Nebenkosten)
- `operatingCostsAdvance` - Betriebskosten-Vorauszahlung
- `heatingCostsAdvance` - Heizkosten-Vorauszahlung
- `warmRent` - Warmmiete (wird automatisch berechnet)
- `iban` / `bankName` - Für Nebenkostenerstattungen

**Automatische Berechnung:**
```typescript
warmRent = coldRent + operatingCostsAdvance + heatingCostsAdvance
```

### 3. **BuildingExpense** - Gebäude-Fixkosten
Laufende Kosten pro Gebäude (Grundsteuer, Versicherung, etc.)

**Kategorien:**
- `property-tax` - Grundsteuer
- `street-cleaning` - Straßenreinigung
- `building-insurance` - Gebäudeversicherung
- `janitor` - Hausmeisterdienst
- `other` - Sonstige

**Frequenzen:**
- `yearly` - jährlich
- `quarterly` - vierteljährlich
- `monthly` - monatlich

### 4. **Repair** - Reparaturen
Verwaltung von Reparaturen mit Zuordnung zu Gebäuden/Wohnungen.

**Kategorien:**
- `plumbing` - Sanitär
- `electrical` - Elektrik
- `heating` - Heizung
- `windows` - Fenster
- `roof` - Dach
- `painting` - Malerarbeiten
- `other` - Sonstige

**Status-Workflow:**
1. `planned` - Geplant
2. `in-progress` - In Arbeit
3. `completed` - Abgeschlossen
4. `invoiced` - Abgerechnet

### 5. **LandlordFinances** - Vermieter-Finanzen
Jahresübersicht aller Einnahmen, Ausgaben und Steuern.

**Einnahmen:**
- `totalRentalIncome` - Automatisch aus Mieter-Daten berechnet
- `otherIncome` - Sonstige Einnahmen

**Ausgaben:**
- `propertyTaxTotal` - Grundsteuer
- `insuranceTotal` - Versicherungen
- `repairTotal` - Reparaturen
- `administrationCosts` - Verwaltung
- `taxAdvisorFee` - Steuerberater

**Berechnungen:**
```typescript
totalExpenses = propertyTaxTotal + insuranceTotal + repairTotal + administrationCosts + taxAdvisorFee
netIncome = totalRentalIncome + otherIncome - totalExpenses
```

### 6. **TaxAdvancePayment** - Steuervorauszahlungen
Vierteljährliche Steuervorauszahlungen ans Finanzamt.

**Quartale & Fälligkeiten:**
- Q1: 10. März
- Q2: 10. Juni
- Q3: 10. September
- Q4: 10. Dezember

---

## 🔄 State Management (src/store/appStore.ts)

### Zustand Store mit localStorage Persistierung

**Vorteile:**
- ✅ Globaler State für die gesamte App
- ✅ Automatische Persistierung im Browser
- ✅ Daten bleiben nach Neustart erhalten
- ✅ Keine Backend-Datenbank erforderlich

### Verfügbare Aktionen:

#### Gebäude:
```typescript
addBuilding(building: Building)        // Neues Gebäude hinzufügen
updateBuilding(id, updates)            // Gebäude aktualisieren
deleteBuilding(id)                     // Gebäude löschen (inkl. Mieter!)
```

#### Mieter:
```typescript
addTenant(tenant: Tenant)              // Neuen Mieter hinzufügen
updateTenant(id, updates)              // Mieter aktualisieren
deleteTenant(id)                       // Mieter löschen
```

#### Helper-Funktionen:
```typescript
getBuildingTenants(buildingId)         // Alle Mieter eines Gebäudes
calculateBuildingStats(buildingId)     // Statistiken berechnen
```

### Verwendung in Komponenten:
```typescript
import { useAppStore } from '../store/appStore';

function MyComponent() {
  // Daten aus Store holen
  const { buildings, tenants, addBuilding } = useAppStore();
  
  // Neues Gebäude hinzufügen
  const handleAdd = () => {
    addBuilding({
      id: Date.now().toString(),
      name: "Haus 15",
      address: "Musterstraße 15",
      // ...
    });
  };
}
```

---

## 📦 Komponenten-Übersicht

### 1. **Dashboard** (Dashboard.tsx)
**Zweck:** Hauptübersicht mit Statistiken und KPIs

**Features:**
- Anzahl Gebäude/Mieter
- Gesamtmiete
- Belegungsrate
- Gebäudekarten mit Details

**Berechnungen:**
- Automatische Aggregation aus Store-Daten
- Live-Updates bei Änderungen

### 2. **BuildingManagement** (BuildingManagement.tsx)
**Zweck:** Verwaltung aller Gebäude

**Features:**
- ➕ Neues Gebäude hinzufügen
- ✏️ Gebäude bearbeiten
- 🗑️ Gebäude löschen
- 📊 Statistiken pro Gebäude
- 🎨 Farbcodierung

**Formular-Felder:**
- Name, Adresse
- Anzahl Einheiten
- Baujahr (optional)
- Beschreibung (optional)
- Farbe (für UI)

### 3. **TenantManagement** (TenantManagement.tsx)
**Zweck:** Verwaltung aller Mieter mit detaillierter Mietstruktur

**Features:**
- ➕ Neuen Mieter hinzufügen
- ✏️ Mieter bearbeiten
- 🏢 Filterung nach Gebäude
- 📋 Detailansicht pro Mieter
- 💶 Automatische Warmmiete-Berechnung

**Formular-Felder (NEU):**
- Persönliche Daten (Name, Kontakt)
- **Kaltmiete** - Nettomiete
- **Betriebskosten VZ** - monatlich
- **Heizkosten VZ** - monatlich
- **Warmmiete** - automatisch berechnet
- Kaution
- Vertragszeiten
- IBAN (für Erstattungen)

**Live-Berechnung:**
```typescript
warmRent = coldRent + operatingCostsAdvance + heatingCostsAdvance
```

### 4. **LandlordFinances** (LandlordFinances.tsx)
**Zweck:** Vermieter-Finanzübersicht und Steuerverwaltung

**Features:**
- 📊 Übersichtskarten (Einnahmen/Ausgaben/Netto)
- 💰 Steuervorauszahlungen (4 Quartale)
- 📝 Ausgaben-Management
- 🏢 Gebäudeübersicht
- 📅 Jahresauswahl

**Ausgaben-Kategorien:**
- Grundsteuer
- Versicherungen
- Reparaturen
- Verwaltung
- Steuerberater

**Automatische Berechnungen:**
```typescript
// Mieteinnahmen (alle aktiven Mieter)
totalRentalIncome = Σ(tenant.warmRent * 12)

// Gesamtausgaben
totalExpenses = propertyTax + insurance + repairs + admin + taxAdvisor

// Nettoeinkommen
netIncome = totalRentalIncome - totalExpenses
```

---

## 🔧 Technologie-Stack

### Frontend:
- **React 18+** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool & Dev Server
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons

### State Management:
- **Zustand** - Lightweight State Management
- **localStorage** - Browser-Persistierung

### Daten-Flow:
```
Komponente → useAppStore() → Zustand Store → localStorage
                ↓
            Automatisches Speichern bei jeder Änderung
                ↓
            Automatisches Laden beim App-Start
```

---

## 🚀 Wichtige Funktionen

### 1. Mieter zu Gebäude hinzufügen:
```typescript
// 1. Gebäude anlegen (falls nicht vorhanden)
addBuilding({ id: '1', name: 'Haus 15', ... });

// 2. Mieter hinzufügen mit Referenz
addTenant({
  id: '101',
  firstName: 'Max',
  lastName: 'Mustermann',
  buildingId: '1',  // ← Verknüpfung!
  coldRent: 500,
  operatingCostsAdvance: 100,
  heatingCostsAdvance: 50,
  warmRent: 650,  // Automatisch berechnet
  // ...
});
```

### 2. Warmmiete automatisch berechnen:
```typescript
const calculatedWarmRent = 
  (coldRent || 0) + 
  (operatingCostsAdvance || 0) + 
  (heatingCostsAdvance || 0);
```

### 3. Gebäude-Statistiken abrufen:
```typescript
const { calculateBuildingStats } = useAppStore();
const stats = calculateBuildingStats(buildingId);
// stats.totalRent
// stats.occupiedUnits
```

### 4. Daten filtern:
```typescript
// Nur aktive Mieter
const activeTenantsconst activeTenants = tenants.filter(t => t.active);

// Mieter eines bestimmten Gebäudes
const buildingTenants = tenants.filter(t => t.buildingId === '1');
```

---

## 💡 Best Practices

### 1. ID-Generierung:
```typescript
id: Date.now().toString()  // Einfache eindeutige ID
```

### 2. Optionale Felder:
```typescript
email: newTenant.email || ''  // Fallback auf leeren String
```

### 3. Partial Updates:
```typescript
updateTenant(id, { coldRent: 550 })  // Nur geänderte Felder
```

### 4. Daten-Validierung:
```typescript
if (firstName && lastName && buildingId && apartment) {
  // Pflichtfelder vorhanden → Speichern erlaubt
}
```

---

## 🔮 Geplante Erweiterungen

### Phase 1: Store-Integration ✅
- [x] Gebäude-Verwaltung
- [x] Mieter-Verwaltung
- [x] localStorage Persistierung

### Phase 2: Erweiterte Datenmodelle ✅
- [x] Detaillierte Mietstruktur
- [x] Vermieter-Finanzen
- [x] Steuervorauszahlungen
- [x] Reparatur-Datenmodell

### Phase 3: Noch zu implementieren 🚧
- [ ] BuildingExpense Store-Integration
- [ ] Repair Store-Integration
- [ ] LandlordFinances Store-Integration
- [ ] Reparatur-Management UI
- [ ] Dokumenten-Upload
- [ ] Nebenkostenabrechnung erstellen
- [ ] PDF-Export für Steuerberater

---

## 📝 Entwickler-Hinweise

### Neue Komponente hinzufügen:
1. Datei in `src/components/` erstellen
2. In `App.tsx` importieren
3. Route hinzufügen
4. Menüpunkt in Navigation ergänzen

### Neue Datenstruktur hinzufügen:
1. Interface in `src/types/tenant.ts` definieren
2. Store in `appStore.ts` erweitern
3. CRUD-Operationen implementieren
4. UI-Komponente erstellen

### localStorage Debugging:
```javascript
// Browser Console
localStorage.getItem('app-storage')  // Alle gespeicherten Daten
localStorage.clear()                  // Alles löschen (Reset)
```

---

## 🆘 Troubleshooting

### Daten werden nicht gespeichert:
✅ Check: Ist Zustand Store korrekt eingebunden?
✅ Check: Wird die richtige Funktion aufgerufen? (`addTenant` vs `updateTenant`)
✅ Check: Browser-localStorage aktiviert?

### Komponente zeigt keine Daten:
✅ Check: `useAppStore()` Hook verwendet?
✅ Check: Daten im Store vorhanden? (React DevTools)
✅ Check: Filter aktiv? (z.B. `active === true`)

### TypeScript Errors:
✅ Check: Alle erforderlichen Felder gesetzt?
✅ Check: Korrekte Typen verwendet?
✅ Check: Interface aktualisiert nach Änderungen?

---

**Erstellt:** 14. Oktober 2025  
**Version:** 1.0  
**Letztes Update:** TypeScript Interfaces vollständig kommentiert
