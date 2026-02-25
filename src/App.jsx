import React, { useState, useEffect, useMemo } from 'react';
import './styles.css';
import AddStudentForm from './components/AddStudentForm';
import StudentCard from './components/StudentCard';

const App = () => {
  const [students, setStudents] = useState(() => {
    const saved = localStorage.getItem('students_data');
    if (saved) {
      try { return JSON.parse(saved); }
      catch (e) { return []; }
    }
    return [];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCourse, setFilterCourse] = useState('All');
  const [sortBy, setSortBy] = useState('Name A-Z');
  const [viewMode, setViewMode] = useState('grid');
  const [showForm, setShowForm] = useState(true);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('students_data', JSON.stringify(students));
  }, [students]);

  const uniqueCourses = useMemo(() => {
    return [...new Set(students.map(s => s.course))].sort();
  }, [students]);

  const handleAdd = (data) => {
    setStudents(prev => [{
      ...data,
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      isPresent: true,
    }, ...prev]);
  };

  const handleDelete = (id) => {
    setStudents(prev => prev.filter(s => s.id !== id));
  };

  const handleToggle = (id) => {
    setStudents(prev => prev.map(s =>
      s.id === id ? { ...s, isPresent: !s.isPresent } : s
    ));
  };

  const filtered = students
    .filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(s => {
      if (filterStatus === 'Present') return s.isPresent;
      if (filterStatus === 'Absent') return !s.isPresent;
      return true;
    })
    .filter(s => filterCourse === 'All' || s.course === filterCourse)
    .sort((a, b) => {
      if (sortBy === 'Name A-Z') return a.name.localeCompare(b.name);
      if (sortBy === 'Name Z-A') return b.name.localeCompare(a.name);
      if (sortBy === 'Grade High-Low') return b.grade - a.grade;
      if (sortBy === 'Grade Low-High') return a.grade - b.grade;
      return 0;
    });

  const total = students.length;
  const present = students.filter(s => s.isPresent).length;
  const absent = total - present;
  const avg = total > 0 ? Math.round(students.reduce((s, x) => s + x.grade, 0) / total) : 0;

  const hasFilters = searchQuery || filterStatus !== 'All' || filterCourse !== 'All';
  const clearFilters = () => {
    setSearchQuery('');
    setFilterStatus('All');
    setFilterCourse('All');
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>Student Directory</h1>
          <p>Manage attendance, grades, and student records</p>
        </div>
        <button
          className="theme-toggle"
          onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          type="button"
        >
          {theme === 'light' ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
          )}
        </button>
      </header>

      {/* Stats */}
      <div className="stats">
        <div className="stat">
          <div className="stat-number text-indigo">{total}</div>
          <div className="stat-label">Total</div>
        </div>
        <div className="stat">
          <div className="stat-number text-green">{present}</div>
          <div className="stat-label">Present</div>
        </div>
        <div className="stat">
          <div className="stat-number text-red">{absent}</div>
          <div className="stat-label">Absent</div>
        </div>
        <div className="stat">
          <div className="stat-number text-amber">{avg}%</div>
          <div className="stat-label">Avg Grade</div>
        </div>
      </div>

      {/* Add Form */}
      <div className="form-section card">
        <div className="form-header" onClick={() => setShowForm(!showForm)}>
          <h2>Add Student</h2>
          <span className={`form-toggle ${showForm ? 'open' : ''}`}>&#9662;</span>
        </div>
        <div className={`form-body ${showForm ? 'visible' : ''}`}>
          <AddStudentForm onAdd={handleAdd} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-top">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear" onClick={() => setSearchQuery('')}>&#10005;</button>
            )}
          </div>
          <div className="view-btns">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" /><rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" /></svg>
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              title="List"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><rect x="1" y="2" width="14" height="2.5" rx="1" /><rect x="1" y="6.75" width="14" height="2.5" rx="1" /><rect x="1" y="11.5" width="14" height="2.5" rx="1" /></svg>
            </button>
          </div>
        </div>

        <div className="toolbar-filters">
          <div className="filter-field">
            <label>Status</label>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
            </select>
          </div>
          <div className="filter-field">
            <label>Course</label>
            <select value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
              <option value="All">All courses</option>
              {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="filter-field">
            <label>Sort</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="Name A-Z">Name A–Z</option>
              <option value="Name Z-A">Name Z–A</option>
              <option value="Grade High-Low">Grade high–low</option>
              <option value="Grade Low-High">Grade low–high</option>
            </select>
          </div>
        </div>

        {hasFilters && (
          <div className="active-filters">
            <div className="chips">
              {searchQuery && (
                <span className="chip">
                  &ldquo;{searchQuery}&rdquo;
                  <button onClick={() => setSearchQuery('')}>&#10005;</button>
                </span>
              )}
              {filterStatus !== 'All' && (
                <span className={`chip ${filterStatus === 'Present' ? 'chip-green' : 'chip-red'}`}>
                  {filterStatus}
                  <button onClick={() => setFilterStatus('All')}>&#10005;</button>
                </span>
              )}
              {filterCourse !== 'All' && (
                <span className="chip chip-indigo">
                  {filterCourse}
                  <button onClick={() => setFilterCourse('All')}>&#10005;</button>
                </span>
              )}
              <button className="clear-btn" onClick={clearFilters}>Clear all</button>
            </div>
            <span className="result-info">
              <strong>{filtered.length}</strong> {filtered.length === 1 ? 'result' : 'results'}
            </span>
          </div>
        )}
      </div>

      {/* Student list */}
      <div className={viewMode === 'grid' ? 'student-grid' : 'student-list'}>
        {filtered.length > 0 ? (
          filtered.map(s => (
            <StudentCard key={s.id} student={s} onDelete={handleDelete} onToggle={handleToggle} />
          ))
        ) : (
          <div className="empty-state">
            <h3>{total === 0 ? 'No students yet' : 'No results'}</h3>
            <p>{total === 0
              ? 'Add your first student using the form above.'
              : 'Try changing your search or filters.'}</p>
            {hasFilters && total > 0 && (
              <button className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
