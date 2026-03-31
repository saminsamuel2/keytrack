import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Trash2 } from 'lucide-react';

export default function StudentsTab() {
  const { students, addStudent, removeStudent } = useStore();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [fee, setFee] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !grade || !fee) return;
    addStudent({
      name,
      grade,
      fee: Number(fee)
    });
    setName('');
    setGrade('');
    setFee('');
  };

  return (
    <div className="tab-content">
      <div className="card form-card">
        <h2>Add New Student</h2>
        <form onSubmit={handleSubmit} className="student-form">
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. John Doe" />
          </div>
          <div className="form-group">
            <label>Grade / Class</label>
            <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. 10th Grade" />
          </div>
          <div className="form-group">
            <label>Monthly Fee (AED)</label>
            <input type="number" value={fee} onChange={(e) => setFee(e.target.value)} placeholder="e.g. 500" min="0" />
          </div>
          <button type="submit" className="btn btn-primary">Add Student</button>
        </form>
      </div>

      <div className="card list-card">
        <h2>Enrolled Students ({students.length})</h2>
        {students.length === 0 ? (
          <p className="empty-state">No students enrolled yet.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Grade/Class</th>
                  <th>Monthly Fee (AED)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.grade}</td>
                    <td>{student.fee.toFixed(2)}</td>
                    <td>
                      <button className="icon-btn btn-danger" onClick={() => removeStudent(student.id)} title="Remove Student">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
