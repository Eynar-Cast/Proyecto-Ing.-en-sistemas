import React, { useState } from 'react';
import { Eye, EyeOff, Lock, User, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { USER_TYPES } from '../../constants';
import Modal from '../Common/Modal';
import Button from '../Common/Button';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const { login } = useApp();
  const [loginMode, setLoginMode] = useState(USER_TYPES.ADMIN);
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.username, formData.password, loginMode);

    if (result.success) {
      onClose();
      setFormData({ username: '', password: '' });
    } else {
      setError(result.error || 'Usuario o contraseña incorrectos');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Acceso del Sistema"
      size="small"
    >
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 mb-6">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-indigo-600" />
          <p className="text-sm text-indigo-800 font-medium">
            Acceso solo para personal autorizado
          </p>
        </div>
      </div>

      {/* Selector de tipo de usuario */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setLoginMode(USER_TYPES.ADMIN)}
          className={`flex-1 py-3 rounded-lg font-medium transition ${
            loginMode === USER_TYPES.ADMIN
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Administrador
        </button>
        <button
          onClick={() => setLoginMode(USER_TYPES.EMPLOYEE)}
          className={`flex-1 py-3 rounded-lg font-medium transition ${
            loginMode === USER_TYPES.EMPLOYEE
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Empleado
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Usuario */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Usuario
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
              className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Credenciales de prueba */}
        {loginMode === USER_TYPES.ADMIN && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>Credenciales de prueba:</strong><br />
              Usuario: admin<br />
              Contraseña: admin123
            </p>
          </div>
        )}

        {/* Botones */}
        <div className="flex flex-col gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Ingresando...' : 'Ingresar al Sistema'}
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium"
          >
            Cancelar
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AdminLoginModal;