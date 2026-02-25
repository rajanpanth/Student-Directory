# Student Directory

A simple React app I built for managing a classroom of students. You can add/remove students, search and filter through them, toggle their attendance, and switch between dark and light themes.

## Getting started

```bash
npm install
npm run dev
```

That's it — opens at [http://localhost:5173](http://localhost:5173).

## What it does

- Add students with a name, course, and grade (with basic validation)
- Search by name, filter by status or course, sort by name or grade
- Mark students as present/absent
- Delete students
- Switch between grid and list views
- Dark/light mode toggle (saved to localStorage)
- Student data persists in localStorage so you don't lose it on refresh
- Students with 90+ grade get a "Top Performer" badge
- Filter chips show up when you have active filters, and you can clear them individually

## Components

I broke the UI into a few reusable pieces:

- **`StudentCard`** — renders one student with their info, badges, and action buttons
- **`AddStudentForm`** — the form for adding students, handles its own validation
- **`Badge`** — small label component, used for status (present/absent) and top performer
- **`Button`** — button with a couple variants (primary, outline, danger) and sizes
- **`Input`** — labeled input field that shows validation errors

## Project structure

```
src/
├── App.jsx              # main app logic and layout
├── styles.css           # all the styles (light + dark themes)
├── index.css            # minimal reset
├── main.jsx             # entry point
└── components/
    ├── StudentCard.jsx
    ├── AddStudentForm.jsx
    ├── Badge.jsx
    ├── Button.jsx
    └── Input.jsx
```

## Built with

- React + Vite
- Plain CSS (no Tailwind, no UI libraries)

## Screenshot

![screenshot](screenshot.png)
