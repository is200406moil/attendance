import React, { useState, useRef, useLayoutEffect } from 'react';
import './SchedulePage.css';
import { getData, getSessionData, setSessionData } from '../../utils/localUtils';
import { Schedule, User } from '../../types';
import Header from "../../components/Header/Header";

const SchedulePage: React.FC = () => {
    const schedule = getData<Schedule>('schedule', {});
    const currentUser = getData<User | null>('currentUser', null);
    const [selectedGroup, setSelectedGroup] = useState(
        currentUser?.role === 'student' 
            ? currentUser.group 
            : getSessionData('selectedGroup', Object.keys(schedule)[0] || '')
    );
    const [groupDropdownOpen, setGroupDropdownOpen] = useState(false);
    const [columnsPerRow, setColumnsPerRow] = useState(1);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const groupSchedule = selectedGroup ? schedule[selectedGroup] : {};
    const days = Object.keys(groupSchedule);
    const lessons = [1, 2, 3, 4, 5, 6];

    useLayoutEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (containerRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                console.log(containerWidth, containerWidth / 150)
                const columnWidth = 150;
                const count = Math.max(1, Math.floor(containerWidth / columnWidth) - 1);
                setColumnsPerRow(count);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    const chunkedDays: string[][] = [];
    for (let i = 0; i < days.length; i += columnsPerRow) {
        chunkedDays.push(days.slice(i, i + columnsPerRow));
    }

    const handleGroupSelect = (group: string) => {
        setSelectedGroup(group);
        setGroupDropdownOpen(false);
        if (currentUser?.role === 'teacher') {
            setSessionData('selectedGroup', group);
        }
    };

    return (
        <>
            <Header />
            <div className="schedule-container">
                <div className="schedule" ref={containerRef}>
                    <div className="schedule__header">
                        <h2 className="schedule__title">
                            Расписание
                            {currentUser?.role === 'student' ? 
                                ` для группы ${currentUser.group}` :
                                ' для группы '
                            }
                        </h2>
                        {currentUser?.role === 'teacher' && (
                            <div className="schedule__group-selector">
                                <button
                                    className="schedule__group-button"
                                    onClick={() => setGroupDropdownOpen(prev => !prev)}
                                >
                                    {selectedGroup} ▾
                                </button>
                                <div
                                    className={`schedule__group-dropdown-wrapper ${groupDropdownOpen ? 'open' : ''}`}
                                >
                                    <div className="schedule__group-dropdown">
                                        {Object.keys(schedule).map((group) => (
                                            <div
                                                key={group}
                                                className="schedule__group-item"
                                                onClick={() => handleGroupSelect(group)}
                                            >
                                                {group}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="schedule__rows">
                        {chunkedDays.map((chunk, index) => (
                            <div className="schedule__row" key={index}>
                                <div className="schedule__column schedule__nums-column">
                                    <div className="schedule__day-header">№</div>
                                    {lessons.map(num => (
                                        <div className="schedule__cell schedule__cell--nums" key={num}>{num}</div>
                                    ))}
                                </div>
                                {chunk.map(day => (
                                    <div className="schedule__column" key={day}>
                                        <div className="schedule__day-header">{day}</div>
                                        {lessons.map(num => (
                                            <div 
                                                className="schedule__cell" 
                                                key={num}
                                                data-lesson={`${num}-я пара`}
                                            >
                                                {groupSchedule[day]?.[num.toString()] || ''}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SchedulePage;
