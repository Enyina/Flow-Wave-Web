import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../api/adminService';
import DarkModeToggle from './DarkModeToggle';
import Logo from './Logo';

const AdminManagement = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeTab, setActiveTab] = useState('admins');
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Form states
  const [createAdminForm, setCreateAdminForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    phoneNumber: ''
  });
  const [promoteForm, setPromoteForm] = useState({
    userId: '',
    reason: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setHasAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadAdmins();
    loadUsers();
  }, []);

  const loadAdmins = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAdmins();
      setAdmins(response || []);
    } catch (error) {
      console.error('Failed to load admins:', error);
      setError(error.message || 'Failed to load admins');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminService.getUsers(1, 100, { role: 'USER' });
      setUsers(response.users || response || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    try {
      await adminService.createAdmin(createAdminForm);
      setShowCreateModal(false);
      setCreateAdminForm({ email: '', firstName: '', lastName: '', phoneNumber: '' });
      loadAdmins();
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to create admin');
    }
  };

  const handlePromoteToAdmin = async (e) => {
    e.preventDefault();
    try {
      await adminService.promoteToAdmin(promoteForm.userId, promoteForm.reason);
      setShowPromoteModal(false);
      setPromoteForm({ userId: '', reason: '' });
      loadAdmins();
      loadUsers();
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to promote user to admin');
    }
  };

  const handleDemoteFromAdmin = async (adminId, adminEmail) => {
    const reason = prompt(`Please provide a reason for demoting ${adminEmail} from admin role:`);
    if (!reason) return;
    
    try {
      await adminService.demoteFromAdmin(adminId, reason);
      loadAdmins();
      loadUsers();
      setError(null);
    } catch (error) {
      setError(error.message || 'Failed to demote admin');
    }
  };

  const openPromoteModal = (user) => {
    setSelectedUser(user);
    setPromoteForm({ userId: user.id, reason: '' });
    setShowPromoteModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg transition-colors duration-300">
      {/* Header */}
      <header className={`flex justify-between items-center px-4 lg:px-20 py-4 lg:py-6 ${hasAnimated ? 'animate-slide-in-down animate-once' : 'opacity-0'}`}>
        {/* Logo */}
        <div className="flex items-center">
          <Logo className="w-10 h-7 lg:w-13 lg:h-9 mr-3" />
          <div className="text-black/80 dark:text-dark-text font-times text-lg lg:text-2xl font-bold transition-colors duration-300">
            FLOWWAVE ADMIN
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-4 lg:gap-10">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">A</span>
            </div>
            <span className="text-sm font-medium text-neutral-dark dark:text-dark-text">
              {user?.email || 'Admin'}
            </span>
          </div>

          <DarkModeToggle />

          <button
            onClick={handleLogout}
            className="px-4 py-2 lg:px-6 lg:py-3 border-2 border-primary-blue text-primary-blue rounded-lg font-bold text-sm lg:text-lg hover:bg-primary-blue hover:text-white transition-all duration-300"
          >
            Log Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col px-4 lg:px-0 pb-24">
        <div className={`w-full max-w-7xl mx-auto ${hasAnimated ? 'animate-fade-in-up animate-once' : 'opacity-0'}`} style={{ animationDelay: '0.2s' }}>
          {/* Page Header */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-dark">Admin Management</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
              >
                Create New Admin
              </button>
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                <span className="text-red-700">{error}</span>
              </div>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex space-x-1 mb-6 border-b border-gray-200">
            {['admins', 'users'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 font-medium text-sm capitalize transition-colors duration-200 border-b-2 ${
                  activeTab === tab
                    ? 'text-primary-blue border-primary-blue'
                    : 'text-neutral-gray border-transparent hover:text-neutral-dark'
                }`}
              >
                {tab === 'admins' ? 'Current Admins' : 'Promote Users'}
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-blue mr-3"></div>
              <span className="text-neutral-dark">Loading...</span>
            </div>
          )}

          {/* Admins Tab */}
          {activeTab === 'admins' && !loading && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {admins.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-gray">No admins found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Admin</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Created</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {admins.map((admin) => (
                        <tr key={admin.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-neutral-dark">
                                {admin.firstName} {admin.lastName}
                              </div>
                              <div className="text-sm text-neutral-gray">{admin.email}</div>
                              <div className="text-xs text-neutral-gray">{admin.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              admin.status === 'ACTIVE' 
                                ? 'text-green-600 bg-green-50' 
                                : 'text-red-600 bg-red-50'
                            }`}>
                              {admin.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                            {formatDate(admin.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              {admin.status === 'ACTIVE' && admins.length > 1 && (
                                <button
                                  onClick={() => handleDemoteFromAdmin(admin.id, admin.email)}
                                  className="text-red-600 hover:text-red-800"
                                  title="Demote from Admin"
                                >
                                  Demote
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Users Tab (for promotion) */}
          {activeTab === 'users' && !loading && (
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              {users.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-neutral-gray">No users available for promotion</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-neutral-gray uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-neutral-dark">
                                {user.firstName} {user.lastName}
                              </div>
                              <div className="text-sm text-neutral-gray">{user.email}</div>
                              <div className="text-xs text-neutral-gray">{user.phoneNumber}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user.status === 'ACTIVE' 
                                ? 'text-green-600 bg-green-50' 
                                : 'text-red-600 bg-red-50'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                            {user.country || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-gray">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex space-x-2">
                              {user.status === 'ACTIVE' && (
                                <button
                                  onClick={() => openPromoteModal(user)}
                                  className="text-green-600 hover:text-green-800"
                                  title="Promote to Admin"
                                >
                                  Promote
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-dark">Create New Admin</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-neutral-gray hover:text-neutral-dark"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Email</label>
                <input
                  type="email"
                  value={createAdminForm.email}
                  onChange={(e) => setCreateAdminForm({...createAdminForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">First Name</label>
                <input
                  type="text"
                  value={createAdminForm.firstName}
                  onChange={(e) => setCreateAdminForm({...createAdminForm, firstName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Last Name</label>
                <input
                  type="text"
                  value={createAdminForm.lastName}
                  onChange={(e) => setCreateAdminForm({...createAdminForm, lastName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={createAdminForm.phoneNumber}
                  onChange={(e) => setCreateAdminForm({...createAdminForm, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Promote User Modal */}
      {showPromoteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-neutral-dark">Promote User to Admin</h3>
              <button
                onClick={() => setShowPromoteModal(false)}
                className="text-neutral-gray hover:text-neutral-dark"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-neutral-gray">
                Promoting <span className="font-medium">{selectedUser.firstName} {selectedUser.lastName}</span> ({selectedUser.email}) to admin role.
              </p>
            </div>

            <form onSubmit={handlePromoteToAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-dark mb-2">Reason for Promotion</label>
                <textarea
                  value={promoteForm.reason}
                  onChange={(e) => setPromoteForm({...promoteForm, reason: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue"
                  rows="3"
                  placeholder="Provide a reason for this promotion..."
                  required
                />
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowPromoteModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-neutral-dark rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Promote to Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManagement;
