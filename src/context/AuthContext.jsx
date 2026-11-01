import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialStudents } from '../services/mockData';
import { api, initDemoStorage, resetDemoStorage } from '../services/api';

const AuthContext = createContext(null);

export const TEACHER_USER = {
  id: 'teacher-1',
  role: 'teacher',
  name: 'Dr. Evelyn Foster',
  title: 'Lead 8th Grade Math Educator',
  school: 'Oakridge STEM Academy',
  avatar: 'EF'
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('sl_current_user');
      return stored ? JSON.parse(stored) : TEACHER_USER;
    } catch {
      return TEACHER_USER;
    }
  });

  const [students, setStudents] = useState(initialStudents);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    initDemoStorage();
    api.getStudents().then(res => {
      if (res && Array.isArray(res)) setStudents(res);
    });
  }, []);

  const showToast = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.id === notification?.id ? null : prev));
    }, 4000);
  };

  const loginAsTeacher = () => {
    setUser(TEACHER_USER);
    localStorage.setItem('sl_current_user', JSON.stringify(TEACHER_USER));
    showToast('Logged in as Teacher (Dr. Evelyn Foster)', 'success');
  };

  const loginAsStudent = (studentId = 'stu-1') => {
    const student = students.find(s => s.id === studentId) || students[0];
    const studentUser = {
      ...student,
      role: 'student'
    };
    setUser(studentUser);
    localStorage.setItem('sl_current_user', JSON.stringify(studentUser));
    showToast(`Logged in as Student (${studentUser.name})`, 'info');
  };

  const resetAllDemoData = async () => {
    try {
      await api.resetDemo();
      resetDemoStorage();
      const updatedStudents = await api.getStudents();
      setStudents(updatedStudents);
      showToast('Classroom demo data reset to original 10-student benchmark!', 'success');
      return true;
    } catch (e) {
      showToast('Reset failed: ' + e.message, 'error');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        students,
        isTeacher: user?.role === 'teacher',
        isStudent: user?.role === 'student',
        loginAsTeacher,
        loginAsStudent,
        resetAllDemoData,
        showToast,
        notification,
        setNotification
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

