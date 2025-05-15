// LoginPage.test.tsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import * as localUtils from '../../utils/localUtils';
import '@testing-library/jest-dom';

// Мокаем useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Мокаем localStorage
beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
});

describe('LoginPage - ЮНИТ тесты', () => {
    test('переключение между вкладками входа и регистрации', () => {
        render(<BrowserRouter><LoginPage /></BrowserRouter>);
        const registerTab = screen.getByText(/зарегистрироваться/i);
        fireEvent.click(registerTab);
        expect(registerTab).toHaveClass('auth__tab--active');
        const loginTab = screen.getByText(/войти/i);
        fireEvent.click(loginTab);
        expect(loginTab).toHaveClass('auth__tab--active');
    });

    test('переключение роли между студентом и преподавателем', () => {
        render(<BrowserRouter><LoginPage /></BrowserRouter>);
        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        const teacherBtn = screen.getByText(/преподаватель/i);
        fireEvent.click(teacherBtn);
        expect(teacherBtn).toHaveClass('auth__role-button--active');

        const studentBtn = screen.getByText(/студент/i);
        fireEvent.click(studentBtn);
        expect(studentBtn).toHaveClass('auth__role-button--active');
    });
});

describe('LoginPage - ФУНКЦИОНАЛЬНОЕ тестирование', () => {
    test('вход с неверными данными вызывает ошибку', () => {
        jest.spyOn(localUtils, 'getData').mockReturnValue([]);
        render(<BrowserRouter><LoginPage /></BrowserRouter>);

        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[0], { target: { value: 'user1' } });
        fireEvent.change(screen.getByPlaceholderText(/пароль/i), { target: { value: 'wrongpass' } });
        fireEvent.click(screen.getByText(/^войти$/i));

        expect(screen.getByText(/неверный логин или пароль/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });

    test('регистрация нового студента', () => {
        const mockUsers: any[] = [];
        const setDataSpy = jest.spyOn(localUtils, 'setData').mockImplementation(() => {});
        jest.spyOn(localUtils, 'getData').mockImplementation((key) => {
            return key === 'users' ? mockUsers : null;
        });

        render(<BrowserRouter><LoginPage /></BrowserRouter>);
        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[1], { target: { value: 'student1' } });
        fireEvent.change(screen.getByPlaceholderText(/пароль/i), { target: { value: '12345' } });
        fireEvent.change(screen.getByPlaceholderText(/фио/i), { target: { value: 'Иван Иванов' } });
        fireEvent.change(screen.getByPlaceholderText(/группа/i), { target: { value: 'ИС-101' } });

        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        expect(setDataSpy).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/journal');
    });

    test('регистрация с существующим логином вызывает ошибку', () => {
        jest.spyOn(localUtils, 'getData').mockImplementation((key) => {
            if (key === 'users') {
                return [{ id: 1, login: 'existing', password: '123', role: 'student', fullName: 'Test', group: 'ИС-101' }];
            }
            return null;
        });

        render(<BrowserRouter><LoginPage /></BrowserRouter>);
        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[1], { target: { value: 'existing' } });
        fireEvent.change(screen.getByPlaceholderText(/пароль/i), { target: { value: '12345' } });
        fireEvent.change(screen.getByPlaceholderText(/фио/i), { target: { value: 'Новый Пользователь' } });
        fireEvent.change(screen.getByPlaceholderText(/группа/i), { target: { value: 'ИС-101' } });

        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        expect(screen.getByText(/пользователь с таким логином уже существует/i)).toBeInTheDocument();
        expect(mockNavigate).not.toHaveBeenCalled();
    });
});
