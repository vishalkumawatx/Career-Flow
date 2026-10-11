// updated [frontend/src/utils/helpers.js]
import { formatDistanceToNow, isPast } from 'date-fns';

export const formatDeadline = (date) => {
  const deadline = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isPast(deadline) && deadline.toDateString() !== today.toDateString()) {
    return { text: `Overdue`, color: 'text-red-600', bgColor: 'bg-red-50' };
  }

  const daysUntil = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

  if (daysUntil === 0) {
    return { text: 'Due today', color: 'text-orange-600', bgColor: 'bg-orange-50' };
  }

  if (daysUntil === 1) {
    return { text: 'Due tomorrow', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  }

  if (daysUntil <= 7) {
    return { text: `${daysUntil} days left`, color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
  }

  return { text: formatDistanceToNow(deadline, { addSuffix: true }), color: 'text-green-600', bgColor: 'bg-green-50' };
};

export const getStatusColor = (status) => {
  const colors = {
    Applied: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    Interview: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    Rejected: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
    Selected: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  };
  return colors[status] || colors.Applied;
};

export const statusOptions = [
  { value: 'Applied', label: 'Applied' },
  { value: 'Interview', label: 'Interview' },
  { value: 'Rejected', label: 'Rejected' },
  { value: 'Selected', label: 'Selected' },
];

export const jobTypeOptions = [
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Contract', label: 'Contract' },
];
