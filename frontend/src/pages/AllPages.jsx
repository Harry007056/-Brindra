import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, LayoutDashboard, Users, Folder, MessageCircle, FileText, Settings, Home, Info, DollarSign, CreditCard, User, MessageSquare, BookOpen, Shield, LogIn, UserPlus } from 'lucide-react';

const AllPages = ({ setActiveView }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const pages = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'primary' },
    { id: 'team', label: 'Team Members', icon: Users, group: 'primary' },
    { id: 'projects', label: 'Projects', icon: Folder, group: 'primary' },
    { id: 'messages', label: 'Messages', icon: MessageCircle, group: 'primary' },
    { id: 'files', label: 'Files', icon: FileText, group: 'primary' },
    { id: 'settings', label: 'Settings', icon: Settings, group: 'primary' },
    { id: 'teams', label: 'Teams', icon: Shield, group: 'primary' },
    { id: 'home', label: 'Home', icon: Home, group: 'extra' },
    { id: 'features', label: 'Features', icon: BookOpen, group: 'extra' },
    { id: 'pricing', label: 'Pricing', icon: DollarSign, group: 'extra' },
    { id: 'payment', label: 'Payment', icon: CreditCard, group: 'extra' },
    { id: 'aboutus', label: 'About Us', icon: Info, group: 'extra' },
    { id: 'landing', label: 'Landing', icon: Home, group: 'extra' },
    { id: 'profile', label: 'Profile', icon: User, group: 'extra' },
    { id: 'project-details', label: 'Project Details', icon: Folder, group: 'extra' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, group: 'extra' },
    { id: 'login', label: 'Login', icon: LogIn, group: 'extra' },
    { id: 'register', label: 'Register', icon: UserPlus, group: 'extra' },
  ];

  const filteredPages = pages.filter(page =>
    page.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const IconComponent = ({ name, ...props }) => {
    const icons = {
      LayoutDashboard, Users, Folder, MessageCircle, FileText, Settings,
      Home, Info, DollarSign, CreditCard, User, MessageSquare,
      BookOpen, Shield, LogIn, UserPlus
    };
    const Icon = icons[name];
    return Icon ? <Icon {...props} /> : null;
  };

  return (
    <div className="min-h-screen bg-background-light-sand py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-2xl bg-background-warm-off-white border border-border-soft px-4 py-2.5 text-sm font-medium text-text-default shadow-sm hover:scale-105 hover:shadow-lg transition-all duration-200 hover:bg-primary-soft-sky/10"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-text-main md:text-4xl">All Pages</h1>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text"
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-border-soft bg-background-warm-off-white pl-10 pr-4 py-3 text-text-main placeholder:text-text-muted focus:border-primary-dusty-blue focus:outline-none focus:ring-2 focus:ring-primary-soft-sky/20 shadow-sm transition-all duration-200"
            />
          </div>
        </div>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPages.map((page) => (
            <div
              key={page.id}
              onClick={() => setActiveView(page.id)}
              className="group cursor-pointer rounded-2xl bg-background-warm-off-white border border-border-soft p-6 shadow-lg hover:scale-105 hover:shadow-2xl hover:border-primary-dusty-blue transition-all duration-300 hover:bg-primary-soft-sky/5 overflow-hidden"
            >
              <div className="flex flex-col items-center gap-4 h-full py-4">
                <div className="w-16 h-16 rounded-2xl bg-primary-soft-sky/20 group-hover:bg-primary-dusty-blue/20 p-4 flex items-center justify-center transition-all duration-300">
                  <IconComponent name={page.icon} className="h-7 w-7 text-primary-dusty-blue group-hover:text-background-warm-off-white transition-colors duration-200" />
                </div>
                <h3 className="text-lg font-semibold text-text-main text-center leading-tight group-hover:text-primary-dusty-blue transition-colors">
                  {page.label}
                </h3>
                <span className="text-xs uppercase tracking-wide text-text-muted font-medium">
                  /{page.id.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          ))}
          {filteredPages.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-center rounded-2xl bg-background-warm-off-white border-2 border-dashed border-border-soft">
              <Search className="h-12 w-12 text-text-muted mb-4" />
              <p className="text-xl font-semibold text-text-main mb-2">No pages found</p>
              <p className="text-text-muted">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllPages;
