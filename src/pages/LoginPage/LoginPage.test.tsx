// LoginPage.test.tsx
import React from 'react';
import { render, fireEvent, screen, waitFor, within } from '@testing-library/react';
import LoginPage from './LoginPage';
import { BrowserRouter } from 'react-router-dom';
import * as localUtils from '../../utils/localUtils';
import '@testing-library/jest-dom';
import { User } from '../../types';

// Мокаем useNavigate
const mockNavigate = jest.fn();

// Мокаем localStorage
const mockLocalStorage = (() => {
    let store: { [key: string]: string } = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => {
            store[key] = value;
        },
        clear: () => {
            store = {};
        }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

// Правильный способ мока react-router-dom
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

// Очищаем моки перед каждым тестом
beforeEach(() => {
    mockLocalStorage.clear();
    jest.clearAllMocks();
});

// Wrapper компонент с future flags для React Router
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            {children}
        </BrowserRouter>
    );
};

// Вспомогательная функция для рендера с wrapper
const renderWithRouter = (ui: React.ReactElement) => {
    return render(ui, { wrapper: TestWrapper });
};

describe('LoginPage - ЮНИТ тесты', () => {
    test('переключение между вкладками входа и регистрации', async () => {
        renderWithRouter(<LoginPage />);
        
        const registerTab = screen.getByRole('button', { name: /sign up/i });
        const loginTab = screen.getByRole('button', { name: /log in/i });

        // Проверяем начальное состояние
        expect(loginTab).toHaveClass('auth__tab--active');
        expect(registerTab).not.toHaveClass('auth__tab--active');
        
        // Переключаемся на регистрацию
        fireEvent.click(registerTab);
        await waitFor(() => {
            expect(registerTab).toHaveClass('auth__tab--active');
            expect(loginTab).not.toHaveClass('auth__tab--active');
        });
        
        // Переключаемся обратно на вход
        fireEvent.click(loginTab);
        await waitFor(() => {
            expect(loginTab).toHaveClass('auth__tab--active');
            expect(registerTab).not.toHaveClass('auth__tab--active');
        });
    });

    test('переключение роли между студентом и преподавателем', async () => {
        renderWithRouter(<LoginPage />);
        
        // Переключаемся на вкладку регистрации
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        const teacherBtn = screen.getByRole('button', { name: /преподаватель/i });
        const studentBtn = screen.getByRole('button', { name: /студент/i });

        // Проверяем начальное состояние (студент по умолчанию)
        expect(studentBtn).toHaveClass('auth__role-button--active');
        expect(teacherBtn).not.toHaveClass('auth__role-button--active');

        // Переключаемся на преподавателя
        fireEvent.click(teacherBtn);
        await waitFor(() => {
            expect(teacherBtn).toHaveClass('auth__role-button--active');
            expect(studentBtn).not.toHaveClass('auth__role-button--active');
        });

        // Переключаемся обратно на студента
        fireEvent.click(studentBtn);
        await waitFor(() => {
            expect(studentBtn).toHaveClass('auth__role-button--active');
            expect(teacherBtn).not.toHaveClass('auth__role-button--active');
        });
    });

    test('отображение соответствующих полей при смене роли', async () => {
        renderWithRouter(<LoginPage />);

        // Переключаемся на вкладку регистрации
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // Проверяем поле группы для студента
        expect(screen.getByPlaceholderText(/группа/i)).toBeInTheDocument();

        // Переключаемся на преподавателя
        fireEvent.click(screen.getByRole('button', { name: /преподаватель/i }));

        // Проверяем поле предметов для преподавателя
        await waitFor(() => {
            expect(screen.getByPlaceholderText(/предметы/i)).toBeInTheDocument();
        });
    });
});

describe('LoginPage - ФУНКЦИОНАЛЬНОЕ тестирование', () => {
    test('успешный вход существующего пользователя', async () => {
        const mockUser = {
            id: 1,
            login: 'testuser',
            password: 'password123',
            role: 'student',
            fullName: 'Test User',
            group: 'ИС-101'
        };

        jest.spyOn(localUtils, 'getData').mockReturnValue([mockUser]);
        
        renderWithRouter(<LoginPage />);

        // Вводим корректные данные
        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[0], { 
            target: { value: 'testuser' } 
        });
        fireEvent.change(screen.getAllByPlaceholderText(/пароль/i)[0], { 
            target: { value: 'password123' } 
        });
        
        // Нажимаем кнопку входа
        fireEvent.click(screen.getByText(/войти/i));

        // Проверяем редирект и сохранение пользователя
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/journal');
            const storedUser = localStorage.getItem('currentUser');
            expect(storedUser).not.toBeNull();
            expect(JSON.parse(storedUser!)).toEqual(mockUser);
        });
    });

    test('вход с неверными данными вызывает ошибку', async () => {
        jest.spyOn(localUtils, 'getData').mockReturnValue([]);
        
        renderWithRouter(<LoginPage />);

        // Вводим неверные данные
        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[0], { 
            target: { value: 'wronguser' } 
        });
        fireEvent.change(screen.getAllByPlaceholderText(/пароль/i)[0], { 
            target: { value: 'wrongpass' } 
        });
        
        // Нажимаем кнопку входа
        fireEvent.click(screen.getByText(/войти/i));

        // Проверяем сообщение об ошибке
        await waitFor(() => {
            const errorMessage = screen.getByTestId('login-error');
            expect(errorMessage).toHaveTextContent(/неверный логин или пароль/i);
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    test('успешная регистрация студента', async () => {
        const setDataSpy = jest.spyOn(localUtils, 'setData').mockImplementation(() => {});
        jest.spyOn(localUtils, 'getData').mockReturnValue([]);

        renderWithRouter(<LoginPage />);
        
        // Переключаемся на вкладку регистрации
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // Вводим данные студента
        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[1], { 
            target: { value: 'newstudent' } 
        });
        fireEvent.change(screen.getAllByPlaceholderText(/пароль/i)[1], { 
            target: { value: 'pass123' } 
        });
        fireEvent.change(screen.getByPlaceholderText(/фио/i), { 
            target: { value: 'Новый Студент' } 
        });
        fireEvent.change(screen.getByPlaceholderText(/группа/i), { 
            target: { value: 'ИС-101' } 
        });

        // Регистрируем студента
        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        // Проверяем результат
        await waitFor(() => {
            expect(setDataSpy).toHaveBeenCalled();
            const savedData = setDataSpy.mock.calls[0][1] as User[];
            expect(savedData[0]).toMatchObject({
                login: 'newstudent',
                password: 'pass123',
                fullName: 'Новый Студент',
                role: 'student',
                group: 'ИС-101'
            });
            expect(mockNavigate).toHaveBeenCalledWith('/journal');
        });
    });

    test('успешная регистрация преподавателя', async () => {
        const setDataSpy = jest.spyOn(localUtils, 'setData').mockImplementation(() => {});
        jest.spyOn(localUtils, 'getData').mockReturnValue([]);

        renderWithRouter(<LoginPage />);
        
        // Переключаемся на вкладку регистрации
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
        
        // Переключаемся на роль преподавателя
        fireEvent.click(screen.getByRole('button', { name: /преподаватель/i }));

        // Вводим данные преподавателя
        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[1], { 
            target: { value: 'newteacher' } 
        });
        fireEvent.change(screen.getAllByPlaceholderText(/пароль/i)[1], { 
            target: { value: 'pass123' } 
        });
        fireEvent.change(screen.getByPlaceholderText(/фио/i), { 
            target: { value: 'Новый Преподаватель' } 
        });
        fireEvent.change(screen.getByPlaceholderText(/предметы/i), { 
            target: { value: 'Математика, Физика' } 
        });

        // Регистрируем преподавателя
        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        // Проверяем результат
        await waitFor(() => {
            expect(setDataSpy).toHaveBeenCalled();
            const savedData = setDataSpy.mock.calls[0][1] as User[];
            expect(savedData[0]).toMatchObject({
                login: 'newteacher',
                password: 'pass123',
                fullName: 'Новый Преподаватель',
                role: 'teacher',
                subjects: ['Математика', 'Физика']
            });
            expect(mockNavigate).toHaveBeenCalledWith('/journal');
        });
    });

    test('регистрация с существующим логином вызывает ошибку', async () => {
        jest.spyOn(localUtils, 'getData').mockReturnValue([{
            id: 1,
            login: 'existing',
            password: '123',
            role: 'student',
            fullName: 'Test',
            group: 'ИС-101'
        }]);

        renderWithRouter(<LoginPage />);
        
        // Переключаемся на вкладку регистрации
        fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

        // Вводим данные с существующим логином
        fireEvent.change(screen.getAllByPlaceholderText(/логин/i)[1], { 
            target: { value: 'existing' } 
        });
        fireEvent.change(screen.getAllByPlaceholderText(/пароль/i)[1], { 
            target: { value: 'pass123' } 
        });
        fireEvent.change(screen.getByPlaceholderText(/фио/i), { 
            target: { value: 'Новый Пользователь' } 
        });
        fireEvent.change(screen.getByPlaceholderText(/группа/i), { 
            target: { value: 'ИС-101' } 
        });

        // Пытаемся зарегистрироваться
        fireEvent.click(screen.getByText(/зарегистрироваться/i));

        // Проверяем сообщение об ошибке
        await waitFor(() => {
            const errorMessage = screen.getByTestId('register-error');
            expect(errorMessage).toHaveTextContent(/пользователь с таким логином уже существует/i);
            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });
});
