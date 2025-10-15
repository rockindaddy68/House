# Migration Guide - Alte Mieter wiederherstellen

## Problem
Nach dem Update auf die neue Miet-Struktur (mit Kaltmiete, Betriebskosten, etc.) werden alte Mieter nicht mehr angezeigt, da die neuen Felder fehlen.

## Lösung 1: Automatische Migration (Empfohlen)

Öffne die Browser-Konsole (F12) und führe folgenden Code aus:

```javascript
// Hole die gespeicherten Daten
const storageData = JSON.parse(localStorage.getItem('house-app-storage'));

if (storageData && storageData.state && storageData.state.tenants) {
  // Migriere jeden Mieter
  storageData.state.tenants = storageData.state.tenants.map(tenant => {
    // Prüfe ob bereits im neuen Format
    if (tenant.coldRent !== undefined) {
      return tenant;
    }
    
    // Konvertiere ins neue Format
    const rentAmount = tenant.rentAmount || 0;
    
    return {
      ...tenant,
      coldRent: Math.round(rentAmount * 0.65),        // ~65% Kaltmiete
      operatingCostsAdvance: Math.round(rentAmount * 0.20),  // ~20% Betriebskosten
      heatingCostsAdvance: Math.round(rentAmount * 0.15),    // ~15% Heizkosten
      warmRent: rentAmount,
      iban: tenant.iban || '',
      bankName: tenant.bankName || ''
    };
  });
  
  // Speichere zurück
  localStorage.setItem('house-app-storage', JSON.stringify(storageData));
  
  console.log('✅ Migration erfolgreich!', storageData.state.tenants.length, 'Mieter migriert');
  console.log('🔄 Seite wird neu geladen...');
  
  // Lade Seite neu
  setTimeout(() => window.location.reload(), 1000);
} else {
  console.log('⚠️ Keine Mieter-Daten gefunden');
}
```

## Lösung 2: Daten manuell anpassen

Falls Sie die exakten Werte kennen, können Sie jeden Mieter einzeln bearbeiten:

1. Öffne **Mieter**
2. Wähle einen Mieter aus
3. Klicke auf **"Bearbeiten"**
4. Trage die Werte ein:
   - Kaltmiete
   - Betriebskosten VZ
   - Heizkosten VZ
5. Speichern

Die Warmmiete wird automatisch berechnet.

## Lösung 3: localStorage löschen (Neuanfang)

⚠️ **Achtung: Alle Daten gehen verloren!**

```javascript
localStorage.clear();
location.reload();
```

## Beispiel-Aufteilung

Wenn ein Mieter bisher **650€ Gesamtmiete** zahlte:

```
Kaltmiete:         420€ (~65%)
Betriebskosten:    130€ (~20%)
Heizkosten:         100€ (~15%)
------------------------
Warmmiete:         650€
```

Diese Aufteilung ist eine Schätzung und sollte an die tatsächlichen Werte angepasst werden.

## Support

Bei Problemen: Konsole öffnen (F12) und nach Fehlermeldungen suchen.
