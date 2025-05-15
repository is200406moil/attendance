import React, { useState, useEffect, useRef } from 'react';
import './JournalPage.css';
import { isTeacher, getGroups, getSchedule, getStudents, setData } from '../../utils/localUtils';
import Header from "../../components/Header/Header";

const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const JournalPage = () => {
    const teacherMode = isTeacher();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedGroup, setSelectedGroup] = useState('');
    const [selectedPair, setSelectedPair] = useState<string>('1');
    const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
    const [pairDropdownOpen, setPairDropdownOpen] = useState(false);

    const schedule = getSchedule();
    const students = selectedGroup ? getStudents(selectedGroup).sort((a, b) => a.fullName.localeCompare(b.fullName)) : [];

    const attendanceKey = `${selectedGroup}-${selectedPair}-${selectedDate.toDateString()}`;
    const [attendance, setAttendance] = useState(() => {
        return JSON.parse(localStorage.getItem('attendance') || '{}');
    });

    const handleMark = (studentId: string, mark: string) => {
        if (!teacherMode) return;
        const updatedKeyData = JSON.parse(localStorage.getItem('attendance') || '{}');
        const updated = {
            ...updatedKeyData,
            [attendanceKey]: {
                ...(updatedKeyData[attendanceKey] || {}),
                [studentId]: mark
            }
        };
        setAttendance(updated);
        setData('attendance', updated);
    };

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    const getCalendarMatrix = () => {
        const matrix = [];
        const firstDayIndex = (startOfMonth.getDay() + 6) % 7;

        let day = 1 - firstDayIndex;
        for (let row = 0; row < 6; row++) {
            const week = [];
            for (let col = 0; col < 7; col++, day++) {
                const cellDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                week.push(cellDate);
            }
            matrix.push(week);
        }
        return matrix;
    };

    const calendar = getCalendarMatrix();

    const calendarGridRef = useRef<HTMLDivElement>(null);
    const highlightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const grid = calendarGridRef.current;
        const highlight = highlightRef.current;
        if (!grid || !highlight) return;

        const cells = grid.querySelectorAll('.journal__calendar-cell:not(.dimmed)');
        cells.forEach(cell => {
            const span = cell.querySelector('span');
            if (span && span.textContent === selectedDate.getDate().toString()) {
                const rect = (cell as HTMLElement).getBoundingClientRect();
                const gridRect = grid.getBoundingClientRect();

                const offsetX = rect.left - gridRect.left;
                const offsetY = rect.top - gridRect.top;

                highlight.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
                highlight.style.width = `${rect.width}px`;
                highlight.style.height = `${rect.height}px`;
            }
        });
    }, [selectedDate, currentDate]);


    return (
        <>
            <Header />
            <div>
                <div className="journal">
                    <div className="journal__calendar">
                        <div className="journal__calendar-header">
                            <button className="month-btn" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}>{'<'}</button>
                            <span>{currentDate.toLocaleString('ru-RU', { month: 'long', year: 'numeric' })}</span>
                            <button className="month-btn" onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}>{'>'}</button>
                        </div>
                        <div className="journal__calendar-grid" ref={calendarGridRef}>
                            <div className="journal__calendar-highlight" ref={highlightRef} />
                            {daysOfWeek.map((day, idx) => (
                                <div key={idx} className={`journal__calendar-cell journal__calendar-day ${idx === 6 ? 'sunday' : ''}`}>{day}</div>
                            ))}
                            {calendar.map((week, rowIdx) =>
                                week.map((date, colIdx) => {
                                    const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                                    return (
                                        <div
                                            key={rowIdx * 7 + colIdx}
                                            className={`journal__calendar-cell ${!isCurrentMonth ? 'dimmed' : ''} ${colIdx === 6 ? 'sunday' : ''}`}
                                            onClick={() => setSelectedDate(date)}
                                        >
                                            <span>{date.getDate()}</span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                    </div>

                    <div className="journal__panel">
                        <div className="schedule__selectors">
                            <div className="schedule__group-selector">
                                <button className="schedule__group-button" onClick={() => setPairDropdownOpen(prev => !prev)}>
                                    {selectedPair || 'Выбрать пару'} ▾
                                </button>
                                <div className={`schedule__group-dropdown-wrapper ${pairDropdownOpen ? 'open' : ''}`}>
                                    <div className="schedule__group-dropdown">
                                        {[1, 2, 3, 4, 5, 6]
                                            .filter(p => Array.isArray(schedule[selectedGroup]) || schedule[selectedGroup])
                                            .map(p => (
                                                <div
                                                    key={p}
                                                    className="schedule__group-item"
                                                    onClick={() => {
                                                        setSelectedPair(p.toString());
                                                        setPairDropdownOpen(false);
                                                    }}
                                                >
                                                    {p}-я пара
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>

                            <div className="schedule__group-selector">
                                <button className="schedule__group-button" onClick={() => setGroupDropdownOpen(prev => !prev)}>
                                    {selectedGroup || 'Выбрать группу'} ▾
                                </button>
                                <div className={`schedule__group-dropdown-wrapper ${groupDropdownOpen ? 'open' : ''}`}>
                                    <div className="schedule__group-dropdown">
                                        {getGroups().map(group => (
                                            <div key={group} className="schedule__group-item" onClick={() => { setSelectedGroup(group); setGroupDropdownOpen(false); }}>
                                                {group}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="journal__students">
                            {students.map(student => {
                                const keyAttendance = attendance[attendanceKey] || {};
                                const mark = keyAttendance[student.id] || '-';
                                return (
                                    <div key={student.id} className="journal__student">
                                        <div className="journal__student-name">{student.fullName}</div>
                                        {teacherMode ? (
                                            <div className="journal__student-buttons">
                                                {['-', 'У', '+'].map(m => (
                                                    <button
                                                        key={m}
                                                        className={`journal__mark-btn ${mark === m ? 'active' : ''}`}
                                                        onClick={() => handleMark(student.id, m)}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="journal__student-status">{mark}</div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JournalPage;
