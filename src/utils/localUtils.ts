export const getData = <T>(key: string, fallback: T): T => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
};

export const setData = <T>(key: string, value: T): void => {
    localStorage.setItem(key, JSON.stringify(value));
};

type User = {
    id: string;
    fullName: string;
    role: 'student' | 'teacher';
    group?: string;
};

export const isTeacher = () => {
    const user = getData<User | null>('currentUser', null);
    return user?.role === 'teacher';
};

export const getGroups = (): string[] => {
    const schedule = getData<Record<string, any>>('schedule', {});
    return Object.keys(schedule);
};

type ScheduleItem = {
    day: string;
    pair: number;
};

export const getSchedule = (): Record<string, ScheduleItem[]> => {
    return getData('schedule', {});
};

export const getStudents = (group: string) => {
    const users = getData<any[]>('users', []);
    return users
        .filter(u => u.role === 'student' && u.group === group)
        .sort((a, b) => a.fullName.localeCompare(b.fullName));
};
