import usersData from '../data/users.json';
import scheduleData from '../data/schedule.json';
import { getData, setData } from './localUtils';
import { User, Schedule } from '../types';

export const initData = () => {
    const users = getData<User[]>('users', []);
    if (users.length === 0) {
        setData<User[]>('users', usersData as User[]);
    }

    const schedule = getData<Schedule>('schedule', {});
    if (Object.keys(schedule).length === 0) {
        setData<Schedule>('schedule', scheduleData as Schedule);
    }
};
