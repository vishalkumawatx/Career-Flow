// updated [frontend/src/context/ApplicationContext.js]
import { createContext, useContext, useState, useCallback } from 'react';
import { applicationService } from '../services/service';
import toast from 'react-hot-toast';

const ApplicationContext = createContext();

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationProvider');
  }
  return context;
};

export const ApplicationProvider = ({ children }) => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({
    Applied: 0,
    Interview: 0,
    Rejected: 0,
    Selected: 0,
    total: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});

  const fetchApplications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const response = await applicationService.getAll(params);
      setApplications(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      console.log('Fetching stats...');
      const response = await applicationService.getStats();
      console.log('Stats response:', response.data);
      if (response.data.stats) {
        setStats({
          ...response.data.stats,
          total: response.data.total || 0,
        });
        console.log('Stats updated:', response.data.stats);
      } else {
        console.warn('No stats in response');
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error(`Error fetching stats: ${error.message}`);
      }
    }
  }, []);

  const fetchUpcomingDeadlines = useCallback(async () => {
    try {
      console.log('Fetching upcoming deadlines...');
      const response = await applicationService.getUpcomingDeadlines();
      console.log('Upcoming deadlines response:', response.data);
      if (response.data.data) {
        setUpcomingDeadlines(response.data.data);
        console.log('Upcoming deadlines updated:', response.data.data);
      } else {
        console.warn('No data in deadlines response');
        setUpcomingDeadlines([]);
      }
    } catch (error) {
      console.error('Failed to fetch upcoming deadlines:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        console.error('Deadlines fetch error:', error.message);
      }
      setUpcomingDeadlines([]);
    }
  }, []);

  const createApplication = useCallback(async (formData) => {
    try {
      setLoading(true);
      await applicationService.create(formData);
      await fetchApplications();
      await fetchStats();
      toast.success('Application added successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.details?.[0] || error.response?.data?.message || 'Failed to create application';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications, fetchStats]);

  const updateApplication = useCallback(async (id, formData) => {
    try {
      setLoading(true);
      await applicationService.update(id, formData);
      await fetchApplications();
      await fetchStats();
      toast.success('Application updated successfully');
      return true;
    } catch (error) {
      const message = error.response?.data?.details?.[0] || error.response?.data?.message || 'Failed to update application';
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications, fetchStats]);

  const deleteApplication = useCallback(async (id) => {
    try {
      setLoading(true);
      await applicationService.delete(id);
      await fetchApplications();
      await fetchStats();
      toast.success('Application deleted successfully');
      return true;
    } catch (error) {
      toast.error('Failed to delete application');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchApplications, fetchStats]);

  const exportAsCSV = useCallback(async () => {
    try {
      setLoading(true);
      const response = await applicationService.exportCSV();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'applications.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      toast.success('Applications exported successfully');
    } catch (error) {
      toast.error('Failed to export applications');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    applications,
    stats,
    upcomingDeadlines,
    loading,
    pagination,
    fetchApplications,
    fetchStats,
    fetchUpcomingDeadlines,
    createApplication,
    updateApplication,
    deleteApplication,
    exportAsCSV,
  };

  return <ApplicationContext.Provider value={value}>{children}</ApplicationContext.Provider>;
};
