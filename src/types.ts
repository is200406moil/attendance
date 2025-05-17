export type Role = 'student' | 'teacher';

export interface User {
    id: number;
    login: string;
    password: string;
    fullName: string;
    role: Role;
    group?: string;
    subjects?: string[];
}

export interface DaySchedule {
    [pair: string]: string;
}

export interface Schedule {
    [group: string]: {
        [day: string]: DaySchedule;
    };
} 