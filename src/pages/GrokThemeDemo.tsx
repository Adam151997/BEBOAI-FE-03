/**
 * GROK THEME DEMO PAGE
 * Comprehensive demonstration of all Grok theme components and styles
 */

import { useState } from 'react';
import { GrokUserProfileCard, GrokModal } from '@/components/grok';
import {
  Users,
  TrendingUp,
  CheckSquare,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function GrokThemeDemo() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  // Sample users for profile cards
  const sampleUsers = [
    {
      id: 1,
      firstName: 'Sarah',
      lastName: 'Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 (555) 123-4567',
      role: 'Senior Sales Executive',
      status: 'active' as const,
      location: 'New York, NY',
      joinedDate: 'Jan 2024',
      avatarUrl: '',
    },
    {
      id: 2,
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      phone: '+1 (555) 234-5678',
      role: 'Account Manager',
      status: 'active' as const,
      location: 'San Francisco, CA',
      joinedDate: 'Mar 2024',
    },
    {
      id: 3,
      firstName: 'Emily',
      lastName: 'Rodriguez',
      email: 'emily.rodriguez@example.com',
      role: 'Marketing Specialist',
      status: 'pending' as const,
      location: 'Austin, TX',
      joinedDate: 'Nov 2024',
    },
  ];

  // Sample stats
  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231.89',
      change: '+20.1%',
      trend: 'up',
      icon: DollarSign,
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+180.1%',
      trend: 'up',
      icon: Users,
    },
    {
      title: 'Conversion Rate',
      value: '12.5%',
      change: '-4.3%',
      trend: 'down',
      icon: TrendingUp,
    },
    {
      title: 'Tasks Completed',
      value: '573',
      change: '+12.0%',
      trend: 'up',
      icon: CheckSquare,
    },
  ];

  return (
    <div className="space-y-grok-2xl">
      {/* Page Header */}
      <div>
        <h1 className="grok-h1">Grok Theme Demo</h1>
        <p className="grok-text-secondary mt-grok-sm">
          Pixel-perfect replication of xAI's Grok app theme - all components and styles
        </p>
      </div>

      <hr className="grok-divider" />

      {/* Typography Section */}
      <section>
        <h2 className="grok-h2">Typography</h2>
        <div className="space-y-grok-md">
          <div>
            <h1 className="grok-h1">Heading 1 - 32px Bold</h1>
            <h2 className="grok-h2">Heading 2 - 24px Semibold</h2>
            <h3 className="grok-h3">Heading 3 - 20px Semibold</h3>
            <h4 className="grok-h4">Heading 4 - 18px Medium</h4>
            <p className="grok-text">
              Body text - 14px Regular. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <p className="grok-text-secondary">
              Secondary text - 14px with #A0A0A0 color
            </p>
            <p className="grok-text-tertiary">
              Tertiary text - 14px with #6B6B6B color
            </p>
          </div>
        </div>
      </section>

      <hr className="grok-divider" />

      {/* Colors Section */}
      <section>
        <h2 className="grok-h2">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-grok-lg">
          <div className="space-y-grok-sm">
            <div className="w-full h-20 bg-grok-bg-primary border border-grok-border-subtle rounded-grok-md"></div>
            <p className="text-grok-sm font-grok-medium">Primary #000000</p>
          </div>
          <div className="space-y-grok-sm">
            <div className="w-full h-20 bg-grok-bg-secondary rounded-grok-md"></div>
            <p className="text-grok-sm font-grok-medium">Secondary #0F0F0F</p>
          </div>
          <div className="space-y-grok-sm">
            <div className="w-full h-20 bg-grok-blue rounded-grok-md"></div>
            <p className="text-grok-sm font-grok-medium">Blue #1DA1F2</p>
          </div>
          <div className="space-y-grok-sm">
            <div className="w-full h-20 bg-grok-green rounded-grok-md"></div>
            <p className="text-grok-sm font-grok-medium text-grok-text-dark">Green #00FF41</p>
          </div>
          <div className="space-y-grok-sm">
            <div className="w-full h-20 bg-grok-orange rounded-grok-md"></div>
            <p className="text-grok-sm font-grok-medium">Orange #FF6B35</p>
          </div>
          <div className="space-y-grok-sm">
            <div className="w-full h-20 bg-grok-red rounded-grok-md"></div>
            <p className="text-grok-sm font-grok-medium">Red #FF0000</p>
          </div>
        </div>
      </section>

      <hr className="grok-divider" />

      {/* Stats Cards */}
      <section>
        <h2 className="grok-h2">Dashboard Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-grok-lg">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.title} className="grok-card">
                <div className="flex items-center justify-between mb-grok-md">
                  <span className="text-grok-sm text-grok-text-secondary">{stat.title}</span>
                  <Icon className="w-5 h-5 text-grok-text-tertiary" />
                </div>
                <div className="space-y-grok-xs">
                  <p className="text-grok-3xl font-grok-bold text-grok-text-primary">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-grok-xs">
                    {stat.trend === 'up' ? (
                      <ArrowUpRight className="w-4 h-4 text-grok-green" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-grok-red" />
                    )}
                    <span
                      className={`text-grok-sm font-grok-medium ${
                        stat.trend === 'up' ? 'text-grok-green' : 'text-grok-red'
                      }`}
                    >
                      {stat.change}
                    </span>
                    <span className="text-grok-sm text-grok-text-tertiary">from last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <hr className="grok-divider" />

      {/* Buttons Section */}
      <section>
        <h2 className="grok-h2">Buttons</h2>
        <div className="flex flex-wrap gap-grok-md">
          <button className="grok-btn grok-btn-primary">Primary Button</button>
          <button className="grok-btn grok-btn-secondary">Secondary Button</button>
          <button className="grok-btn grok-btn-ghost">Ghost Button</button>
          <button className="grok-btn grok-btn-success">Success Button</button>
          <button className="grok-btn grok-btn-danger">Danger Button</button>
          <button className="grok-btn grok-btn-primary grok-btn-sm">Small Button</button>
          <button className="grok-btn grok-btn-primary grok-btn-lg">Large Button</button>
          <button className="grok-btn grok-btn-primary" disabled>
            Disabled Button
          </button>
        </div>
      </section>

      <hr className="grok-divider" />

      {/* Badges Section */}
      <section>
        <h2 className="grok-h2">Badges</h2>
        <div className="flex flex-wrap gap-grok-md">
          <span className="grok-badge grok-badge-primary">Primary</span>
          <span className="grok-badge grok-badge-success">Success</span>
          <span className="grok-badge grok-badge-warning">Warning</span>
          <span className="grok-badge grok-badge-danger">Danger</span>
          <span className="grok-badge grok-badge-secondary">Secondary</span>
        </div>
      </section>

      <hr className="grok-divider" />

      {/* Forms Section */}
      <section>
        <h2 className="grok-h2">Form Elements</h2>
        <div className="max-w-2xl space-y-grok-lg">
          <div className="grok-form-group">
            <label className="grok-label">Email Address</label>
            <input
              type="email"
              className="grok-input"
              placeholder="you@example.com"
            />
            <p className="grok-form-hint">We'll never share your email with anyone else.</p>
          </div>

          <div className="grok-form-group">
            <label className="grok-label">Password</label>
            <input
              type="password"
              className="grok-input"
              placeholder="Enter your password"
            />
          </div>

          <div className="grok-form-group">
            <label className="grok-label">Message</label>
            <textarea
              className="grok-textarea"
              placeholder="Write your message here..."
            ></textarea>
            <p className="grok-form-error">This field has an error</p>
          </div>

          <div className="grok-form-group">
            <label className="grok-label">Select Option</label>
            <select className="grok-select">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <div className="flex gap-grok-md">
            <button className="grok-btn grok-btn-primary">Submit</button>
            <button className="grok-btn grok-btn-ghost">Cancel</button>
          </div>
        </div>
      </section>

      <hr className="grok-divider" />

      {/* User Profile Cards */}
      <section>
        <h2 className="grok-h2">User Profile Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-grok-lg">
          {sampleUsers.map((user) => (
            <GrokUserProfileCard
              key={user.id}
              user={user}
              onEdit={() => console.log('Edit', user)}
              onDelete={() => console.log('Delete', user)}
              onViewDetails={() => console.log('View', user)}
            />
          ))}
        </div>
      </section>

      <hr className="grok-divider" />

      {/* Modals Section */}
      <section>
        <h2 className="grok-h2">Modals</h2>
        <div className="flex gap-grok-md">
          <button className="grok-btn grok-btn-primary" onClick={() => setModalOpen(true)}>
            Open Simple Modal
          </button>
          <button className="grok-btn grok-btn-secondary" onClick={() => setFormModalOpen(true)}>
            Open Form Modal
          </button>
        </div>

        {/* Simple Modal */}
        <GrokModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Simple Modal"
          footer={
            <>
              <button className="grok-btn grok-btn-ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button className="grok-btn grok-btn-primary" onClick={() => setModalOpen(false)}>
                Confirm
              </button>
            </>
          }
        >
          <p className="grok-text">
            This is a simple modal demonstrating the Grok theme design. It features a clean,
            minimalist layout with proper spacing and typography.
          </p>
          <p className="grok-text-secondary mt-grok-md">
            The modal includes a backdrop blur effect, smooth animations, and keyboard support
            (press Escape to close).
          </p>
        </GrokModal>

        {/* Form Modal */}
        <GrokModal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title="Create New Lead"
          size="lg"
          footer={
            <>
              <button
                className="grok-btn grok-btn-ghost"
                onClick={() => setFormModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="grok-btn grok-btn-primary"
                onClick={() => setFormModalOpen(false)}
              >
                Create Lead
              </button>
            </>
          }
        >
          <div className="space-y-grok-lg">
            <div className="grid grid-cols-2 gap-grok-md">
              <div className="grok-form-group">
                <label className="grok-label">First Name</label>
                <input type="text" className="grok-input" placeholder="John" />
              </div>
              <div className="grok-form-group">
                <label className="grok-label">Last Name</label>
                <input type="text" className="grok-input" placeholder="Doe" />
              </div>
            </div>

            <div className="grok-form-group">
              <label className="grok-label">Email</label>
              <input type="email" className="grok-input" placeholder="john.doe@example.com" />
            </div>

            <div className="grok-form-group">
              <label className="grok-label">Company</label>
              <input type="text" className="grok-input" placeholder="Acme Corp" />
            </div>

            <div className="grok-form-group">
              <label className="grok-label">Status</label>
              <select className="grok-select">
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Converted</option>
              </select>
            </div>

            <div className="grok-form-group">
              <label className="grok-label">Notes</label>
              <textarea
                className="grok-textarea"
                placeholder="Add any relevant notes..."
              ></textarea>
            </div>
          </div>
        </GrokModal>
      </section>

      <hr className="grok-divider" />

      {/* Table Section */}
      <section>
        <h2 className="grok-h2">Data Table</h2>
        <div className="grok-table-container">
          <table className="grok-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Role</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              {sampleUsers.map((user) => (
                <tr key={user.id}>
                  <td className="font-grok-medium">
                    {user.firstName} {user.lastName}
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={`grok-badge ${
                        user.status === 'active'
                          ? 'grok-badge-success'
                          : user.status === 'pending'
                          ? 'grok-badge-warning'
                          : 'grok-badge-secondary'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td>{user.role}</td>
                  <td className="text-grok-text-secondary">{user.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <hr className="grok-divider" />

      {/* Loading Spinner */}
      <section>
        <h2 className="grok-h2">Loading States</h2>
        <div className="flex items-center gap-grok-xl">
          <div className="grok-spinner"></div>
          <div className="flex items-center gap-grok-md">
            <div className="grok-spinner"></div>
            <span className="text-grok-sm text-grok-text-secondary">Loading...</span>
          </div>
        </div>
      </section>
    </div>
  );
}
