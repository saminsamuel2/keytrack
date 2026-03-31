import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  // Try to load initial data from browser's local storage
  const loadData = (key, defaultVal) => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) return JSON.parse(saved);
    } catch(e) {
      console.warn("Could not load from local storage", e);
    }
    return defaultVal;
  };

  // user: { username: string } | null
  const [user, setUser] = useState(null);

  // Load remaining state from storage or defaults
  const [students, setStudents] = useState(() => loadData('keytrack_students', []));
  const [attendance, setAttendance] = useState(() => loadData('keytrack_attendance', {}));
  const [fees, setFees] = useState(() => loadData('keytrack_fees', {}));

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('keytrack_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('keytrack_attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('keytrack_fees', JSON.stringify(fees));
  }, [fees]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const addStudent = (student) => {
    setStudents((prev) => [...prev, { ...student, id: Date.now().toString() }]);
  };

  const removeStudent = (id) => {
    setStudents((prev) => prev.filter(s => s.id !== id));
  };

  const editStudent = (id, updatedData) => {
    setStudents((prev) => prev.map(s => 
      s.id === id ? { ...s, ...updatedData } : s
    ));
  };

  const markAttendance = (date, studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [date]: { ...prev[date], [studentId]: status }
    }));
  };

  const toggleFee = (month, studentId) => {
    setFees((prev) => {
      const currentMonth = prev[month] || {};
      const currentStatus = currentMonth[studentId];
      return {
        ...prev,
        [month]: { ...currentMonth, [studentId]: !currentStatus }
      };
    });
  };

  const value = useMemo(() => ({
    user,
    students,
    attendance,
    fees,
    login,
    logout,
    addStudent,
    removeStudent,
    editStudent,
    markAttendance,
    toggleFee
  }), [user, students, attendance, fees]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
