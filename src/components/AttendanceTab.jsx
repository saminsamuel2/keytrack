import React, { useState } from 'react';
import { useStore } from '../StoreContext';

export default function AttendanceTab() {
  const { students, attendance, markAttendance } = useStore();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const currentAttendance = attendance[date] || {};

  return (
    <div className="tab-content">
      <div className="card header-card">
        <h2>Daily Attendance</h2>
        <div className="form-group date-picker-group">
          <label>Select Date</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
          />
        </div>
      </div>

      <div className="card list-card">
        {students.length === 0 ? (
          <p className="empty-state">Add students first to mark attendance.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table mt-4">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const status = currentAttendance[student.id];
                  return (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.grade}</td>
                      <td>
                        <div className="toggle-group">
                          <button 
                            className={`toggle-btn ${status === 'P' ? 'active-green' : ''}`}
                            onClick={() => markAttendance(date, student.id, 'P')}
                          >
                            Present
                          </button>
                          <button 
                            className={`toggle-btn ${status === 'A' ? 'active-red' : ''}`}
                            onClick={() => markAttendance(date, student.id, 'A')}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
