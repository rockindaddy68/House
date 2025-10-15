import { useState } from 'react';
import { Building2, Plus, Edit2, Trash2, MapPin, Calendar, Home, Users } from 'lucide-react';
import { Building } from '../types/tenant';
import { useAppStore } from '../store/appStore';

const BuildingManagement = () => {
  const { buildings, addBuilding, updateBuilding, deleteBuilding, calculateBuildingStats } = useAppStore();
  const [editingBuilding, setEditingBuilding] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Building>>({});
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

  // Edit-Funktionen
  const startEditing = (building: Building) => {
    setEditingBuilding(building.id);
    setEditForm({
      name: building.name,
      address: building.address,
      units: building.units,
      yearBuilt: building.yearBuilt,
      description: building.description,
      color: building.color
    });
  };

  const cancelEditing = () => {
    setEditingBuilding(null);
    setEditForm({});
  };

  const saveBuilding = () => {
    if (editingBuilding && editForm.name && editForm.address) {
      updateBuilding(editingBuilding, editForm);
      setEditingBuilding(null);
      setEditForm({});
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
            
            // Prüfen, ob dieses Gebäude bearbeitet wird
            const isEditing = editingBuilding === building.id;
            
            return (
              <div key={building.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                  {isEditing ? (
                    /* Bearbeitungsmodus */
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Gebäude bearbeiten</h3>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Gebäudename *</label>
                        <input
                          type="text"
                          value={editForm.name || ''}
                          onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                        <input
                          type="text"
                          value={editForm.address || ''}
                          onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Einheiten *</label>
                          <input
                            type="number"
                            value={editForm.units || 0}
                            onChange={(e) => setEditForm({...editForm, units: parseInt(e.target.value) || 0})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            min="1"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Baujahr</label>
                          <input
                            type="number"
                            value={editForm.yearBuilt || ''}
                            onChange={(e) => setEditForm({...editForm, yearBuilt: e.target.value ? parseInt(e.target.value) : undefined})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Farbe</label>
                        <select
                          value={editForm.color || 'blue'}
                          onChange={(e) => setEditForm({...editForm, color: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                          {colors.map(color => (
                            <option key={color.value} value={color.value}>{color.label}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Beschreibung</label>
                        <textarea
                          value={editForm.description || ''}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          rows={2}
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2 pt-2">
                        <button
                          onClick={cancelEditing}
                          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          Abbrechen
                        </button>
                        <button
                          onClick={saveBuilding}
                          className="px-3 py-1.5 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
                        >
                          Speichern
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Anzeigemodus */
                    <>
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
                            onClick={() => startEditing(building)}
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
                    </>
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