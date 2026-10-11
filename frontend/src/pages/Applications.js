// updated [frontend/src/pages/Applications.js]
import React, { useState } from 'react';
import { useApplications } from '../context/ApplicationContext';
import ApplicationCard from '../components/ApplicationCard.js';
import ApplicationForm from '../components/ApplicationForm.js';
import { Search, Download, Plus } from 'lucide-react';

const Applications = () => {
  const {
    applications,
    loading,
    pagination,
    fetchApplications,
    createApplication,
    updateApplication,
    deleteApplication,
    exportAsCSV,
  } = useApplications();

  const [showForm, setShowForm] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'All',
    page: 1,
  });

  const handleSearch = (e) => {
    const search = e.target.value;
    setFilters((prev) => ({ ...prev, search, page: 1 }));
    fetchApplications({ search, status: filters.status, page: 1 });
  };

  const handleFilterChange = (status) => {
    setFilters((prev) => ({ ...prev, status, page: 1 }));
    fetchApplications({ search: filters.search, status, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    fetchApplications({ search: filters.search, status: filters.status, page });
  };

  const handleAddNew = () => {
    setSelectedApp(null);
    setShowForm(true);
  };

  const handleEdit = (app) => {
    setSelectedApp(app);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    if (selectedApp) {
      const success = await updateApplication(selectedApp._id, formData);
      if (success) {
        setShowForm(false);
        setSelectedApp(null);
      }
    } else {
      const success = await createApplication(formData);
      if (success) {
        setShowForm(false);
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this application?')) {
      await deleteApplication(id);
    }
  };

  const statuses = ['All', 'Applied', 'Interview', 'Rejected', 'Selected'];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Applications</h1>
        <div className="flex gap-3">
          <button
            onClick={exportAsCSV}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            <Download size={18} />
            Export
          </button>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by company or role..."
            value={filters.search}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status filters */}
        <div className="flex gap-2 flex-wrap">
          {statuses.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filters.status === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Applications grid */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">Loading applications...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No applications found</p>
          <button
            onClick={handleAddNew}
            className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
          >
            Add Your First Application
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {applications.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center gap-2 mb-8">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    pagination.page === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Form modal */}
      {showForm && (
        <ApplicationForm
          application={selectedApp}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setSelectedApp(null);
          }}
          loading={loading}
        />
      )}
    </div>
  );
};

export default Applications;
