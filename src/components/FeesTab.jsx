import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import { IndianRupee } from 'lucide-react'; // We will use generic styling or AED text instead of this icon

export default function FeesTab() {
  const { students, fees, toggleFee } = useStore();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${mm}`;
  });

  const currentMonthFees = fees[month] || {};

  const summaries = useMemo(() => {
    let expected = 0;
    let collected = 0;
    
    students.forEach(s => {
      expected += s.fee;
      if (currentMonthFees[s.id]) {
        collected += s.fee;
      }
    });

    return {
      expected,
      collected,
      pending: expected - collected,
    };
  }, [students, currentMonthFees]);

  return (
    <div className="tab-content">
      <div className="card header-card">
        <h2>Fees Management</h2>
        <div className="form-group month-picker-group">
          <label>Select Month</label>
          <input 
            type="month" 
            value={month} 
            onChange={(e) => setMonth(e.target.value)} 
          />
        </div>
      </div>

      <div className="metrics-grid">
        <div className="metric-card bg-indigo">
          <div className="metric-title">Total Expected</div>
          <div className="metric-value">{summaries.expected.toFixed(2)} AED</div>
        </div>
        <div className="metric-card bg-green">
          <div className="metric-title">Total Collected</div>
          <div className="metric-value">{summaries.collected.toFixed(2)} AED</div>
        </div>
        <div className="metric-card bg-amber">
          <div className="metric-title">Total Pending</div>
          <div className="metric-value">{summaries.pending.toFixed(2)} AED</div>
        </div>
      </div>

      <div className="card list-card">
        {students.length === 0 ? (
          <p className="empty-state">Add students first to manage fees.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Grade</th>
                  <th>Monthly Fee</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const isPaid = currentMonthFees[student.id] || false;
                  return (
                    <tr key={student.id}>
                      <td>{student.name}</td>
                      <td>{student.grade}</td>
                      <td>{student.fee.toFixed(2)} AED</td>
                      <td>
                        <span className={`badge ${isPaid ? 'badge-success' : 'badge-danger'}`}>
                          {isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                      <td>
                        <button 
                          className={`btn ${isPaid ? 'btn-danger' : 'btn-success'}`}
                          onClick={() => toggleFee(month, student.id)}
                        >
                          Mark as {isPaid ? 'Unpaid' : 'Paid'}
                        </button>
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
