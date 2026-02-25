import React, { useState } from 'react';
import Badge from './Badge';
import Button from './Button';

const StudentCard = ({ student, onDelete, onToggle, onEdit }) => {
    const [editing, setEditing] = useState(false);
    const [editName, setEditName] = useState(student.name);
    const [editCourse, setEditCourse] = useState(student.course);
    const [editGrade, setEditGrade] = useState(String(student.grade));

    const initials = student.name.split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const isTop = student.grade >= 3.6;

    const handleSave = () => {
        const g = Number(editGrade);
        if (!editName.trim() || !editCourse.trim() || isNaN(g) || g < 0 || g > 4) return;
        onEdit(student.id, {
            name: editName.trim(),
            course: editCourse.trim(),
            grade: g,
        });
        setEditing(false);
    };

    const handleCancel = () => {
        setEditName(student.name);
        setEditCourse(student.course);
        setEditGrade(String(student.grade));
        setEditing(false);
    };

    if (editing) {
        return (
            <div className={`student-card student-card-editing`}>
                <div className="edit-form">
                    <div className="edit-field">
                        <label>Name</label>
                        <input value={editName} onChange={e => setEditName(e.target.value)} autoFocus />
                    </div>
                    <div className="edit-field">
                        <label>Course</label>
                        <input value={editCourse} onChange={e => setEditCourse(e.target.value)} />
                    </div>
                    <div className="edit-field">
                        <label>GPA</label>
                        <input type="number" min="0" max="4" step="0.1" value={editGrade} onChange={e => setEditGrade(e.target.value)} />
                    </div>
                </div>
                <div className="student-actions">
                    <Button variant="primary" size="sm" onClick={handleSave}>Save</Button>
                    <Button variant="outline" size="sm" onClick={handleCancel}>Cancel</Button>
                </div>
            </div>
        );
    }

    return (
        <div className={`student-card ${!student.isPresent ? 'absent' : ''}`}>
            <div className="student-card-top">
                <div className="avatar">{initials}</div>
                <div>
                    <div className="student-name">{student.name}</div>
                    <div className="student-badges">
                        <Badge type={student.isPresent ? 'green' : 'gray'}>
                            {student.isPresent ? 'Present' : 'Absent'}
                        </Badge>
                        {isTop && <Badge type="amber">Top performer</Badge>}
                    </div>
                </div>
            </div>

            <div className="student-meta">
                <span><span className="meta-label">Course</span> {student.course}</span>
                <span><span className="meta-label">GPA</span> <span className="grade-num">{student.grade.toFixed(1)}</span></span>
            </div>

            <div className="student-actions">
                <Button variant="outline" size="sm" onClick={() => onToggle(student.id)}>
                    {student.isPresent ? 'Mark absent' : 'Mark present'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                    Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => onDelete(student.id)}>
                    Remove
                </Button>
            </div>
        </div>
    );
};

export default StudentCard;
