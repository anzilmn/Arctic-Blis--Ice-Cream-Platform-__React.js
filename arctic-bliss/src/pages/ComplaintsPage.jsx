import { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { AlertCircle, Send, Loader2, CheckCircle, Clock, Package } from 'lucide-react';
import { complaintsApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const ComplaintsPage = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('submit');
  const [loading, setLoading] = useState(false);
  const [myComplaints, setMyComplaints] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerEmail: user?.email || '',
    type: 'quality_issue',
    subject: '',
    description: '',
    orderId: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tab === 'history' && user) {
      complaintsApi.getMine().then(r => setMyComplaints(r.complaints)).catch(() => {});
    }
  }, [tab, user]);

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.customerEmail.match(/^\S+@\S+\.\S+$/)) errs.customerEmail = 'Valid email required';
    if (!form.subject.trim() || form.subject.trim().length < 3) errs.subject = 'Subject must be at least 3 characters';
    if (!form.description.trim() || form.description.trim().length < 10) errs.description = 'Description must be at least 10 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) { setErrors(validationErrors); return; }
    setLoading(true);
    try {
      await complaintsApi.submit(form);
      setSubmitted(true);
      toast.success('Complaint submitted! We will respond within 24 hours.');
    } catch (err) {
      toast.error(err.message || 'Failed to submit complaint');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const complaintTypes = [
    { value: 'wrong_order', label: 'Wrong Order' },
    { value: 'quality_issue', label: 'Quality Issue' },
    { value: 'delivery_problem', label: 'Delivery Problem' },
    { value: 'billing_issue', label: 'Billing Issue' },
    { value: 'other', label: 'Other' },
  ];

  const statusColors = {
    open: 'bg-red-100 text-red-700',
    in_review: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
  };

  const inputClass = (field) =>
    `w-full p-4 rounded-xl border focus:outline-none focus:ring-2 transition ${
      errors[field] ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-pink-300'
    }`;

  return (
    <div className="pt-32 pb-20 min-h-screen bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-orange-100 rounded-3xl text-orange-500 mb-4"><AlertCircle size={32} /></div>
          <h1 className="text-4xl font-extrabold text-gray-950 tracking-tighter">Complaints & <span className="text-icePrimary">Support</span></h1>
          <p className="text-gray-600 mt-2">We take every complaint seriously. Let us know how we can improve.</p>
        </div>

        {user && (
          <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
            {['submit', 'history'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-3 rounded-xl font-semibold transition-all capitalize ${tab === t ? 'bg-icePrimary text-white shadow-md' : 'text-gray-500 hover:text-gray-700'}`}>
                {t === 'submit' ? 'Submit Complaint' : 'My Complaints'}
              </button>
            ))}
          </div>
        )}

        {tab === 'submit' && (
          <Motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle className="mx-auto text-green-500 mb-4" size={56} />
                <h3 className="text-2xl font-bold text-gray-900">Complaint Submitted!</h3>
                <p className="text-gray-600 mt-2">We'll get back to you within 24 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ ...form, subject: '', description: '', orderId: '' }); }}
                  className="mt-6 px-6 py-2 bg-icePrimary text-white rounded-full font-semibold text-sm hover:bg-pink-500 transition">
                  Submit Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input name="customerName" placeholder="Your Name *" value={form.customerName} onChange={handleChange} className={inputClass('customerName')} />
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                  </div>
                  <div>
                    <input name="customerEmail" type="email" placeholder="Email *" value={form.customerEmail} onChange={handleChange} className={inputClass('customerEmail')} />
                    {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select name="type" value={form.type} onChange={handleChange} className={inputClass('type')}>
                    {complaintTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input name="orderId" placeholder="Order ID (optional)" value={form.orderId} onChange={handleChange} className={inputClass('orderId')} />
                </div>

                <div>
                  <input name="subject" placeholder="Subject *" value={form.subject} onChange={handleChange} className={inputClass('subject')} />
                  {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
                </div>

                <div>
                  <textarea rows="5" name="description" placeholder="Describe your issue in detail... *" value={form.description} onChange={handleChange} className={inputClass('description')} />
                  {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                  <p className="text-xs text-gray-400 mt-1 text-right">{form.description.length}/1000</p>
                </div>

                <Motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
                  className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-lg hover:bg-icePrimary transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                  {loading ? 'Submitting...' : 'Submit Complaint'}
                </Motion.button>
              </form>
            )}
          </Motion.div>
        )}

        {tab === 'history' && user && (
          <div className="space-y-4">
            {myComplaints.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200">
                <CheckCircle size={40} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No complaints filed. That's great!</p>
              </div>
            ) : (
              myComplaints.map(c => (
                <div key={c._id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-gray-900">{c.subject}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColors[c.status]}`}>{c.status}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{c.description}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>{c.type.replace(/_/g, ' ')}</span>
                    <span>·</span>
                    <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                    {c.orderId && <><span>·</span><span className="flex items-center gap-1"><Package size={10} />{c.orderId}</span></>}
                  </div>
                  {c.adminResponse && (
                    <div className="mt-3 p-3 bg-green-50 rounded-xl border border-green-100">
                      <p className="text-xs font-semibold text-green-700 mb-1 flex items-center gap-1"><CheckCircle size={12} /> Admin Response:</p>
                      <p className="text-sm text-green-800">{c.adminResponse}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplaintsPage;
