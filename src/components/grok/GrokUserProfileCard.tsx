/**
 * GROK USER PROFILE CARD
 * Pixel-perfect replication of Grok's user profile card design
 * Features: Avatar, name, email, status badge, actions
 */

import { useState } from 'react';
import type { FC } from 'react';
import { Mail, Phone, MapPin, Calendar, MoreVertical } from 'lucide-react';

interface GrokUserProfileCardProps {
  user: {
    id: string | number;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role?: string;
    status?: 'active' | 'inactive' | 'pending';
    location?: string;
    joinedDate?: string;
    avatarUrl?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
  onViewDetails?: () => void;
}

export const GrokUserProfileCard: FC<GrokUserProfileCardProps> = ({
  user,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const [showActions, setShowActions] = useState(false);

  // Get initials for avatar fallback
  const getInitials = () => {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Get status badge color
  const getStatusColor = () => {
    switch (user.status) {
      case 'active':
        return 'grok-badge-success';
      case 'inactive':
        return 'grok-badge-secondary';
      case 'pending':
        return 'grok-badge-warning';
      default:
        return 'grok-badge-secondary';
    }
  };

  return (
    <div className="grok-card group">
      {/* Card Header with Actions */}
      <div className="flex items-start justify-between mb-grok-lg">
        {/* Avatar & Basic Info */}
        <div className="flex items-center gap-grok-lg">
          {/* Avatar */}
          <div className="grok-avatar grok-avatar-lg">
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt={`${user.firstName} ${user.lastName}`} />
            ) : (
              <span>{getInitials()}</span>
            )}
          </div>

          {/* Name & Email */}
          <div className="flex flex-col gap-grok-xs">
            <h3 className="grok-personal-info-name">
              {user.firstName} {user.lastName}
            </h3>
            {user.status && (
              <span className={`grok-badge ${getStatusColor()}`}>
                {user.status}
              </span>
            )}
          </div>
        </div>

        {/* Actions Menu */}
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="grok-btn grok-btn-ghost grok-btn-icon opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="More actions"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {showActions && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 mt-2 w-48 rounded-grok-md border border-grok-border-subtle bg-grok-bg-secondary shadow-grok-lg z-50">
                <div className="p-2 space-y-1">
                  {onViewDetails && (
                    <button
                      onClick={() => {
                        onViewDetails();
                        setShowActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-grok-sm rounded-grok-md text-grok-text-primary hover:bg-grok-bg-tertiary transition-colors"
                    >
                      View Details
                    </button>
                  )}
                  {onEdit && (
                    <button
                      onClick={() => {
                        onEdit();
                        setShowActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-grok-sm rounded-grok-md text-grok-text-primary hover:bg-grok-bg-tertiary transition-colors"
                    >
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => {
                        onDelete();
                        setShowActions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-grok-sm rounded-grok-md text-grok-red hover:bg-grok-bg-tertiary transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Personal Info */}
      <div className="space-y-grok-md">
        {/* Email */}
        <div className="flex items-center gap-grok-md">
          <Mail className="w-4 h-4 text-grok-text-tertiary" />
          <span className="grok-personal-info-email">{user.email}</span>
        </div>

        {/* Phone */}
        {user.phone && (
          <div className="flex items-center gap-grok-md">
            <Phone className="w-4 h-4 text-grok-text-tertiary" />
            <span className="grok-personal-info-phone">{user.phone}</span>
          </div>
        )}

        {/* Location */}
        {user.location && (
          <div className="flex items-center gap-grok-md">
            <MapPin className="w-4 h-4 text-grok-text-tertiary" />
            <span className="text-grok-sm text-grok-text-secondary">{user.location}</span>
          </div>
        )}

        {/* Joined Date */}
        {user.joinedDate && (
          <div className="flex items-center gap-grok-md">
            <Calendar className="w-4 h-4 text-grok-text-tertiary" />
            <span className="text-grok-sm text-grok-text-secondary">
              Joined {user.joinedDate}
            </span>
          </div>
        )}
      </div>

      {/* Role Badge */}
      {user.role && (
        <div className="mt-grok-lg pt-grok-md border-t border-grok-border-subtle">
          <span className="text-grok-xs text-grok-text-tertiary uppercase tracking-wide">
            Role
          </span>
          <p className="text-grok-sm font-grok-medium text-grok-text-primary mt-1">
            {user.role}
          </p>
        </div>
      )}
    </div>
  );
};

export default GrokUserProfileCard;
