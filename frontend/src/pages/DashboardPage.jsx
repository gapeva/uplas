import React from 'react';
import { useUplas } from '../contexts/UplasContext';

// Import project-specific CSS
import '../assets/css/uprojects.css';

const DashboardPage = () => {
  const { t, user } = useUplas();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <h3 className="sidebar-title">{t('uprojects_sidebar_title', 'Project Tools')}</h3>
        <nav className="dashboard-nav">
            <a href="#" className="dashboard-nav__link active"><i className="fas fa-tachometer-alt"></i> {t('uprojects_tool_dashboard', 'Dashboard')}</a>
            <a href="#" className="dashboard-nav__link"><i className="fas fa-robot"></i> {t('uprojects_tool_ai_tutor', 'AI Tutor')}</a>
            <a href="#" className="dashboard-nav__link"><i className="fas fa-code"></i> {t('uprojects_tool_cloud_ide', 'Cloud IDE')}</a>
            <a href="#" className="dashboard-nav__link"><i className="fas fa-users"></i> {t('uprojects_tool_team_hub', 'Team Hub')}</a>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="dashboard-main">
        <div className="dashboard-header">
            <h1 className="dashboard-title">{t('uprojects_dashboard_main_title', 'Your AI Project Launchpad')}</h1>
            <p className="dashboard-subtitle">{t('uprojects_dashboard_subtitle')}</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
            <div className="stat-card">
                <h3>{t('uprojects_stat_started')}</h3>
                <p className="stat-number">3</p>
            </div>
            <div className="stat-card">
                <h3>{t('uprojects_stat_completed')}</h3>
                <p className="stat-number">1</p>
            </div>
            <div className="stat-card">
                <h3>{t('uprojects_stat_overall_progress')}</h3>
                <p className="stat-number">45%</p>
            </div>
        </div>

        {/* Current Projects */}
        <div className="projects-section">
            <div className="section-header-group">
                <h2>{t('uprojects_current_projects_title')}</h2>
                <button className="button button--primary">{t('uprojects_button_start_new')}</button>
            </div>
            
            {/* Empty State Placeholder */}
            <div className="no-projects-placeholder">
                <p>{t('uprojects_no_projects_msg')}</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
