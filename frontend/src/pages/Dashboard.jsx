// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Dashboard() {
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: '',
    date: '',
    note: ''
  })

  const [showAddModal, setShowAddModal] = useState(false)
  const [viewExpense, setViewExpense] = useState(null) // expense object to view in modal

  const navigate = useNavigate()

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await api.get('/expenses')
        setExpenses(res.data || [])
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem('token')
          navigate('/login')
        } else {
          setError('Failed to load expenses')
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  const validateForm = () => {
    if (!form.title) return 'Title is required'
    if (!form.amount || isNaN(Number(form.amount)))
      return 'Amount is required and must be a number'
    if (!form.category) return 'Category is required'
    if (!form.date) return 'Date is required'
    return null
  }

  const handleSubmit = async (e) => {
    e?.preventDefault?.()
    setError('')
    const validation = validateForm()
    if (validation) {
      setError(validation)
      return
    }

    const payload = {
      title: form.title,
      amount: Number(form.amount),
      category: form.category,
      date: new Date(form.date).toISOString(),
      note: form.note || ''
    }

    const tempId = `tmp-${Date.now()}`
    const optimistic = { ...payload, _id: tempId }
    setExpenses((prev) => [optimistic, ...prev])
    setForm({ title: '', amount: '', category: '', date: '', note: '' })
    setShowAddModal(false)

    try {
      const res = await api.post('/expenses', payload)
      setExpenses((prev) =>
        prev.map((it) => (it._id === tempId ? (res.data || it) : it))
      )
    } catch (err) {
      setExpenses((prev) => prev.filter((it) => it._id !== tempId))
      setError(err.response?.data?.message || 'Failed to add expense')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return
    try {
      await api.delete(`/expenses/${id}`)
      setExpenses((prev) => prev.filter((it) => it._id !== id && it.id !== id))
      setViewExpense(null)
    } catch {
      setError('Failed to delete expense')
    }
  }

  const total = expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)

  const openView = (expense) => {
    setViewExpense(expense)
  }

  return (
    <>
      <div className="min-h-screen bg-[#2b2f36] flex items-center justify-center p-6">
        <div className="w-full max-w-6xl rounded-2xl overflow-hidden shadow-2xl flex">
          {/* LEFT: full content area */}
          <div className="w-full bg-[#1f2226] p-8 md:p-12">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-white">
                  Dashboard
                  <span className="inline-block ml-2 w-2 h-2 rounded-full bg-[#878b8f]" />
                </h1>
                <p className="text-sm text-zinc-400 mt-1">Manage your expenses...</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right mr-2">
                  <div className="text-sm text-zinc-400">Total</div>
                  <div className="text-lg font-semibold text-[#7ee0ff]">{total}</div>
                </div>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 rounded-full bg-[#2aa6ff] text-white text-sm hover:brightness-95 transition"
                >
                  Add Expense
                </button>

                <button
                  className="px-4 py-2 rounded-full bg-[#3b3f45] text-zinc-200 text-sm hover:bg-[#474b51] transition"
                  onClick={() => { localStorage.removeItem('token'); navigate('/login') }}
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="text-red-400 mb-3 text-sm animate-pulse">{error}</div>
            )}

            {/* Table / List - only Title, Category, Amount, Date (click row to open view modal) */}
            <div className="bg-[#16181b] rounded-2xl p-4 md:p-6 border border-transparent">
              {loading ? (
                <div className="text-zinc-400 animate-pulse p-6">Loading...</div>
              ) : expenses.length === 0 ? (
                <div className="text-zinc-400 p-6">No expenses yet</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="text-left text-zinc-400 text-sm border-b border-[#26292c]">
                        <th className="py-3 px-4">Title</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Amount</th>
                        <th className="py-3 px-4">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {expenses.map((e) => (
                        <tr
                          key={e._id || e.id}
                          onClick={() => openView(e)}
                          className="border-b border-[#26292c] hover:bg-[#191b1f] transition cursor-pointer"
                        >
                          <td className="py-3 px-4 align-middle text-sm text-gray-300">{e.title || e.note || '-'}</td>
                          <td className="py-3 px-4 text-sm text-gray-300">{e.category}</td>
                          <td className="py-3 px-4 text-sm text-[#7ee0ff] font-semibold">
                            {e.amount}
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-300">
                            {e.date ? new Date(e.date).toLocaleDateString() : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Expense Modal */}
      <AddExpenseModal
        open={showAddModal}
        onClose={() => { setShowAddModal(false); setError('') }}
        form={form}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {/* View Expense Modal */}
      <ViewExpenseModal
        open={!!viewExpense}
        onClose={() => setViewExpense(null)}
        expense={viewExpense}
        onDelete={handleDelete}
      />
    </>
  )
}

/* ----------------------------
  AddEpenseModal and ViewExpenseModal can be added to componenets as seperate files...
-----------------------------*/
function AddExpenseModal({ open, onClose, form, onChange, onSubmit }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="w-full max-w-4xl bg-[#111217] rounded-2xl p-8 shadow-2xl ring-1 ring-black/40
                   md:p-10"
      >
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">Add Expense</h3>
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-white">Close</button>
        </div>

        {/* form: 4 compact fields on top, note full width below */}
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={onChange}
                placeholder="e.g. Groceries"
                className="w-full rounded-lg bg-[#191b1f] p-3 text-white h-12"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Category</label>
              <input
                name="category"
                value={form.category}
                onChange={onChange}
                placeholder="e.g. Food"
                className="w-full rounded-lg bg-[#191b1f] p-3 text-white h-12"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Amount</label>
              <input
                name="amount"
                value={form.amount}
                onChange={onChange}
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg bg-[#191b1f] p-3 text-white h-12"
              />
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Date</label>
              <input
                name="date"
                value={form.date}
                onChange={onChange}
                type="date"
                className="w-full rounded-lg bg-[#191b1f] p-3 text-white h-12"
              />
            </div>
          </div>

          {/* big note area below */}
          <div>
            <label className="block text-sm text-zinc-400 mb-2">Note (optional)</label>
            <textarea
              name="note"
              value={form.note}
              onChange={onChange}
              placeholder="Write any details here..."
              className="w-full rounded-lg bg-[#191b1f] p-4 text-white min-h-40 resize-none leading-relaxed"
            />
          </div>

          {/* actions aligned bottom-right */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-[#2aa6ff] text-white font-semibold shadow-md hover:brightness-95 transition"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


function ViewExpenseModal({ open, onClose, expense, onDelete }) {
  if (!open || !expense) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-4xl bg-[#111217] rounded-2xl p-8 shadow-2xl ring-1 ring-black/40 md:p-10">
        {/* header */}
        <div className="flex items-start justify-between mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
            {expense.title || 'Expense'}
          </h3>
          
        </div>

        {/* top: brief fields in a 2-column grid with subtle borders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0f1113] ring-1 ring-black/20">
              <p className="text-xs text-zinc-400">Category</p>
              <p className="mt-2 font-medium text-white">{expense.category || '-'}</p>
            </div>

            <div className="p-4 rounded-lg bg-[#0f1113] ring-1 ring-black/20">
              <p className="text-xs text-zinc-400">Date</p>
              <p className="mt-2 font-medium text-white">{expense.date ? new Date(expense.date).toLocaleDateString() : '-'}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-[#0f1113] ring-1 ring-black/20 flex items-center justify-between">
              <div>
                <p className="text-xs text-zinc-400">Amount</p>
                <p className="mt-2 font-semibold text-[#7ee0ff] text-lg">{expense.amount}</p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-[#0f1113] ring-1 ring-black/20">
              <p className="text-xs text-zinc-400">Short Note</p>
              <p className="mt-2 text-white">{(expense.note && expense.note.length <= 80) ? expense.note : (expense.note ? `${expense.note.slice(0, 80)}...` : '-')}</p>
            </div>
          </div>
        </div>

        {/* full-width note card below */}
        <div className="mb-6">
          <p className="text-sm text-zinc-400 mb-3">Note</p>
          <div className="rounded-lg bg-[#0f1113] p-6 ring-1 ring-black/20 leading-relaxed whitespace-pre-wrap text-white">
            {expense.note || '-'}
          </div>
        </div>

        {/* footer: delete (left) and close (right) */}
        <div className="flex items-center justify-between">
          <div>
           <button
            onClick={() => onDelete(expense._id || expense.id)}
            className="px-6 py-3 rounded-full bg-red-500 text-white font-semibold shadow-md
             hover:brightness-95 transition">
               Delete
            </button>

          </div>

          <div>
            <button onClick={onClose} className="px-4 py-2 rounded bg-gray-700 text-white">Close</button>
          </div>
        </div>
      </div>
    </div>
  )
}
