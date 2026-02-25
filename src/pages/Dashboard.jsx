import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import '../styles.css';
import AddStudentForm from '../components/AddStudentForm';
import StudentCard from '../components/StudentCard';

const Dashboard = () => {
    const { user, signOut } = useAuth();
    const [students, setStudents] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

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

    const fetchStudents = useCallback(async () => {
        if (!user) return;
        setLoadingData(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setStudents(data.map(s => ({
                id: s.id,
                name: s.name,
                course: s.course,
                grade: Number(s.grade),
                isPresent: s.is_present,
            })));
        }
        setLoadingData(false);
    }, [user]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const uniqueCourses = useMemo(() => {
        return [...new Set(students.map(s => s.course))].sort();
    }, [students]);

    const handleAdd = async (data) => {
        const newStudent = {
            user_id: user.id,
            name: data.name,
            course: data.course,
            grade: data.grade,
            is_present: true,
        };

        const { data: inserted, error } = await supabase
            .from('students')
            .insert([newStudent])
            .select()
            .single();

        if (!error && inserted) {
            setStudents(prev => [{
                id: inserted.id,
                name: inserted.name,
                course: inserted.course,
                grade: Number(inserted.grade),
                isPresent: inserted.is_present,
            }, ...prev]);
        }
    };

    const handleDelete = async (id) => {
        const { error } = await supabase
            .from('students')
            .delete()
            .eq('id', id);

        if (!error) {
            setStudents(prev => prev.filter(s => s.id !== id));
        }
    };

    const handleToggle = async (id) => {
        const student = students.find(s => s.id === id);
        if (!student) return;

        const { error } = await supabase
            .from('students')
            .update({ is_present: !student.isPresent })
            .eq('id', id);

        if (!error) {
            setStudents(prev => prev.map(s =>
                s.id === id ? { ...s, isPresent: !s.isPresent } : s
            ));
        }
    };

    const handleEdit = async (id, updates) => {
        const { error } = await supabase
            .from('students')
            .update({
                name: updates.name,
                course: updates.course,
                grade: updates.grade,
            })
            .eq('id', id);

        if (!error) {
            setStudents(prev => prev.map(s =>
                s.id === id ? { ...s, ...updates } : s
            ));
        }
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
            if (sortBy === 'GPA High-Low') return b.grade - a.grade;
            if (sortBy === 'GPA Low-High') return a.grade - b.grade;
            return 0;
        });

    const total = students.length;
    const present = students.filter(s => s.isPresent).length;
    const absent = total - present;
    const avg = total > 0 ? (students.reduce((s, x) => s + x.grade, 0) / total).toFixed(1) : '0.0';

    const hasFilters = searchQuery || filterStatus !== 'All' || filterCourse !== 'All';
    const clearFilters = () => {
        setSearchQuery('');
        setFilterStatus('All');
        setFilterCourse('All');
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    return (
        <div className="app">
            {/* Background decoration */}
            <div className="dashboard-bg">
                <div className="dashboard-bg-orb dashboard-bg-orb-1"></div>
                <div className="dashboard-bg-orb dashboard-bg-orb-2"></div>
                <div className="dashboard-bg-orb dashboard-bg-orb-3"></div>
            </div>

            <header className="header">
                <div className="header-left">
                    <div className="header-brand">
                        <div className="header-logo">
                            <img src="/logo.jpg" alt="Logo" width="32" height="32" style={{ borderRadius: '4px' }} />
                        </div>
                        <div>
                            <h1>Student Directory</h1>
                            <p className="header-greeting">
                                {getGreeting()}, <span className="header-user-name">{user?.email?.split('@')[0]}</span>
                            </p>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
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
                    <button className="sign-out-btn" onClick={handleSignOut} type="button">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Sign Out
                    </button>
                </div>
            </header>

            <div className="stats">
                <div className="stat stat-total">
                    <div className="stat-icon stat-icon-indigo">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-number text-indigo">{total}</div>
                        <div className="stat-label">Total Students</div>
                    </div>
                </div>
                <div className="stat stat-present">
                    <div className="stat-icon stat-icon-green">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                            <polyline points="22 4 12 14.01 9 11.01" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-number text-green">{present}</div>
                        <div className="stat-label">Present</div>
                    </div>
                </div>
                <div className="stat stat-absent">
                    <div className="stat-icon stat-icon-red">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-number text-red">{absent}</div>
                        <div className="stat-label">Absent</div>
                    </div>
                </div>
                <div className="stat stat-gpa">
                    <div className="stat-icon stat-icon-amber">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                    </div>
                    <div className="stat-content">
                        <div className="stat-number text-amber">{avg}</div>
                        <div className="stat-label">Avg GPA</div>
                    </div>
                </div>
            </div>

            <div className="form-section card">
                <div className="form-header" onClick={() => setShowForm(!showForm)}>
                    <div className="form-header-left">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="8.5" cy="7" r="4" />
                            <line x1="20" y1="8" x2="20" y2="14" />
                            <line x1="23" y1="11" x2="17" y2="11" />
                        </svg>
                        <h2>Add New Student</h2>
                    </div>
                    <span className={`form-toggle ${showForm ? 'open' : ''}`}>&#9662;</span>
                </div>
                <div className={`form-body ${showForm ? 'visible' : ''}`}>
                    <AddStudentForm onAdd={handleAdd} />
                </div>
            </div>

            <div className="toolbar">
                <div className="toolbar-top">
                    <div className="search-box">
                        <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search students..."
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
                            <option value="GPA High-Low">GPA high–low</option>
                            <option value="GPA Low-High">GPA low–high</option>
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

            {loadingData ? (
                <div className="empty-state">
                    <div className="loading-spinner" />
                    <p>Loading students...</p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? 'student-grid' : 'student-list'}>
                    {filtered.length > 0 ? (
                        filtered.map((s, i) => (
                            <div key={s.id} className="student-card-wrapper" style={{ animationDelay: `${i * 0.05}s` }}>
                                <StudentCard student={s} onDelete={handleDelete} onToggle={handleToggle} onEdit={handleEdit} />
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-icon">
                                {total === 0 ? (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                        <circle cx="8.5" cy="7" r="4" />
                                        <line x1="20" y1="8" x2="20" y2="14" />
                                        <line x1="23" y1="11" x2="17" y2="11" />
                                    </svg>
                                ) : (
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="11" cy="11" r="8" />
                                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    </svg>
                                )}
                            </div>
                            <h3>{total === 0 ? 'No students yet' : 'No results found'}</h3>
                            <p>{total === 0
                                ? 'Add your first student using the form above to get started.'
                                : 'Try adjusting your search or filters to find what you\'re looking for.'}</p>
                            {hasFilters && total > 0 && (
                                <button className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
