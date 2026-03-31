import React, { useState, useMemo } from 'react';
import { useStore } from '../StoreContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function MonthlyReviewTab() {
  const { students, attendance, fees } = useStore();
  const [month, setMonth] = useState(() => {
    const now = new Date();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    return `${now.getFullYear()}-${mm}`;
  });

  const { report, charts } = useMemo(() => {
    const monthPrefix = month;
    const currentMonthFees = fees[month] || {};

    // Calculate School Days
    const schoolDaysDates = Object.keys(attendance).filter(date => date.startsWith(monthPrefix) && Object.keys(attendance[date]).length > 0);
    const schoolDays = schoolDaysDates.length;

    let expected = 0;
    let collected = 0;
    let paidCount = 0;
    let unpaidCount = 0;
    
    let totalAttendancePercent = 0;
    let studentWithRecords = 0;

    const studentStats = students.map(student => {
      // Fee logic
      expected += student.fee;
      const isPaid = !!currentMonthFees[student.id];
      if (isPaid) {
        collected += student.fee;
        paidCount++;
      } else {
        unpaidCount++;
      }

      // Attendance logic
      let pCount = 0;
      let aCount = 0;
      
      schoolDaysDates.forEach(date => {
        const status = attendance[date][student.id];
        if (status === 'P') pCount++;
        if (status === 'A') aCount++;
      });

      const totalRecorded = pCount + aCount;
      const attPercent = totalRecorded === 0 ? 0 : (pCount / totalRecorded) * 100;

      if (totalRecorded > 0) {
        totalAttendancePercent += attPercent;
        studentWithRecords++;
      }

      return {
        ...student,
        pCount,
        aCount,
        attPercent,
        isPaid
      };
    });

    const pending = expected - collected;
    const avgAttendance = studentWithRecords === 0 ? 0 : totalAttendancePercent / studentWithRecords;

    const barData = {
      labels: studentStats.map(s => s.name),
      datasets: [
        {
          label: 'Attendance %',
          data: studentStats.map(s => s.attPercent),
          backgroundColor: studentStats.map(s => s.attPercent >= 75 ? '#10b981' : '#f59e0b'), // green or amber
          borderRadius: 4,
        }
      ]
    };

    const barOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          max: 100,
          min: 0
        }
      },
      plugins: {
        legend: { display: false },
        title: { display: true, text: 'Attendance % per Student' }
      }
    };

    const doughnutData = {
      labels: ['Paid', 'Unpaid'],
      datasets: [
        {
          data: [paidCount, unpaidCount],
          backgroundColor: ['#10b981', '#ef4444'], // green for paid, red for unpaid
          borderWidth: 0,
        }
      ]
    };
    
    const doughnutOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        title: { display: true, text: 'Fee Collection Status' }
      }
    };

    return {
      report: {
        totalStudents: students.length,
        schoolDays,
        avgAttendance,
        expected,
        collected,
        pending
      },
      charts: {
        studentStats,
        barData,
        barOptions,
        doughnutData,
        doughnutOptions
      }
    };
  }, [students, attendance, fees, month]);

  return (
    <div className="tab-content">
      <div className="card header-card">
        <h2>Monthly Review</h2>
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
        <div className="metric-card bg-primary">
          <div className="metric-title">Total Students</div>
          <div className="metric-value">{report.totalStudents}</div>
        </div>
        <div className="metric-card bg-primary">
          <div className="metric-title">School Days</div>
          <div className="metric-value">{report.schoolDays}</div>
        </div>
        <div className="metric-card bg-indigo">
          <div className="metric-title">Avg Attendance</div>
          <div className="metric-value">{report.avgAttendance.toFixed(1)}%</div>
        </div>
        <div className="metric-card bg-green">
          <div className="metric-title">Collected</div>
          <div className="metric-value">{report.collected.toFixed(2)} AED</div>
        </div>
        <div className="metric-card bg-amber">
          <div className="metric-title">Pending</div>
          <div className="metric-value">{report.pending.toFixed(2)} AED</div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="card chart-card">
          <div className="chart-container" style={{ height: '300px' }}>
            <Bar data={charts.barData} options={charts.barOptions} />
          </div>
        </div>
        <div className="card chart-card">
          <div className="chart-container" style={{ height: '300px' }}>
            <Doughnut data={charts.doughnutData} options={charts.doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="card list-card">
        <h2>Detailed Breakdown</h2>
        {charts.studentStats.length === 0 ? (
          <p className="empty-state">No students found.</p>
        ) : (
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Attendance %</th>
                  <th>Fee Amount</th>
                  <th>Payment Status</th>
                </tr>
              </thead>
              <tbody>
                {charts.studentStats.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td><span className="badge badge-success">{student.pCount}</span></td>
                    <td><span className="badge badge-danger">{student.aCount}</span></td>
                    <td>
                      <span className={`badge ${student.attPercent >= 75 ? 'badge-success' : 'badge-amber'}`}>
                        {student.attPercent.toFixed(1)}%
                      </span>
                    </td>
                    <td>{student.fee.toFixed(2)} AED</td>
                    <td>
                      <span className={`badge ${student.isPaid ? 'badge-success' : 'badge-danger'}`}>
                        {student.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
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
