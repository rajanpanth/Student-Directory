import React from 'react';
import Badge from './Badge';
import Button from './Button';

const StudentCard = ({ student, onDelete, onToggle }) => {
    const initials = student.name.split(/\s+/).map(w => w[0]).join('').substring(0, 2).toUpperCase();
    const isTop = student.grade >= 3.6;

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
                <Button variant="danger" size="sm" onClick={() => onDelete(student.id)}>
                    Remove
                </Button>
            </div>
        </div>
    );
};

export default StudentCard;
