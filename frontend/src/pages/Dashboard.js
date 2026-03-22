import React, { useEffect } from 'react';
import { useApplications } from '../context/ApplicationContext';
import { getStatusColor } from '../utils/helpers';
import { TrendingUp, Clock, CheckCircle, XCircle } from 'lucide-react';

const Dashboard = ({ onAddNew }) => {
  const { stats, upcomingDeadlines, fetchStats, fetchUpcomingDeadlines, loading } = useApplications();

  useEffect(() => {
    const loadData = async () => {
      await fetchStats();
      await fetchUpcomingDeadlines();
    };
    loadData();
  }, [fetchStats, fetchUpcomingDeadlines]);

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className={`${color.bg} border ${color.border} rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{value || 0}</p>
        </div>
        <Icon className={`${color.text} opacity-20`} size={48} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome section */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Track and manage your job applications efficiently</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats && Object.keys(stats).length > 0 ? (
          <>
            <StatCard
              label="Total Applied"
              value={stats.total || 0}
              icon={TrendingUp}
              color={getStatusColor('Applied')}
            />
            <StatCard
              label="Interviews"
              value={stats.Interview || 0}
              icon={Clock}
              color={getStatusColor('Interview')}
            />
            <StatCard
              label="Selected"
              value={stats.Selected || 0}
              icon={CheckCircle}
              color={getStatusColor('Selected')}
            />
            <StatCard
              label="Rejected"
              value={stats.Rejected || 0}
              icon={XCircle}
              color={getStatusColor('Rejected')}
            />
          </>
        ) : (
          <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center text-gray-500">
            <p>No applications yet</p>
          </div>
        )}
      </div>

      {/* Upcoming deadlines section */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Deadlines</h2>

        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : upcomingDeadlines.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400 mb-4">No upcoming deadlines</p>
            <button
              onClick={onAddNew}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              Add Application
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingDeadlines.map((app) => (
              <div
                key={app._id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-900/20 dark:to-yellow-900/20 rounded-lg border border-orange-200 dark:border-orange-700"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{app.companyName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{app.role}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-orange-600 dark:text-orange-400">
                    {new Date(app.deadline).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
