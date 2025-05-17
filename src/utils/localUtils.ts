import { Schedule, User } from '../types';

export const getData = <T>(key: string, fallback: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
};

export const setData = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getSessionData = <T>(key: string, fallback: T): T => {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
};

export const setSessionData = <T>(key: string, value: T): void => {
    sessionStorage.setItem(key, JSON.stringify(value));
};

export const isTeacher = () => {
    const user = getData<User | null>('currentUser', null);
    return user?.role === 'teacher';
};

export const getGroups = (): string[] => {
    const schedule = getData<Schedule>('schedule', {});
    return Object.keys(schedule);
};

export const getSchedule = (): Schedule => {
    return getData('schedule', {});
};

export const getStudents = (group: string) => {
    const users = getData<any[]>('users', []);
    return users
        .filter(u => u.role === 'student' && u.group === group)
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
};
