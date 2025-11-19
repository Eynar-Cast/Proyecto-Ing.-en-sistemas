import React from 'react';
import { Users, Mail, Phone, MapPin } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatShortDate } from '../utils/helpers';

const ClientsView = () => {
  const { clients } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
        <p className="text-gray-600">Lista de clientes registrados</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3">
          <Users className="w-10 h-10 text-indigo-600" />
          <div>
            <p className="text-gray-500 text-sm">Total de Clientes</p>
            <p className="text-3xl font-bold text-gray-800">{clients.length}</p>
          </div>
        </div>
      </div>

      {/* Lista de clientes */}
      {clients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map(client => (
            <div key={client.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-800">{client.fullName}</h3>
                  <p className="text-sm text-gray-500">@{client.username}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{client.email}</span>
                </div>
                
                {client.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{client.phone}</span>
                  </div>
                )}

                {client.address && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <span className="flex-1">{client.address}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <p className="text-xs text-gray-500">
                  Registrado: {formatShortDate(client.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No hay clientes registrados</p>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
