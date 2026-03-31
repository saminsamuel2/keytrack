import React, { useState } from 'react';
import { useStore } from '../StoreContext';
import { Trash2, Edit2, Save, X } from 'lucide-react';

export default function StudentsTab() {
  const { students, addStudent, removeStudent, editStudent } = useStore();
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [fee, setFee] = useState('');
  const [classesPerMonth, setClassesPerMonth] = useState('8');

  // Editing state
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', grade: '', fee: '', classesPerMonth: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !grade || !fee || !classesPerMonth) return;
    addStudent({
      name,
      grade,
      fee: Number(fee),
      classesPerMonth: Number(classesPerMonth)
    });
    setName('');
    setGrade('');
    setFee('');
    setClassesPerMonth('8');
  };

  const handleEditClick = (student) => {
    setEditingId(student.id);
    setEditForm({ 
      name: student.name, 
      grade: student.grade, 
      fee: student.fee, 
      classesPerMonth: student.classesPerMonth || 8 
    });
  };

  const handleSaveEdit = (id) => {
    if (!editForm.name || !editForm.grade || !editForm.fee || !editForm.classesPerMonth) return;
    editStudent(id, {
      name: editForm.name,
      grade: editForm.grade,
      fee: Number(editForm.fee),
      classesPerMonth: Number(editForm.classesPerMonth)
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: '', grade: '', fee: '', classesPerMonth: '' });
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
          <div className="form-group">
            <label>Classes / Month</label>
            <input type="number" value={classesPerMonth} onChange={(e) => setClassesPerMonth(e.target.value)} placeholder="e.g. 4 or 8" min="1" />
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
                  <th>Classes/Month</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    {editingId === student.id ? (
                      <>
                        <td>
                          <input 
                            type="text" 
                            style={{ padding: '0.4rem', width: '100%', minWidth: '120px' }}
                            value={editForm.name} 
                            onChange={(e) => setEditForm({...editForm, name: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            style={{ padding: '0.4rem', width: '100%', minWidth: '100px' }}
                            value={editForm.grade} 
                            onChange={(e) => setEditForm({...editForm, grade: e.target.value})} 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            style={{ padding: '0.4rem', width: '100%', minWidth: '80px' }}
                            value={editForm.fee} 
                            onChange={(e) => setEditForm({...editForm, fee: e.target.value})} 
                            min="0"
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            style={{ padding: '0.4rem', width: '100%', minWidth: '60px' }}
                            value={editForm.classesPerMonth} 
                            onChange={(e) => setEditForm({...editForm, classesPerMonth: e.target.value})} 
                            min="1"
                          />
                        </td>
                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="icon-btn btn-success" onClick={() => handleSaveEdit(student.id)} title="Save Changes">
                            <Save size={16} />
                          </button>
                          <button className="icon-btn" style={{ backgroundColor: '#e5e7eb', color: '#4b5563' }} onClick={handleCancelEdit} title="Cancel">
                            <X size={16} />
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{student.name}</td>
                        <td>{student.grade}</td>
                        <td>{student.fee.toFixed(2)}</td>
                        <td>{student.classesPerMonth || 8}</td>
                        <td style={{ display: 'flex', gap: '0.5rem' }}>
                          <button className="icon-btn" style={{ backgroundColor: '#e0e7ff', color: 'var(--primary)' }} onClick={() => handleEditClick(student)} title="Edit Student">
                            <Edit2 size={16} />
                          </button>
                          <button className="icon-btn btn-danger" onClick={() => removeStudent(student.id)} title="Remove Student">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </>
                    )}
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
