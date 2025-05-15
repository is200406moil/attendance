export type Role = 'student' | 'teacher';

export interface UserBase {
    id: number;
    login: string;
    password: string;
    role: Role;
    fullName: string;
}

export interface Student extends UserBase {
    role: 'student';
    group: string;
}

export interface Teacher extends UserBase {
    role: 'teacher';
    subjects: string[];
}

export type User = Student | Teacher;

export type Schedule = {
    [groupName: string]: {
        [day: string]: {
            [lessonNumber: string]: string;
        };
    };
};
