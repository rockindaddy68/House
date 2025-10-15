/**
 * ==============================================
 * VERMIETER-FINANZEN KOMPONENTE
 * ==============================================
 * Zeigt eine Übersicht aller Einnahmen, Ausgaben und Steuervorauszahlungen
 * - Automatische Berechnung der Mieteinnahmen aus Mieter-Daten
 * - Erfassung von Ausgaben (Grundsteuer, Versicherung, etc.)
 * - Verwaltung der vierteljährlichen Steuervorauszahlungen
 * - Berechnung des Nettoeinkommens
 */

import { DollarSign, TrendingUp, TrendingDown, FileText, Calculator, Building2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';

const LandlordFinances = () => {
  // Hole Mieter und Gebäude aus dem globalen Store
  const { tenants, buildings } = useAppStore();
  
  // Aktuelles Jahr ermitteln
  const currentYear = new Date().getFullYear();
  
  // State für ausgewähltes Jahr (ermöglicht Jahresvergleiche)
  const [selectedYear, setSelectedYear] = useState(currentYear);

  /**
   * BERECHNUNG DER MIETEINNAHMEN
   * - Filtert nur aktive Mieter
   * - Multipliziert Warmmiete mit 12 (Jahreseinnahmen)
   * - Fallback auf rentAmount falls warmRent nicht gesetzt
   */
  const totalRentalIncome = tenants
    .filter(t => t.active)  // Nur aktive Mieter
    .reduce((sum, t) => sum + (t.warmRent || t.rentAmount || 0) * 12, 0);  // Jahresmiete

  /**
   * AUSGABEN STATE
   * Später werden diese Daten aus dem Store geladen und persistent gespeichert
   * Aktuell: Lokaler State für Demonstration
   */
  const [expenses, setExpenses] = useState({
    propertyTax: 0,      // Grundsteuer
    insurance: 0,        // Versicherungen
    repairs: 0,          // Reparaturen
    administration: 0,   // Verwaltungskosten
    taxAdvisor: 0,       // Steuerberater
    depreciation: 0,     // AfA (Absetzung für Abnutzung)
    financingCosts: 0,   // Kreditzinsen
  });

  /**
   * EIGENE EINKÜNFTE (für gemeinsame Veranlagung)
   * Diese werden mit den Mieteinnahmen zusammen versteuert
   */
  const [personalFinances, setPersonalFinances] = useState({
    personalIncome: 0,        // Gehalt, Rente, etc.
    capitalIncome: 0,         // Zinsen, Dividenden
    otherPersonalIncome: 0,   // Sonstige Einkünfte
    otherRentalIncome: 0,     // Sonstige Mieteinnahmen (Stellplätze, Garagen, etc.)
  });

  /**
   * STEUERVORAUSZAHLUNGEN
   * 4 Quartale mit jeweiligem Fälligkeitsdatum
   * Q1: 10. März, Q2: 10. Juni, Q3: 10. September, Q4: 10. Dezember
   */
  const [taxAdvancePayments, setTaxAdvancePayments] = useState([
    { quarter: 1, amount: 0, dueDate: `${selectedYear}-03-10`, paid: false },
    { quarter: 2, amount: 0, dueDate: `${selectedYear}-06-10`, paid: false },
    { quarter: 3, amount: 0, dueDate: `${selectedYear}-09-10`, paid: false },
    { quarter: 4, amount: 0, dueDate: `${selectedYear}-12-10`, paid: false },
  ]);

  // BERECHNUNGEN
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);  // Summe aller Ausgaben
  const netRentalIncome = totalRentalIncome + personalFinances.otherRentalIncome - totalExpenses;  // Nettoeinkommen aus Vermietung
  const totalPersonalIncome = personalFinances.personalIncome + personalFinances.capitalIncome + personalFinances.otherPersonalIncome;  // Summe persönliche Einkünfte
  const totalIncome = totalPersonalIncome + netRentalIncome;  // Gesamteinkommen (für Steuersatz)
  const totalTaxAdvance = taxAdvancePayments.reduce((sum, payment) => sum + payment.amount, 0);  // Summe Steuervorauszahlungen
  
  /**
   * GESCHÄTZTER STEUERSATZ (vereinfacht)
   * Basiert auf dem Gesamteinkommen und gibt eine grobe Orientierung
   * In der Realität hängt der Steuersatz von vielen weiteren Faktoren ab
   */
  const estimatedTaxRate = totalIncome <= 10000 ? 0 :
                          totalIncome <= 28000 ? 14 :
                          totalIncome <= 55000 ? 24 :
                          totalIncome <= 80000 ? 32 :
                          totalIncome <= 150000 ? 38 : 42;

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ===== HEADER BEREICH ===== */}
        <div className="mb-8">
          <div className="flex items-center justify-between">

            <div className="flex items-center">
              <Calculator className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Vermieter-Finanzen</h1>
                <p className="mt-2 text-gray-600">Steuervorauszahlungen, Ausgaben und Jahresübersicht</p>
              </div>
            </div>
            <div>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {/* Zeige Jahre von 5 Jahre zurück bis 2 Jahre in die Zukunft */}
                {Array.from({ length: 8 }, (_, i) => currentYear - 5 + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Übersicht Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Mieteinnahmen */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mieteinnahmen (Jahr)</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  €{(totalRentalIncome + personalFinances.otherRentalIncome).toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </div>

          {/* Ausgaben */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ausgaben (Jahr)</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  €{totalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </div>

          {/* Nettoeinkommen aus Vermietung */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Netto Vermietung</p>
                <p className={`text-2xl font-bold mt-2 ${netRentalIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{netRentalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Building2 className={`h-8 w-8 ${netRentalIncome >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </div>

          {/* Steuervorauszahlungen */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Steuervorauszahlungen</p>
                <p className="text-2xl font-bold text-blue-600 mt-2">
                  €{totalTaxAdvance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Neue Card: Gesamteinkommen & Steuersatz */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg shadow-lg p-6 mb-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-primary-100">Persönliche Einkünfte (Jahr)</p>
              <p className="text-2xl font-bold mt-2">
                €{totalPersonalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-primary-100 mt-1">Gehalt, Rente, Kapital, Sonstiges</p>
            </div>
            <div>
              <p className="text-sm text-primary-100">Gesamteinkommen (inkl. Vermietung)</p>
              <p className="text-3xl font-bold mt-2">
                €{totalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
              </p>
              <p className="text-xs text-primary-100 mt-1">Grundlage für Steuerberechnung</p>
            </div>
            <div>
              <p className="text-sm text-primary-100">Geschätzter Steuersatz</p>
              <p className="text-3xl font-bold mt-2">
                {estimatedTaxRate}%
              </p>
              <p className="text-xs text-primary-100 mt-1">Vereinfachte Schätzung (Grundtarif)</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Eigene Einkünfte */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <DollarSign className="h-6 w-6 text-primary-600 mr-2" />
                Eigene Einkünfte (Gemeinsame Veranlagung)
              </h2>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <strong>Wichtig:</strong> Diese Einkünfte werden zusammen mit den Mieteinnahmen versteuert 
                    und bestimmen Ihren Steuersatz (Progression).
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bruttoeinkommen (Gehalt, Rente, etc.) pro Jahr
                </label>
                <input
                  type="number"
                  value={personalFinances.personalIncome}
                  onChange={(e) => setPersonalFinances({...personalFinances, personalIncome: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="z.B. 45000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kapitalerträge (Zinsen, Dividenden, etc.)
                </label>
                <input
                  type="number"
                  value={personalFinances.capitalIncome}
                  onChange={(e) => setPersonalFinances({...personalFinances, capitalIncome: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="z.B. 2500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sonstige Einkünfte (selbstständig, Gewerbe, etc.)
                </label>
                <input
                  type="number"
                  value={personalFinances.otherPersonalIncome}
                  onChange={(e) => setPersonalFinances({...personalFinances, otherPersonalIncome: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="z.B. 12000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sonstige Mieteinnahmen (Stellplätze, Garagen, etc.)
                </label>
                <input
                  type="number"
                  value={personalFinances.otherRentalIncome}
                  onChange={(e) => setPersonalFinances({...personalFinances, otherRentalIncome: Number(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="z.B. 1200 (= 100€/Monat × 12)"
                />
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Summe persönliche Einkünfte:</span>
                  <span className="font-semibold text-gray-900">
                    €{totalPersonalIncome.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Steuervorauszahlungen */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Steuervorauszahlungen {selectedYear}</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {taxAdvancePayments.map((payment, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">Q{payment.quarter} - {selectedYear}</p>
                      <p className="text-sm text-gray-600">Fällig am: {new Date(payment.dueDate).toLocaleDateString('de-DE')}</p>
                    </div>
                    <div className="text-right">
                      <input
                        type="number"
                        value={payment.amount}
                        onChange={(e) => {
                          const newPayments = [...taxAdvancePayments];
                          newPayments[index].amount = Number(e.target.value);
                          setTaxAdvancePayments(newPayments);
                        }}
                        className="w-32 px-3 py-1 border border-gray-300 rounded text-right"
                        placeholder="€ 0.00"
                        step="0.01"
                      />
                      <div className="mt-2">
                        <label className="inline-flex items-center">
                          <input
                            type="checkbox"
                            checked={payment.paid}
                            onChange={(e) => {
                              const newPayments = [...taxAdvancePayments];
                              newPayments[index].paid = e.target.checked;
                              setTaxAdvancePayments(newPayments);
                            }}
                            className="form-checkbox h-4 w-4 text-primary-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">Bezahlt</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Ausgaben Details */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ausgaben {selectedYear}</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Grundsteuer</label>
                  <input
                    type="number"
                    value={expenses.propertyTax}
                    onChange={(e) => setExpenses({...expenses, propertyTax: Number(e.target.value)})}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-right"
                    placeholder="€ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Versicherungen</label>
                  <input
                    type="number"
                    value={expenses.insurance}
                    onChange={(e) => setExpenses({...expenses, insurance: Number(e.target.value)})}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-right"
                    placeholder="€ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Reparaturen</label>
                  <input
                    type="number"
                    value={expenses.repairs}
                    onChange={(e) => setExpenses({...expenses, repairs: Number(e.target.value)})}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-right"
                    placeholder="€ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Verwaltung</label>
                  <input
                    type="number"
                    value={expenses.administration}
                    onChange={(e) => setExpenses({...expenses, administration: Number(e.target.value)})}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-right"
                    placeholder="€ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">AfA (Abschreibung)</label>
                  <input
                    type="number"
                    value={expenses.depreciation}
                    onChange={(e) => setExpenses({...expenses, depreciation: Number(e.target.value)})}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-right"
                    placeholder="€ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-gray-700">Kreditzinsen</label>
                  <input
                    type="number"
                    value={expenses.financingCosts}
                    onChange={(e) => setExpenses({...expenses, financingCosts: Number(e.target.value)})}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-right"
                    placeholder="€ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <label className="text-gray-700 font-semibold">Steuerberater</label>
                  <input
                    type="number"
                    value={expenses.taxAdvisor}
                    onChange={(e) => setExpenses({...expenses, taxAdvisor: Number(e.target.value)})}
                    className="w-40 px-3 py-2 border border-gray-300 rounded text-right"
                    placeholder="€ 0.00"
                    step="0.01"
                  />
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="text-lg font-bold text-gray-900">Summe Ausgaben</span>
                  <span className="text-lg font-bold text-gray-900">
                    €{totalExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gebäude-Fixkosten Hinweis */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <AlertCircle className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h4 className="text-lg font-semibold text-blue-900 mb-2">Gebäude-spezifische Kosten</h4>
              <p className="text-blue-800 mb-4">
                Grundsteuer, Straßenreinigung und andere gebäudespezifische Kosten können künftig 
                direkt bei den Gebäuden erfasst werden.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {buildings.map(building => (
                  <div key={building.id} className="bg-white border border-blue-200 rounded p-4">
                    <div className="flex items-center mb-2">
                      <Building2 className="h-5 w-5 text-gray-600 mr-2" />
                      <h5 className="font-semibold text-gray-900">{building.name}</h5>
                    </div>
                    <p className="text-sm text-gray-600">{building.address}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {building.units} Einheiten • {building.occupiedUnits} belegt
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandlordFinances;
