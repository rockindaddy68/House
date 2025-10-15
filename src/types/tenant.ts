/**
 * ==============================================
 * GEBÄUDE-DATENSTRUKTUR
 * ==============================================
 * Definiert alle Informationen zu einem Gebäude/Haus
 */
export interface Building {
  id: string;                    // Eindeutige ID des Gebäudes
  name: string;                  // Name (z.B. "Haus 15", "Mehrfamilienhaus")
  address: string;               // Vollständige Adresse
  units: number;                 // Anzahl der Wohneinheiten im Gebäude
  yearBuilt?: number;            // Baujahr (optional)
  description?: string;          // Zusätzliche Beschreibung (optional)
  color: string;                 // Farbe für UI-Darstellung (z.B. "#3B82F6")
  totalRent: number;             // Gesamtmiete aller Einheiten (wird automatisch berechnet)
  occupiedUnits: number;         // Anzahl vermieteter Einheiten (wird automatisch berechnet)
}

/**
 * ==============================================
 * MIETER-DATENSTRUKTUR (ERWEITERT)
 * ==============================================
 * Enthält alle Informationen zu einem Mieter inkl. detaillierter Mietstruktur
 */
export interface Tenant {
  // Basis-Informationen
  id: string;                    // Eindeutige Mieter-ID
  firstName: string;             // Vorname
  lastName: string;              // Nachname
  email: string;                 // E-Mail-Adresse
  phone: string;                 // Telefonnummer
  apartment: string;             // Wohnungsbezeichnung (z.B. "1A", "EG rechts", "Whg. 3")
  buildingId: string;            // Referenz auf das Gebäude (Building.id)
  
  // Detaillierte Mietstruktur
  coldRent: number;              // Kaltmiete (Nettomiete ohne Nebenkosten)
  operatingCostsAdvance: number; // Betriebskosten-Vorauszahlung (monatlich)
  heatingCostsAdvance: number;   // Heizkosten-Vorauszahlung (monatlich)
  warmRent: number;              // Warmmiete = coldRent + operatingCostsAdvance + heatingCostsAdvance
  
  // Vertrags- und Finanzdaten
  rentAmount: number;            // DEPRECATED: Alte Gesamtmiete (wird durch warmRent ersetzt)
  securityDeposit: number;       // Kaution
  moveInDate: string;            // Einzugsdatum (Format: YYYY-MM-DD)
  leaseEndDate: string;          // Vertragsende (Format: YYYY-MM-DD, leer = unbefristet)
  active: boolean;               // Status: true = aktiv, false = ausgezogen
  
  // Bankverbindung (für Nebenkostenerstattungen)
  iban?: string;                 // IBAN des Mieters (optional)
  bankName?: string;             // Name der Bank (optional)
}

/**
 * ==============================================
 * NEBENKOSTENZAHLUNGEN
 * ==============================================
 * Erfasst Vorauszahlungen und tatsächliche Kosten für Nebenkosten
 */
export interface UtilityPayment {
  id: string;                    // Eindeutige ID der Zahlung
  tenantId: string;              // Referenz auf den Mieter (Tenant.id)
  type: 'heating' | 'water';     // Art der Nebenkosten
  month: string;                 // Monat im Format YYYY-MM
  advancePayment: number;        // Vorauszahlung des Mieters
  actualConsumption?: number;    // Tatsächlicher Verbrauch (optional, z.B. kWh, m³)
  actualCost: number;            // Tatsächlich angefallene Kosten
  difference: number;            // Differenz: positiv = Erstattung an Mieter, negativ = Nachzahlung vom Mieter
  settled?: boolean;             // true = abgerechnet und ausgeglichen, false = offen
}

/**
 * ==============================================
 * NEBENKOSTENÜBERSICHT
 * ==============================================
 * Zusammenfassung aller Nebenkostenzahlungen pro Mieter
 */
export interface UtilitySummary {
  tenantId: string;              // Referenz auf den Mieter
  tenant: Tenant;                // Vollständige Mieter-Daten
  totalAdvancePayments: {        // Summe aller Vorauszahlungen
    heating: number;             // Heizung
    water: number;               // Wasser
  };
  totalActualCosts: {            // Summe der tatsächlichen Kosten
    heating: number;             // Heizung
    water: number;               // Wasser
  };
  totalRefunds: {                // Zu erstattende oder nachzufordernde Beträge
    heating: number;             // Heizung (positiv = Erstattung, negativ = Nachzahlung)
    water: number;               // Wasser (positiv = Erstattung, negativ = Nachzahlung)
  };
}

/**
 * ==============================================
 * GEBÄUDE-FIXKOSTEN
 * ==============================================
 * Laufende Kosten pro Gebäude (Grundsteuer, Versicherung, etc.)
 */
export interface BuildingExpense {
  id: string;                    // Eindeutige ID der Ausgabe
  buildingId: string;            // Referenz auf das Gebäude (Building.id)
  category: 'property-tax' | 'street-cleaning' | 'building-insurance' | 'janitor' | 'other';  // Kategorie der Ausgabe
  description: string;           // Beschreibung (z.B. "Grundsteuer 2025", "Gebäudeversicherung")
  amount: number;                // Betrag in Euro
  frequency: 'yearly' | 'quarterly' | 'monthly';  // Zahlungsrhythmus
  dueDate: string;               // Fälligkeitsdatum (Format: YYYY-MM-DD)
  paid: boolean;                 // Status: true = bezahlt, false = offen
  paidDate?: string;             // Datum der Zahlung (optional)
  receiptUrl?: string;           // Link zum hochgeladenen Beleg/Rechnung (optional)
}

/**
 * ==============================================
 * REPARATUREN & INSTANDHALTUNG
 * ==============================================
 * Erfassung von Reparaturen mit Zuordnung zu Gebäuden/Wohnungen
 */
export interface Repair {
  id: string;                    // Eindeutige ID der Reparatur
  buildingId: string;            // Referenz auf das Gebäude (Building.id)
  tenantId?: string;             // Optional: Referenz auf Mieter, falls wohnungsspezifisch
  apartment?: string;            // Wohnungsbezeichnung oder "Allgemein" für Gemeinschaftsflächen
  category: 'plumbing' | 'electrical' | 'heating' | 'windows' | 'roof' | 'painting' | 'other';  // Art der Reparatur
  description: string;           // Detaillierte Beschreibung des Problems/der Maßnahme
  contractor?: string;           // Name des Handwerkers/der Firma (optional)
  amount: number;                // Kosten in Euro
  date: string;                  // Datum der Reparatur (Format: YYYY-MM-DD)
  status: 'planned' | 'in-progress' | 'completed' | 'invoiced';  // Aktueller Status
  invoiceNumber?: string;        // Rechnungsnummer (optional)
  receiptUrl?: string;           // Link zur Rechnung (optional)
  deductible: boolean;           // Steuerlich absetzbar? true = ja, false = nein
  notes?: string;                // Zusätzliche Notizen (optional)
}

/**
 * ==============================================
 * VERMIETER-FINANZEN & STEUERN
 * ==============================================
 * Jahresübersicht aller Einnahmen, Ausgaben und Steuerdaten für den Vermieter
 */
export interface LandlordFinances {
  id: string;                    // Eindeutige ID des Finanz-Datensatzes
  year: number;                  // Steuerjahr (z.B. 2025)
  
  // === EIGENE EINKÜNFTE (für gemeinsame Veranlagung) ===
  personalIncome: number;        // Eigenes Bruttoeinkommen (Gehalt, Rente, etc.) pro Jahr
  capitalIncome: number;         // Einkünfte aus Kapitalvermögen (Zinsen, Dividenden, etc.)
  otherPersonalIncome: number;   // Sonstige Einkünfte (z.B. selbstständige Tätigkeit, Gewerbebetrieb)
  
  // === EINNAHMEN AUS VERMIETUNG ===
  totalRentalIncome: number;     // Summe aller Mieteinnahmen (automatisch aus Mieter-Daten berechnet)
  otherRentalIncome: number;     // Sonstige Mieteinnahmen (z.B. Nebenkostennachzahlungen, Stellplätze, Garagen)
  
  // === AUSGABEN (WERBUNGSKOSTEN) ===
  propertyTaxTotal: number;      // Grundsteuer gesamt (alle Gebäude)
  insuranceTotal: number;        // Versicherungen gesamt (Gebäude-, Haftpflicht-, etc.)
  repairTotal: number;           // Reparaturen & Instandhaltung gesamt
  administrationCosts: number;   // Verwaltungskosten (Hausverwaltung, Buchhaltung, etc.)
  depreciation: number;          // AfA (Absetzung für Abnutzung) - 2% oder 2,5% des Gebäudewerts pro Jahr
  financingCosts: number;        // Finanzierungskosten (Kreditzinsen, Bearbeitungsgebühren)
  
  // === STEUERBERATER ===
  taxAdvisorName?: string;       // Name des Steuerberaters (optional)
  taxAdvisorFee: number;         // Honorar Steuerberater in Euro
  taxAdvisorInvoiceDate?: string;  // Rechnungsdatum (Format: YYYY-MM-DD, optional)
  taxAdvisorReceiptUrl?: string;   // Link zur Rechnung (optional)
  
  // === STEUERVORAUSZAHLUNGEN ===
  taxAdvancePayments: TaxAdvancePayment[];  // Array mit 4 Quartals-Zahlungen
  
  // === BERECHNETE WERTE ===
  totalExpenses: number;         // Gesamtausgaben (automatisch berechnet)
  netRentalIncome: number;       // Nettoeinkommen aus Vermietung = totalRentalIncome + otherRentalIncome - totalExpenses
  totalIncome: number;           // Gesamteinkommen = personalIncome + capitalIncome + otherPersonalIncome + netRentalIncome
  estimatedTaxRate: number;      // Geschätzter Steuersatz basierend auf Gesamteinkommen (in Prozent)
}

/**
 * ==============================================
 * STEUERVORAUSZAHLUNGEN
 * ==============================================
 * Vierteljährliche Steuervorauszahlungen an das Finanzamt
 */
export interface TaxAdvancePayment {
  id: string;                    // Eindeutige ID der Zahlung
  landlordFinancesId: string;    // Referenz auf LandlordFinances.id
  quarter: 1 | 2 | 3 | 4;        // Quartal (Q1 = Jan-Mrz, Q2 = Apr-Jun, Q3 = Jul-Sep, Q4 = Okt-Dez)
  amount: number;                // Betrag der Vorauszahlung in Euro
  dueDate: string;               // Fälligkeitsdatum (Format: YYYY-MM-DD)
  paid: boolean;                 // Status: true = bezahlt, false = offen
  paidDate?: string;             // Datum der tatsächlichen Zahlung (optional)
  referenceNumber?: string;      // Aktenzeichen/Steuernummer des Finanzamts (optional)
}

/**
 * ==============================================
 * DOKUMENTE & BELEGE
 * ==============================================
 * Verwaltung von hochgeladenen Dokumenten, Rechnungen und Belegen
 */
export interface Document {
  id: string;                    // Eindeutige ID des Dokuments
  type: 'receipt' | 'invoice' | 'contract' | 'tax-document' | 'other';  // Dokumenttyp
  category: string;              // Kategorie (z.B. 'repair', 'tax', 'insurance', 'rent')
  relatedId?: string;            // Optional: Verknüpfung zu anderen Datensätzen (Repair.id, BuildingExpense.id, etc.)
  fileName: string;              // Dateiname (z.B. "rechnung_klempner_2025.pdf")
  fileUrl: string;               // URL/Pfad zur Datei (lokal oder Cloud-Storage)
  uploadDate: string;            // Upload-Datum (Format: YYYY-MM-DD)
  description?: string;          // Beschreibung des Dokuments (optional)
  tags?: string[];               // Tags für Suche/Filterung (optional, z.B. ["steuerlich", "2025"])
}
