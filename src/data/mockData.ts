import { Tenant, UtilityPayment, Building } from '../types/tenant';

// Leere Arrays - Benutzer können eigene Daten hinzufügen
export const mockBuildings: Building[] = [];
export const mockTenants: Tenant[] = [];
export const mockUtilityPayments: UtilityPayment[] = [];

// Hilfsfunktion für automatische Gebäude-Berechnungen  
export const calculateBuildingStats = (buildings: Building[], tenants: Tenant[]): Building[] => {
  return buildings.map(building => {
    const buildingTenants = tenants.filter(tenant => tenant.buildingId === building.id && tenant.active);
    const totalRent = buildingTenants.reduce((sum, tenant) => sum + tenant.rentAmount, 0);
    const occupiedUnits = buildingTenants.length;
    
    return {
      ...building,
      totalRent,
      occupiedUnits
    };
  });
};
