import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';

const AddStudentForm = ({ onAdd }) => {
    const [name, setName] = useState('');
    const [course, setCourse] = useState('');
    const [grade, setGrade] = useState('');
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    const validate = () => {
        const e = {};
        if (!name.trim()) e.name = 'Name is required';
        if (!course.trim()) e.course = 'Course is required';
        if (!grade.trim() || isNaN(grade) || +grade < 0 || +grade > 100) e.grade = 'Enter a grade between 0–100';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = (ev) => {
        ev.preventDefault();
        if (!validate()) return;
        onAdd({ name: name.trim(), course: course.trim(), grade: Number(grade) });
        setName(''); setCourse(''); setGrade('');
        setErrors({});
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form-grid">
                <Input
                    id="name"
                    label="Name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    error={errors.name}
                />
                <Input
                    id="course"
                    label="Course"
                    placeholder="Computer Science"
                    value={course}
                    onChange={e => setCourse(e.target.value)}
                    error={errors.course}
                />
                <Input
                    id="grade"
                    label="Grade"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="95"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                    error={errors.grade}
                />
                <div className="field" style={{ justifyContent: 'flex-end' }}>
                    <Button type="submit" variant="primary">Add student</Button>
                </div>
            </form>
            {success && <div className="form-success-msg">Student added successfully.</div>}
        </>
    );
};

export default AddStudentForm;
