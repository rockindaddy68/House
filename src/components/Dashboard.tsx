import { Users, Receipt, Wrench, BarChart3, Building2 } from 'lucide-react'
import { useAppStore } from '../store/appStore';

const Dashboard = () => {
  const { buildings, tenants } = useAppStore();
  
  const totalTenants = tenants.filter(tenant => tenant.active).length;
  const totalRent = tenants.reduce((sum, tenant) => sum + (tenant.active ? tenant.rentAmount : 0), 0);
  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Gebäude Übersicht */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Immobilien Portfolio</h2>
        {buildings.length === 0 ? (
          <div className="bg-white overflow-hidden shadow rounded-lg p-6 mb-8">
            <div className="text-center">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Keine Gebäude vorhanden</h3>
              <p className="text-gray-600 mb-4">Fügen Sie Ihr erstes Gebäude hinzu, um zu beginnen.</p>
              <a
                href="/gebaeude"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                <Building2 className="h-5 w-5 mr-2" />
                Erstes Gebäude hinzufügen
              </a>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {buildings.map((building) => {
              const buildingTenants = tenants.filter(t => t.buildingId === building.id && t.active);
              const buildingRent = buildingTenants.reduce((sum, t) => sum + t.rentAmount, 0);
              const colorClass = building.color === 'blue' ? 'text-blue-600' : 
                                 building.color === 'green' ? 'text-green-600' :
                                 building.color === 'purple' ? 'text-purple-600' :
                                 building.color === 'red' ? 'text-red-600' : 'text-blue-600';
              
              return (
                <div key={building.id} className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Building2 className={`h-8 w-8 ${colorClass}`} />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">{building.name}</h3>
                        <p className="text-sm text-gray-600">
                          {buildingTenants.length}/{building.units} Einheiten belegt
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Monatl. Mieteinnahmen: {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(buildingRent)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Aktive Mieter</dt>
                  <dd className="text-lg font-medium text-gray-900">{totalTenants} Mieter</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Receipt className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monatl. Mieteinnahmen</dt>
                  <dd className="text-lg font-medium text-gray-900">{new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(totalRent)}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Wartungsaufträge</dt>
                  <dd className="text-lg font-medium text-gray-900">3</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monatseinkommen</dt>
                  <dd className="text-lg font-medium text-gray-900">€10.230</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Schnellzugriff</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Users className="h-4 w-4 mr-2" />
              Neuer Mieter
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Receipt className="h-4 w-4 mr-2" />
              Rechnung erfassen
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              <Wrench className="h-4 w-4 mr-2" />
              Wartung planen
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;