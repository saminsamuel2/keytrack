import React, { createContext, useContext, useState, useMemo } from 'react';

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

export const StoreProvider = ({ children }) => {
  // user: { username: string } | null
  const [user, setUser] = useState(null);

  // students: [{ id, name, grade, fee: number }]
  const [students, setStudents] = useState([]);
  
  // attendance: { "YYYY-MM-DD": { studentId: 'P' | 'A' } }
  const [attendance, setAttendance] = useState({});
  
  // fees: { "YYYY-MM": { studentId: true | false } }
  const [fees, setFees] = useState({});

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
