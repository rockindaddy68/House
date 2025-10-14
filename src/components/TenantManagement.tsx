import { Users, Phone, Mail, Home, Euro, Calendar, AlertCircle, CheckCircle, Edit2, Save, X, Plus } from 'lucide-react';
import { Tenant, UtilityPayment } from '../types/tenant';
import { useState } from 'react';
import { useAppStore } from '../store/appStore';

const TenantManagement = () => {
  const { tenants, buildings, utilityPayments, updateTenant, addTenant } = useAppStore();
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all');
  const [editingTenant, setEditingTenant] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Tenant | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTenant, setNewTenant] = useState<Partial<Tenant>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    apartment: '',
    buildingId: buildings.length > 0 ? buildings[0].id : '',
    coldRent: 0,
    operatingCostsAdvance: 0,
    heatingCostsAdvance: 0,
    warmRent: 0,
    rentAmount: 0,
    securityDeposit: 0,
    moveInDate: '',
    leaseEndDate: '',
    active: true,
    iban: '',
    bankName: ''
  });
  
  const getTenantUtilities = (tenantId: string): UtilityPayment[] => {
    return utilityPayments.filter(payment => payment.tenantId === tenantId);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE');
  };

  const startEditing = (tenant: Tenant) => {
    setEditingTenant(tenant.id);
    setEditForm({ ...tenant });
  };

  const cancelEditing = () => {
    setEditingTenant(null);
    setEditForm(null);
  };

  const saveTenant = () => {
    if (editForm) {
      updateTenant(editForm.id, editForm);
      setSelectedTenant(editForm);
      setEditingTenant(null);
      setEditForm(null);
    }
  };

  const handleInputChange = (field: keyof Tenant, value: string | number | boolean) => {
    if (editForm) {
      setEditForm({ ...editForm, [field]: value });
    }
  };

  const getBuildingName = (buildingId: string): string => {
    const building = buildings.find(b => b.id === buildingId);
    return building?.name || 'Unbekanntes Gebäude';
  };

  const filteredTenants = selectedBuilding === 'all' 
    ? tenants 
    : tenants.filter(tenant => {
        const buildingName = getBuildingName(tenant.buildingId);
        return buildingName === selectedBuilding;
      });

  const handleAddTenant = () => {
    if (newTenant.firstName && newTenant.lastName && newTenant.buildingId && newTenant.apartment) {
      const calculatedWarmRent = (newTenant.coldRent || 0) + (newTenant.operatingCostsAdvance || 0) + (newTenant.heatingCostsAdvance || 0);
      
      const tenantToAdd: Tenant = {
        id: Date.now().toString(),
        firstName: newTenant.firstName,
        lastName: newTenant.lastName,
        email: newTenant.email || '',
        phone: newTenant.phone || '',
        apartment: newTenant.apartment,
        buildingId: newTenant.buildingId,
        coldRent: newTenant.coldRent || 0,
        operatingCostsAdvance: newTenant.operatingCostsAdvance || 0,
        heatingCostsAdvance: newTenant.heatingCostsAdvance || 0,
        warmRent: calculatedWarmRent,
        rentAmount: calculatedWarmRent,
        securityDeposit: newTenant.securityDeposit || 0,
        moveInDate: newTenant.moveInDate || '',
        leaseEndDate: newTenant.leaseEndDate || '',
        active: true,
        iban: newTenant.iban || '',
        bankName: newTenant.bankName || ''
      };
      
      addTenant(tenantToAdd);
      
      setNewTenant({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        apartment: '',
        buildingId: buildings.length > 0 ? buildings[0].id : '',
        coldRent: 0,
        operatingCostsAdvance: 0,
        heatingCostsAdvance: 0,
        warmRent: 0,
        rentAmount: 0,
        securityDeposit: 0,
        moveInDate: '',
        leaseEndDate: '',
        active: true,
        iban: '',
        bankName: ''
      });
      setShowAddForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-primary-600 mr-3" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Mieterverwaltung</h1>
                <p className="mt-2 text-gray-600">Übersicht aller Mieter mit Vorauszahlungen und Rückerstattungen</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Mieter hinzufügen
              </button>
              <select
                value={selectedBuilding}
                onChange={(e) => setSelectedBuilding(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">Alle Gebäude</option>
                {buildings.map(building => (
                  <option key={building.id} value={building.name}>{building.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Add Tenant Form */}
        {showAddForm && (
          <div className="mb-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Neuen Mieter hinzufügen</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Vorname *</label>
                  <input
                    type="text"
                    value={newTenant.firstName}
                    onChange={(e) => setNewTenant({...newTenant, firstName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nachname *</label>
                  <input
                    type="text"
                    value={newTenant.lastName}
                    onChange={(e) => setNewTenant({...newTenant, lastName: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gebäude *</label>
                  <select
                    value={newTenant.buildingId}
                    onChange={(e) => setNewTenant({...newTenant, buildingId: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Gebäude wählen</option>
                    {buildings.map((building) => (
                      <option key={building.id} value={building.id}>
                        {building.address} ({building.name})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Wohnung/Einheit *</label>
                  <input
                    type="text"
                    value={newTenant.apartment}
                    onChange={(e) => setNewTenant({...newTenant, apartment: e.target.value})}
                    placeholder="z.B. 1A, EG rechts, Whg. 3"
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">E-Mail</label>
                  <input
                    type="email"
                    value={newTenant.email}
                    onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Telefon</label>
                  <input
                    type="tel"
                    value={newTenant.phone}
                    onChange={(e) => setNewTenant({...newTenant, phone: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kaltmiete (€)</label>
                  <input
                    type="number"
                    value={newTenant.coldRent}
                    onChange={(e) => setNewTenant({...newTenant, coldRent: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Betriebskosten VZ (€)</label>
                  <input
                    type="number"
                    value={newTenant.operatingCostsAdvance}
                    onChange={(e) => setNewTenant({...newTenant, operatingCostsAdvance: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Heizkosten VZ (€)</label>
                  <input
                    type="number"
                    value={newTenant.heatingCostsAdvance}
                    onChange={(e) => setNewTenant({...newTenant, heatingCostsAdvance: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kaution (€)</label>
                  <input
                    type="number"
                    value={newTenant.securityDeposit}
                    onChange={(e) => setNewTenant({...newTenant, securityDeposit: Number(e.target.value)})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Einzugsdatum</label>
                  <input
                    type="date"
                    value={newTenant.moveInDate}
                    onChange={(e) => setNewTenant({...newTenant, moveInDate: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">IBAN (optional)</label>
                  <input
                    type="text"
                    value={newTenant.iban}
                    onChange={(e) => setNewTenant({...newTenant, iban: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    placeholder="DE89 3704 0044 0532 0130 00"
                  />
                </div>
              </div>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Warmmiete (berechnet): <span className="text-lg font-bold text-blue-600">
                    {formatCurrency((newTenant.coldRent || 0) + (newTenant.operatingCostsAdvance || 0) + (newTenant.heatingCostsAdvance || 0))}
                  </span>
                </p>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  onClick={handleAddTenant}
                  disabled={!newTenant.firstName || !newTenant.lastName || !newTenant.buildingId || !newTenant.apartment}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <Save className="w-4 h-4 inline mr-2" />
                  Mieter speichern
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                >
                  <X className="w-4 h-4 inline mr-2" />
                  Abbrechen
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mieter Liste */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">
                  Mieter ({filteredTenants.length})
                  {selectedBuilding !== 'all' && (
                    <span className="ml-2 text-sm font-normal text-gray-500">
                      - {selectedBuilding}
                    </span>
                  )}
                </h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {filteredTenants.map((tenant) => (
                  <div
                    key={tenant.id}
                    onClick={() => setSelectedTenant(tenant)}
                    className={`p-4 cursor-pointer transition-colors ${
                      selectedTenant?.id === tenant.id ? 'bg-primary-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {tenant.firstName} {tenant.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {tenant.apartment} • {getBuildingName(tenant.buildingId)}
                        </p>
                        <p className="text-sm font-medium text-primary-600 mt-1">
                          {formatCurrency(tenant.warmRent || tenant.rentAmount)} / Monat
                        </p>
                      </div>
                      {tenant.active ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mieter Details */}
          <div className="lg:col-span-2">
            {selectedTenant ? (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mieter-Details: {selectedTenant.firstName} {selectedTenant.lastName}
                  </h3>
                  {editingTenant === selectedTenant.id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={saveTenant}
                        className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                      >
                        <Save className="w-4 h-4 inline mr-1" />
                        Speichern
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Abbrechen
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => startEditing(selectedTenant)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                    >
                      <Edit2 className="w-4 h-4 inline mr-1" />
                      Bearbeiten
                    </button>
                  )}
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Kontaktdaten */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Mail className="w-4 h-4 mr-2" />
                        Kontaktdaten
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Mail className="w-4 h-4 mr-2 text-gray-400" />
                          {editingTenant === selectedTenant.id ? (
                            <input
                              type="email"
                              value={editForm?.email || ''}
                              onChange={(e) => handleInputChange('email', e.target.value)}
                              className="flex-1 px-2 py-1 border rounded"
                            />
                          ) : (
                            <span>{selectedTenant.email || 'Nicht angegeben'}</span>
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-4 h-4 mr-2 text-gray-400" />
                          {editingTenant === selectedTenant.id ? (
                            <input
                              type="tel"
                              value={editForm?.phone || ''}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              className="flex-1 px-2 py-1 border rounded"
                            />
                          ) : (
                            <span>{selectedTenant.phone || 'Nicht angegeben'}</span>
                          )}
                        </div>
                        <div className="flex items-center text-sm">
                          <Home className="w-4 h-4 mr-2 text-gray-400" />
                          <span>{selectedTenant.apartment}</span>
                        </div>
                      </div>
                    </div>

                    {/* Mietdaten */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Euro className="w-4 h-4 mr-2" />
                        Mietdaten
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kaltmiete:</span>
                          <span className="font-medium">{formatCurrency(selectedTenant.coldRent || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Betriebskosten VZ:</span>
                          <span className="font-medium">{formatCurrency(selectedTenant.operatingCostsAdvance || 0)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Heizkosten VZ:</span>
                          <span className="font-medium">{formatCurrency(selectedTenant.heatingCostsAdvance || 0)}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t">
                          <span className="text-gray-900 font-semibold">Warmmiete:</span>
                          <span className="font-bold text-primary-600">{formatCurrency(selectedTenant.warmRent || selectedTenant.rentAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Kaution:</span>
                          <span className="font-medium">{formatCurrency(selectedTenant.securityDeposit)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Vertragsdaten */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Vertragsdaten
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Einzugsdatum:</span>
                          <span>{selectedTenant.moveInDate ? formatDate(selectedTenant.moveInDate) : '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vertragsende:</span>
                          <span>{selectedTenant.leaseEndDate ? formatDate(selectedTenant.leaseEndDate) : 'Unbefristet'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <span className={selectedTenant.active ? 'text-green-600 font-medium' : 'text-gray-400'}>
                            {selectedTenant.active ? 'Aktiv' : 'Inaktiv'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bankdaten */}
                    {selectedTenant.iban && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Bankverbindung</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-600">IBAN:</span>
                            <p className="font-mono text-xs mt-1">{selectedTenant.iban}</p>
                          </div>
                          {selectedTenant.bankName && (
                            <div>
                              <span className="text-gray-600">Bank:</span>
                              <p className="mt-1">{selectedTenant.bankName}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-12">
                <div className="text-center text-gray-500">
                  <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <p>Wählen Sie einen Mieter aus der Liste, um Details anzuzeigen</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenantManagement;
