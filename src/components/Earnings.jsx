import { useDispatch, useSelector } from "react-redux";
import Sidebar from "./Sidebar";
import { useEffect, useRef, useState } from "react";
import { verifyAuth } from "../store/authSlice";
import Loader from "./Loader";
import { Navigate } from "react-router-dom";
import { RiCloseLargeLine } from "react-icons/ri";
import { addEarning, getEarnings, deleteEarning, updateEarning } from "../store/earningSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import { FiFilter } from "react-icons/fi";
import { LuArrowUpDown } from "react-icons/lu";
import Loader2 from "./Loader2";

const Earnings = () => {
  const earningTitle = useRef("");
  const earningDesc = useRef("");
  const earningAmount = useRef("");
  const earningCategory = useRef("");
  const [formVisibility, toggleFormVisibility] = useState(false);
  const [editFormVisibility, setEditFormVisibility] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [editEarning, setEditEarning] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [page, setPage] = useState(1);
  const limit = 5;
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSort, setSelectedSort] = useState("date_desc");

  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const { earnings, loadingEarnings, totalPages } = useSelector((state) => state.earning);

  useEffect(() => {
    dispatch(verifyAuth());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getEarnings({ page, limit, category: selectedCategory, sort: selectedSort }));
  }, [dispatch, page, limit, selectedCategory, selectedSort]);

  const handleEarningRecord = (e) => {
    e.preventDefault();
    toggleFormVisibility(false);

    const formData = {
      title: earningTitle.current.value,
      desc: earningDesc.current.value,
      amount: Number(earningAmount.current.value),
      category: earningCategory.current.value,
    };

    dispatch(addEarning(formData)).then((res) => {
      if (res.meta?.requestStatus === "fulfilled") {
        setPage(1); 
      } else {
        console.error("addEarning failed", res);
      }
    });

    earningTitle.current.value = "";
    earningDesc.current.value = "";
    earningAmount.current.value = "";
    earningCategory.current.value = "";
  };

  if (loading) return <Loader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="flex w-full h-full overflow-y-scroll">
      <Sidebar user={user} />

      <div className="flex flex-col items-center w-full min-h-screen">
        <div className="flex flex-col items-start md:flex-row md:items-center md:justify-end w-full gap-4 p-3 md:p-4 my-4 md:my-6 bg-green-50">
          <div className="flex items-center gap-2">
            <FiFilter  className="text-gray-600" />
            <div>

              <select
                name="earning-filter"
                id="earning-filter"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setPage(1);
                }}
                className="border border-gray-300 bg-white  rounded px-2 py-1 text-sm md:text-base"
              >
                <option value="">All categories</option>
                <option value="Business">Business</option>
                <option value="Job">Job</option>
                <option value="Trade">Trade</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Teaching">Teaching</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Passive Income">Passive Income</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <LuArrowUpDown className="text-gray-600" />
            <div>
              <select
                name="earning-sort"
                id="earning-sort"
                value={selectedSort}
                onChange={(e) => {
                  setSelectedSort(e.target.value);
                  setPage(1);
                }}
                className="border  border-gray-300 bg-white rounded px-2 py-1 text-sm md:text-base"
              >
                <option value="date_desc">Newest</option>
                <option value="date_asc">Oldest</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => toggleFormVisibility(!formVisibility)}
            className="self-start md:self-auto font-semibold text-sm md:text-lg wrap-normal text-white bg-green-500 px-4 py-1 rounded-md hover:cursor-pointer hover:shadow-md hover:bg-green-600 transition"
          >
            Add Earning
          </button>
        </div>

        <div className="my-2 w-11/12 md:w-3/4 min-h-12 p-3 rounded">
          <p className="xl:text-2xl font-medium  text-green-500 sm:text-sm">{selectedCategory ? selectedCategory.toUpperCase() : "ALL"}</p>
        </div>

        <div className="bg-gray-50 rounded w-11/12 md:w-3/4 min-h-[300px] p-4">
          {loadingEarnings ? (
            <Loader2 />
          ) : earnings.length > 0 ? (
            <div className="w-full overflow-x-auto">
              <table className="min-w-full text-sm md:text-base">
                <thead className="bg-white shadow">
                  <tr className="*:border-r-1 *:border-gray-200 *:font-medium *:text-green-700" >
                    <th className="text-left px-3 py-2">Title</th>
                    <th className="text-left px-3 py-2">Amount</th>
                    <th className="text-left px-3 py-2 hidden sm:table-cell">Date</th>
                    <th className="text-left px-3 py-2 hidden md:table-cell">Category</th>
                    <th className="text-left px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {earnings.map((earning) => (
                    <tr key={earning._id} className="border-b border-gray-300 last:border-0 text-green-800">
                      <td className="px-3 py-2">{earning.title}</td>
                      <td className="px-3 py-2">Rs {earning.amount}</td>
                      <td className="px-3 py-2 hidden sm:table-cell">{new Date(earning.createdAt).toLocaleString()}</td>
                      <td className="px-3 py-2 hidden md:table-cell">{earning.category}</td>
                      <td className="px-3 py-2">
                        <span className="flex items-center gap-3">
                          <FaEdit className="size-5 text-lime-300 hover:text-yellow-500 cursor-pointer transition " onClick={() => { setEditEarning(earning); setEditFormVisibility(true); }} />
                          <FaTrash className="text-red-300 hover:text-red-500 cursor-pointer transition " onClick={() => setDeleteConfirmId(earning._id)} />
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-4 flex justify-center items-center font-medium text-red-400 ">No earnings found!</p>
          )}

          {/* ------------------------- Delete Confirm Dialog div ----------------------------- */}
          {deleteConfirmId && (
            <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50">
              <div className="bg-white p-6 rounded shadow-2xl flex flex-col gap-4 w-11/12 md:w-96 border border-gray-200">
                <h2 className="text-lg font-bold text-red-500 ">Confirm Delete !</h2>
                <p>Are you sure you want to delete this earning?</p>
                <div className="flex gap-4 justify-end">
                  <button className="bg-red-400 hover:bg-red-500 transition-all text-white px-4 py-2 rounded" onClick={() => {
                    dispatch(deleteEarning(deleteConfirmId)).then((res) => {
                      setDeleteConfirmId(null);
                      setSuccessMsg("Earning deleted successfully");
                      setTimeout(() => setSuccessMsg(""), 2000);
                    });
                  }}>Yes, Delete</button>
                  <button className="bg-green-200 text-green-800 hover:bg-green-300 px-4 py-2 rounded transition-all" onClick={() => setDeleteConfirmId(null)}>No</button>
                </div>
              </div>
            </div>
          )}

          {/* ------------------------------------------ Edit Earning Form ------------------------------------ */}
          {editFormVisibility && editEarning && (
            <form
              onSubmit={e => {
                e.preventDefault();
                const formData = {
                  title: e.target.title.value,
                  desc: e.target.desc.value,
                  amount: Number(e.target.amount.value),
                  category: e.target.category.value,
                };
                dispatch(updateEarning({ earningId: editEarning._id, formData })).then(() => {
                  setEditFormVisibility(false);
                  setEditEarning(null);
                  setSuccessMsg("Earning updated successfully");
                  setTimeout(() => setSuccessMsg(""), 2000);
                });
              }}
              className="flex flex-col w-11/12 md:w-1/2 max-w-2xl h-auto md:h-fit p-8 gap-4 bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-xl z-50"
            >
              <RiCloseLargeLine
                onClick={() => { setEditFormVisibility(false); setEditEarning(null); }}
                className="hover:cursor-pointer hover:scale-110 hover:rotate-90 transition-all absolute right-4 top-4"
              />
              <h2 className="text-xl text-yellow-600 font-semibold mb-2 ">Edit Earning</h2>
              <input  name="title" type="text" defaultValue={editEarning.title} placeholder="Earning Title" className="border border-gray-400 rounded px-2 py-1 mb-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-orange-200" required />
              <textarea name="desc" defaultValue={editEarning.desc} placeholder="Describe your earning..." className="border border-gray-400 rounded px-2 py-1 mb-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-orange-200" required />
              <input name="amount" type="number" defaultValue={editEarning.amount} placeholder="Enter Amount (Rs)" className="border border-gray-400 rounded px-2 py-1 mb-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-orange-200" required />
              <label htmlFor="EarningCategory">Select earning category</label>
              <select name="category" id="EarningCategory" defaultValue={editEarning.category} className="border  border-gray-400 rounded px-2 py-1" required>
                <option value="Business">Business</option>
                <option value="Job">Job</option>
                <option value="Trade">Trade</option>
                <option value="Freelancing">Freelancing</option>
                <option value="Teaching">Teaching</option>
                <option value="Real Estate">Real Estate</option>
                <option value="Content Creation">Content Creation</option>
                <option value="Passive Income">Passive Income</option>
                <option value="Others">Others</option>
              </select>
              <button className="bg-yellow-100 text-yellow-600 hover:bg-yellow-200 transition-all font-semibold px-4 py-2 rounded mt-4">Update Earning</button>
            </form>
          )}
        {successMsg && (
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-green-100 text-green-800 px-10 py-5 rounded shadow-lg z-50 text-center text-lg font-semibold">
            {successMsg}
          </div>
        )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-green-600" >
            Page {page} of {totalPages || 1}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      <form
        onSubmit={handleEarningRecord}
        method="POST"
        className={`flex flex-col w-11/12 md:w-1/2 max-w-2xl h-auto md:h-fit p-8 gap-4 bg-white fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-2xl rounded-xl ${
          formVisibility ? "" : "hidden"
        }`}
      >
        <RiCloseLargeLine
          onClick={() => toggleFormVisibility(false)}
          className="hover:cursor-pointer hover:scale-110 hover:rotate-90 transition-all absolute right-4 top-4"
        />

        <h2 className="text-lg font-semibold mb-2 text-green-600">Add your Earning</h2>

        <input ref={earningTitle} type="text" placeholder="Earning Title" className="border border-gray-400 rounded px-2 py-1 mb-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-200" required /> 
        <textarea ref={earningDesc} placeholder="Describe your earning..." className="border border-gray-400 rounded px-2 py-1 mb-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-200" required />
        <input ref={earningAmount} type="number" placeholder="Enter Amount (Rs)" className="border border-gray-400 rounded px-2 py-1 mb-2 focus:outline-none focus:border-0 focus:ring-2 focus:ring-green-200" required />

        <label htmlFor="EarningCategory">Select earning category</label>
        <select ref={earningCategory} id="EarningCategory" defaultValue="" className="border rounded px-2 py-1" required>
          <option value="">All categories</option>
          <option value="Business">Business</option>
          <option value="Job">Job</option>
          <option value="Trade">Trade</option>
          <option value="Freelancing">Freelancing</option>
          <option value="Teaching">Teaching</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Content Creation">Content Creation</option>
          <option value="Passive Income">Passive Income</option>
          <option value="Others">Others</option>
        </select>

        <button className="bg-green-500 hover:bg-green-600 transition-all font-semibold  text-white px-4 py-2 rounded mt-4">Add Earning</button>
      </form>
    </div>
  );
};

export default Earnings;