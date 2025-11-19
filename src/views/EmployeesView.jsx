import React, { useState } from 'react';
import { Plus, Edit2, UserCheck, UserX, Users, Mail, Phone, IdCard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatShortDate } from '../utils/helpers';
import Button from '../components/Common/Button';
import EmployeeModal from '../components/Employee/EmployeeModal';

const EmployeesView = () => {
  const { employees, toggleEmployeeStatus } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingEmployee(null);
  };

  const handleToggleStatus = async (employeeId, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar';
    if (window.confirm(`¿Estás seguro de ${action} este empleado?`)) {
      const result = await toggleEmployeeStatus(employeeId, !currentStatus);
      if (result.success) {
        alert(`Empleado ${action}do correctamente`);
      } else {
        alert(result.error || 'Error al cambiar el estado del empleado');
      }
    }
  };

  // Estadísticas
  const activeEmployees = employees.filter(e => e.isActive).length;
  const inactiveEmployees = employees.filter(e => !e.isActive).length;
  const totalSales = employees.reduce((sum, e) => sum + (e.sales?.length || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Empleados</h2>
          <p className="text-gray-600">Administra el personal de tu tienda</p>
        </div>
        <Button 
          onClick={() => {
            setEditingEmployee(null);
            setShowModal(true);
          }}
          variant="primary" 
          icon={Plus}
        >
          Agregar Empleado
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Empleados</p>
              <p className="text-3xl font-bold text-gray-800">{employees.length}</p>
            </div>
            <Users className="w-10 h-10 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Activos</p>
              <p className="text-3xl font-bold text-green-600">{activeEmployees}</p>
            </div>
            <UserCheck className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Inactivos</p>
              <p className="text-3xl font-bold text-red-600">{inactiveEmployees}</p>
            </div>
            <UserX className="w-10 h-10 text-red-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ventas Totales</p>
              <p className="text-3xl font-bold text-purple-600">{totalSales}</p>
            </div>
            <IdCard className="w-10 h-10 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Lista de empleados */}
      {employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees.map(employee => (
            <div key={employee.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-full ${employee.isActive ? 'bg-green-100' : 'bg-red-100'}`}>
                    {employee.isActive ? (
                      <UserCheck className="w-6 h-6 text-green-600" />
                    ) : (
                      <UserX className="w-6 h-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{employee.fullName}</h3>
                    <p className="text-sm text-gray-500">@{employee.username}</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  employee.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {employee.isActive ? 'Activo' : 'Inactivo'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{employee.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t">
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div>
                    <p className="text-gray-500">Ventas</p>
                    <p className="font-semibold text-gray-800">{employee.sales?.length || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Desde</p>
                    <p className="font-semibold text-gray-800">{formatShortDate(employee.createdAt)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition flex items-center justify-center gap-2 text-sm font-medium"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleToggleStatus(employee.id, employee.isActive)}
                    className={`flex-1 px-3 py-2 rounded-lg transition flex items-center justify-center gap-2 text-sm font-medium ${
                      employee.isActive
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'bg-green-50 text-green-600 hover:bg-green-100'
                    }`}
                  >
                    {employee.isActive ? (
                      <>
                        <UserX className="w-4 h-4" />
                        Desactivar
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Activar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No hay empleados registrados</p>
          <p className="text-gray-500 text-sm mt-2">Agrega tu primer empleado para comenzar</p>
          <Button 
            onClick={() => setShowModal(true)}
            variant="primary" 
            icon={Plus}
            className="mt-4"
          >
            Agregar Empleado
          </Button>
        </div>
      )}

      {/* Modal */}
      <EmployeeModal
        isOpen={showModal}
        onClose={handleCloseModal}
        editingEmployee={editingEmployee}
      />
    </div>
  );
};

export default EmployeesView;