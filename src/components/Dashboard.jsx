import { useEffect, useMemo, useState } from 'react';
import Loader from './Loader';
import { useDispatch, useSelector } from "react-redux";
import { Navigate, NavLink } from 'react-router-dom';
import {logoutUser, verifyAuth } from '../store/authSlice';
import Sidebar from './Sidebar';
import { fetchDashboardStats } from '../store/dashboardSlice';
import {Chart as ChartJS} from "chart.js/auto";
import {Doughnut, Line} from "react-chartjs-2";
import { FiCalendar } from 'react-icons/fi';
import Loader2 from './Loader2';

const Dashboard = () => {

    const today = new Date();
    const oneMonthBefore = new Date();
    oneMonthBefore.setMonth(today.getMonth() - 1);
  
  const [statsFromDate, setStatsFromDate] = useState(oneMonthBefore);
  const [statsToDate, setStatsToDate] = useState(today);
  const [categoryView, setCategoryView] = useState('expense'); // 'expense' | 'earning'



  const dispatch = useDispatch();
  const {user, isAuthenticated, loading } = useSelector((state) => state.auth);

  const {noOfExpenses, noOfEarnings, totalExpenseAmt, totalEarningAmt, duration, days, loadingDashboardStats, error, dataset, expenses, earnings } = useSelector((state) => state.dashboard);

useEffect(()=>{
  dispatch(verifyAuth()).then(()=>{
    dispatch(fetchDashboardStats({to: statsToDate, from: statsFromDate}));
  })
}, [dispatch])

const handleStatsFilter = ()=>{
  const filterDates = {
    from :statsFromDate ,
    to: statsToDate
  }
  dispatch(fetchDashboardStats(filterDates));
  setStatsFromDate(null);
  setStatsToDate(null);
}

useEffect(() => {
  if (statsFromDate !== null && statsToDate !== null) {
    handleStatsFilter();
  }
}, [statsFromDate, statsToDate]);

  const rangeLabel = (typeof duration === 'string' && duration.trim()) ? duration : ((typeof days === 'string' && days.trim()) ? days : 'All time');

  const categorySummary = useMemo(() => {
    const source = categoryView === 'expense' ? expenses : earnings;
    const totals = source.reduce((acc, item) => {
      const key = item.category || 'Uncategorized';
      acc[key] = (acc[key] || 0) + (Number(item.amount) || 0);
      return acc;
    }, {});
    const labels = Object.keys(totals);
    const values = labels.map(l => totals[l]);
    // categorical palette
    const PALETTE = [
      'rgba(59, 130, 246, 0.7)',  
      'rgba(16, 185, 129, 0.7)',  
      'rgba(245, 158, 11, 0.7)',  
      'rgba(244, 63, 94, 0.7)',   
      'rgba(99, 102, 241, 0.7)',  
      'rgba(34, 197, 94, 0.7)',   
      'rgba(139, 92, 246, 0.7)',  
      'rgba(234, 179, 8, 0.7)',   
      'rgba(2, 132, 199, 0.7)',   
      'rgba(168, 85, 247, 0.7)',  
    ];
    const PALETTE_BORDER = [
      'rgba(59, 130, 246, 1)',
      'rgba(16, 185, 129, 1)',
      'rgba(245, 158, 11, 1)',
      'rgba(244, 63, 94, 1)',
      'rgba(99, 102, 241, 1)',
      'rgba(34, 197, 94, 1)',
      'rgba(139, 92, 246, 1)',
      'rgba(234, 179, 8, 1)',
      'rgba(2, 132, 199, 1)',
      'rgba(168, 85, 247, 1)',
    ];
    const bg = labels.map((_, i) => PALETTE[i % PALETTE.length]);
    const border = labels.map((_, i) => PALETTE_BORDER[i % PALETTE_BORDER.length]);
    return { labels, values, bg, border };
  }, [categoryView, expenses, earnings]);

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

// ===================== DASHBOARD =========================
  return <div className='flex w-full h-full overflow-y-scroll bg-gray-50' >
    <Sidebar user={user} />
    <div className='flex flex-col w-full min-h-screen'>

      {/* -----------------  Top bar filters =----------------------- */}
      <div className='w-full bg-white border border-gray-200 px-3 md:px-6 py-3 flex flex-col sm:flex-row sm:items-end gap-3'>
        <div className='flex-1'>
          <p className='text-sm text-gray-600'>Filter by date</p>
          <div className='flex flex-wrap xs:flex-row items-start xs:items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3 w-full max-w-xl '>
            <div className='relative'>
              <FiCalendar className='absolute left-2 top-1/2 -translate-y-1/2 text-green-700' />
              <input className='border rounded pl-8 pr-2 py-1 text-sm w-48' onChange={(e) => { setStatsFromDate(e.target.value) }} id='expense_from_date' type="date" placeholder='From' />
            </div>
            <div className='relative'>
              <FiCalendar className='absolute left-2 top-1/2 -translate-y-1/2 text-green-700' />
              <input className='border rounded pl-8 pr-2 py-1 text-sm w-48' onChange={(e) => { setStatsToDate(e.target.value) }} id='expense_to_date' type="date" placeholder='To' />
            </div>
            {/* <button onClick={() => { dispatch(fetchDashboardStats()); setStatsFromDate(null); setStatsToDate(null); }} className='text-sm px-3 py-1 rounded border bg-white hover:bg-gray-100 font-semibold text-green-700 '>Filter</button> */}
          </div>
        </div>
      </div>

      {/* --------------------- Content ------------------------ */}
      <div className='w-full max-w-7xl mx-auto px-3 md:px-6 py-4 md:py-6 flex flex-col gap-6'>

        {/* -------------------- Stat cards ------------------- */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          <NavLink to="/earnings" className='rounded-2xl p-4 shadow-sm border bg-green-50 text-green-700 hover:shadow-md transition'>
            {loadingDashboardStats ? (
              <Loader2 />
            ) : (
              <div>
                <p className='text-sm text-green-700'>Total Earnings</p>
                <h3 className='text-2xl font-bold'>Rs. {totalEarningAmt}</h3>
                <p className='text-xs text-green-700/80 mt-1'>Records: {noOfEarnings}</p>
              </div>
            )}
          </NavLink>

          <NavLink to="/expenses" className='rounded-2xl p-4 shadow-sm border bg-red-50 text-red-600 hover:shadow-md transition'>
            {loadingDashboardStats ? (
              <Loader2 />
            ) : (
              <div>
                <p className='text-sm text-red-700'>Total Expenses</p>
                <h3 className='text-2xl font-bold'>Rs. {totalExpenseAmt}</h3>
                <p className='text-xs text-red-700/80 mt-1'>Records: {noOfExpenses}</p>
              </div>
            )}
          </NavLink>

          <div className='rounded-2xl p-4 shadow-sm border bg-green-50 text-green-700 hover:shadow-md transition'>
            <p className='text-sm text-green-700'>Savings</p>
            <h3 className='text-2xl font-bold'>{ parseInt(totalEarningAmt-totalExpenseAmt) }</h3>
            <p className='text-xs text-green-700/80 mt-1'>Earnings - Expenses</p>
          </div>

          <div className='rounded-2xl p-4 shadow-sm border bg-white text-gray-700 hover:shadow-md transition'>
            <p className='text-sm text-gray-600'>Duration</p>
            <h3 className='text-2xl font-bold'>{rangeLabel}</h3>
            <p className='text-xs text-gray-500 mt-1'>Current range</p>
          </div>
        </div>

        {/* --------------------- Charts  ---------------------- */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-6 items-start'>
          <div className='bg-white rounded-2xl border shadow-sm p-4 lg:col-span-1'>
            <div className='flex items-center justify-between mb-3'>
              <h4 className='text-base font-semibold'>Category Breakdown</h4>
              <select value={categoryView} onChange={(e)=>setCategoryView(e.target.value)} className='border rounded px-2 py-1 text-sm'>
                <option value='expense' className='text-green-700' >Expenses</option>
                <option value='earning' className='text-red-700' >Earnings</option>
              </select>
            </div>
            <div className='h-64 md:h-72'>
              {categorySummary.labels.length > 0 ? (
                <Doughnut 
                  data={{
                    labels: categorySummary.labels,
                    datasets: [
                      {
                        label: categoryView === 'expense' ? 'Expenses by Category' : 'Earnings by Category',
                        data: categorySummary.values,
                        backgroundColor: categorySummary.bg,
                        borderColor: categorySummary.border,
                        borderWidth: 2
                      }
                    ]
                  }}
                  options={{
                    plugins: {
                      legend: { position: 'bottom' },
                      tooltip: { enabled: true }
                    },
                    maintainAspectRatio: false,
                    responsive: true
                  }}
                />
              ) : <p className='text-center p-4 text-sm text-gray-500'>No category data</p>}
            </div>
          </div>

          <div className='bg-white rounded-2xl border shadow-sm p-4 lg:col-span-2'>
            <h4 className='text-base font-semibold mb-3'>Monthly Summary</h4>
            <div className='h-72 md:h-96'>
              {dataset && dataset.length > 0 ? (
                <Line
                  data={{
                    labels: dataset.map(item => item.label),
                    datasets: [
                      {
                        label: 'Expenses',
                        data: dataset.map(item => item.expenseAmt),
                        borderColor: 'rgba(239, 68, 68, 1)',
                        tension: 0.35,
                        fill: false,
                        pointRadius: 2,
                      },
                      {
                        label: 'Earnings',
                        data: dataset.map(item => item.earningAmt),
                        borderColor: 'rgba(34, 197, 94, 1)',
                        tension: 0.35,
                        fill: false,
                        pointRadius: 2,
                      }
                    ]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' },
                      tooltip: { enabled: true }
                    },
                    scales: {
                      y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.06)' } },
                      x: { grid: { display: false } }
                    }
                  }}
                />
              ) : <p className='text-center p-4 text-sm text-gray-500'>No data for chart</p>}
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>;
};

export default Dashboard;
