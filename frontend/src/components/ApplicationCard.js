import React from 'react';
import { getStatusColor, formatDeadline } from '../utils/helpers';
import { Trash2, Edit2, Calendar } from 'lucide-react';

const ApplicationCard = ({ application, onEdit, onDelete }) => {
  const statusColor = getStatusColor(application.status);
  const deadlineInfo = formatDeadline(application.deadline);

  return (
    <div className={`${statusColor.bg} border ${statusColor.border} rounded-lg p-4 hover:shadow-lg transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">{application.companyName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{application.role}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor.text} bg-white/50 dark:bg-gray-800/50`}>
          {application.status}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        {application.location && (
          <p className="text-sm text-gray-700 dark:text-gray-300">📍 {application.location}</p>
        )}
        {application.salary && (
          <p className="text-sm text-gray-700 dark:text-gray-300">💰 {application.salary}</p>
        )}
        {application.jobType && (
          <p className="text-sm text-gray-700 dark:text-gray-300">💼 {application.jobType}</p>
        )}
        <div className={`flex items-center gap-2 text-sm font-medium ${deadlineInfo.color}`}>
          <Calendar size={16} />
          {deadlineInfo.text}
        </div>
      </div>

      {application.notes && (
        <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">{application.notes}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(application)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Edit2 size={16} />
          Edit
        </button>
        <button
          onClick={() => onDelete(application._id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </div>
  );
};

export default ApplicationCard;
