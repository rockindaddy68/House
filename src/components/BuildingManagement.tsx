import { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, MapPin, Calendar, Home, Users } from 'lucide-react';
import { Building } from '../types/tenant';
import { useAppStore } from '../store/appStore';

const BuildingManagement = () => {
  const { buildings, tenants, addBuilding, deleteBuilding, getBuildingTenants, calculateBuildingStats } = useAppStore();
  const [editingBuilding, setEditingBuilding] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newBuilding, setNewBuilding] = useState<Partial<Building>>({
    name: '',
    address: '',
    units: 0,
    yearBuilt: new Date().getFullYear(),
    description: '',
    color: 'blue'
  });

  const colors = [
    { value: 'blue', label: 'Blau', class: 'text-blue-600' },
    { value: 'green', label: 'Grün', class: 'text-green-600' },
    { value: 'purple', label: 'Lila', class: 'text-purple-600' },
    { value: 'red', label: 'Rot', class: 'text-red-600' },
    { value: 'yellow', label: 'Gelb', class: 'text-yellow-600' },
    { value: 'indigo', label: 'Indigo', class: 'text-indigo-600' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const handleAddBuilding = () => {
    if (newBuilding.name && newBuilding.address) {
      const building: Building = {
        id: `building-${Date.now()}`,
        name: newBuilding.name,
        address: newBuilding.address,
        units: newBuilding.units || 0,
        yearBuilt: newBuilding.yearBuilt,
        description: newBuilding.description || '',
        color: newBuilding.color || 'blue',
        totalRent: 0,
        occupiedUnits: 0
      };
      
      addBuilding(building);
      setNewBuilding({
        name: '',
        address: '',
        units: 0,
        yearBuilt: new Date().getFullYear(),
        description: '',
        color: 'blue'
      });
      setShowAddForm(false);
    }
  };

  const handleDeleteBuilding = (buildingId: string) => {
    if (confirm('Sind Sie sicher, dass Sie dieses Gebäude löschen möchten?')) {
      deleteBuilding(buildingId);
    }
  };

  // Berechne die aktuellen Statistiken für jedes Gebäude
  const buildingsWithStats = buildings.map(building => {
    const stats = calculateBuildingStats(building.id);
    return {
      ...building,
      totalRent: stats.totalRent,
      occupiedUnits: stats.occupiedUnits
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Gebäudeverwaltung</h1>
                <p className="mt-2 text-gray-600">Verwalten Sie Ihre Liegenschaften und deren Daten</p>
              </div>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Neues Gebäude</span>
            </button>
          </div>
        </div>

        {/* Add Building Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow mb-8 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Neues Gebäude hinzufügen</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name/Bezeichnung</label>
                <input
                  type="text"
                  value={newBuilding.name}
                  onChange={(e) => setNewBuilding({...newBuilding, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="z.B. Hausnummer 15, Apartment Complex A"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={newBuilding.address}
                  onChange={(e) => setNewBuilding({...newBuilding, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Vollständige Adresse"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Anzahl Einheiten</label>
                <input
                  type="number"
                  value={newBuilding.units}
                  onChange={(e) => setNewBuilding({...newBuilding, units: parseInt(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Baujahr</label>
                <input
                  type="number"
                  value={newBuilding.yearBuilt}
                  onChange={(e) => setNewBuilding({...newBuilding, yearBuilt: parseInt(e.target.value) || new Date().getFullYear()})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Farbe (für Darstellung)</label>
                <select
                  value={newBuilding.color}
                  onChange={(e) => setNewBuilding({...newBuilding, color: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {colors.map(color => (
                    <option key={color.value} value={color.value}>{color.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Beschreibung</label>
                <textarea
                  value={newBuilding.description}
                  onChange={(e) => setNewBuilding({...newBuilding, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={3}
                  placeholder="Zusätzliche Informationen..."
                />
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Abbrechen
              </button>
              <button
                onClick={handleAddBuilding}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                Gebäude hinzufügen
              </button>
            </div>
          </div>
        )}

        {/* Buildings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {buildingsWithStats.map((building) => {
            const colorClass = colors.find(c => c.value === building.color)?.class || 'text-blue-600';
            
            return (
              <div key={building.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <Building2 className={`h-8 w-8 ${colorClass} mr-3`} />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
                        <p className="text-sm text-gray-500">{building.occupiedUnits}/{building.units} Einheiten belegt</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingBuilding(building.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBuilding(building.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      {building.address}
                    </div>
                    {building.yearBuilt && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        Baujahr: {building.yearBuilt}
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-600">
                      <Home className="h-4 w-4 mr-2" />
                      {building.units} Einheiten
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      Monatl. Einnahmen: {formatCurrency(building.totalRent)}
                    </div>
                  </div>
                  
                  {building.description && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <p className="text-sm text-gray-700">{building.description}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {buildings.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Gebäude vorhanden</h3>
            <p className="text-gray-600 mb-4">Fügen Sie Ihr erstes Gebäude hinzu, um zu beginnen.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
            >
              Erstes Gebäude hinzufügen
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingManagement;