import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, query, where, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../config/firebaseconfig';

function Student() {
  const [facultyList, setFacultyList] = useState([]);
  const [filters, setFilters] = useState({ domain: '', officeHours: '', slots: '' });
  const [ideaForm, setIdeaForm] = useState({ title: '', description: '', supervisor: '' });
  const [submittedIdeas, setSubmittedIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Get current user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Fetch faculty data from Firestore
  useEffect(() => {
    const fetchFaculty = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'faculty'));
        const facultyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setFacultyList(facultyData);
      } catch (error) {
        console.error("Error fetching faculty: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  // Fetch submitted ideas from Firestore for current user
  useEffect(() => {
    if (!currentUser) return;

    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, 'proposals'),
          where('submittedBy', '==', currentUser.uid)
        );
        
        const querySnapshot = await getDocs(q);
        const ideasData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Handle both timestamp object and date string
            submittedAt: data.submittedAt?.toDate ? data.submittedAt.toDate() : new Date(data.submittedAt)
          };
        }).sort((a, b) => b.submittedAt - a.submittedAt); // Sort by newest first
        
        setSubmittedIdeas(ideasData);
      } catch (error) {
        console.error("Error fetching ideas: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, [currentUser]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredFaculty = facultyList.filter(member => {
    const domainMatch = !filters.domain || member.domain.toLowerCase().includes(filters.domain.toLowerCase());
    const officeMatch = !filters.officeHours || member.officeHours.toLowerCase().includes(filters.officeHours.toLowerCase());
    const slotMatch = !filters.slots || member.slots >= parseInt(filters.slots);
    return domainMatch && officeMatch && slotMatch;
  });

  const handleIdeaChange = (e) => {
    const { name, value } = e.target;
    setIdeaForm(prev => ({ ...prev, [name]: value }));
  };

  const handleIdeaSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!currentUser) {
      alert("You must be logged in to submit an idea.");
      setLoading(false);
      return;
    }

    try {
      const docRef = await addDoc(collection(db, 'proposals'), {
        title: ideaForm.title,
        description: ideaForm.description,
        supervisor: ideaForm.supervisor,
        status: "pending",
        submittedBy: currentUser.uid,
        submittedAt: serverTimestamp(),
        studentName: currentUser.displayName || "Anonymous Student",
        studentEmail: currentUser.email || ""
      });
      
      // Add the new idea to the beginning of the array
      setSubmittedIdeas(prev => [{
        id: docRef.id,
        ...ideaForm,
        status: "pending",
        submittedAt: new Date(),
        studentName: currentUser.displayName || "Anonymous Student",
        studentEmail: currentUser.email || ""
      }, ...prev]);
      
      setIdeaForm({ title: '', description: '', supervisor: '' });
      alert("FYP idea submitted successfully!");
    } catch (error) {
      console.error("Error submitting idea: ", error);
      alert("Failed to submit FYP idea. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProposal = async (id) => {
    if (!window.confirm("Are you sure you want to delete this proposal?")) return;
    
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'proposals', id));
      setSubmittedIdeas(prev => prev.filter(idea => idea.id !== id));
      alert("Proposal deleted successfully!");
    } catch (error) {
      console.error("Error deleting proposal: ", error);
      alert("Failed to delete proposal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'revision': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDomainColor = (domain) => {
    const colors = {
      'AI': 'bg-purple-100 text-purple-800',
      'Cybersecurity': 'bg-green-100 text-green-800',
      'Data Science': 'bg-blue-100 text-blue-800',
      'Networks': 'bg-orange-100 text-orange-800',
      'Web Development': 'bg-red-100 text-red-800',
      'Machine Learning': 'bg-indigo-100 text-indigo-800',
      'Cloud Computing': 'bg-cyan-100 text-cyan-800',
      'Software Engineering': 'bg-amber-100 text-amber-800',
      'IoT': 'bg-emerald-100 text-emerald-800'
    };
    return colors[domain] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    try {
      const d = date instanceof Date ? date : new Date(date);
      return d.toLocaleString();
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Invalid date';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Dashboard</h1>

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Processing...</span>
          </div>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Browse Supervisors</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
            <select
              name="domain" 
              onChange={handleFilterChange} 
              value={filters.domain} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Domains</option>
              <option value="AI">Artificial Intelligence</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Data Science">Data Science</option>
              <option value="Networks">Networks</option>
              <option value="Web Development">Web Development</option>
              <option value="Machine Learning">Machine Learning</option>
              <option value="Cloud Computing">Cloud Computing</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="IoT">Internet of Things</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
            <input 
              name="officeHours" 
              onChange={handleFilterChange} 
              value={filters.officeHours} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="e.g., Mon, Tue" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Slots</label>
            <input 
              name="slots" 
              onChange={handleFilterChange} 
              value={filters.slots} 
              type="number" 
              min="0"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Available slots" 
            />
          </div>
        </div>
      </div>

      {/* Faculty List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 mb-8">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-700">Available Supervisors</h2>
          <span className="text-sm text-gray-500">{filteredFaculty.length} faculty members</span>
        </div>
        {filteredFaculty.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No faculty members match your filters. Try adjusting your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Hours</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slots</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredFaculty.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{f.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDomainColor(f.domain)}`}>
                        {f.domain}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{f.officeHours}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${f.slots > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        {f.slots}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* FYP Idea Form */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Submit FYP Idea</h2>
        <form onSubmit={handleIdeaSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input 
              name="title" 
              value={ideaForm.title} 
              onChange={handleIdeaChange} 
              placeholder="Project Title" 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea 
              name="description" 
              value={ideaForm.description} 
              onChange={handleIdeaChange} 
              placeholder="Detailed description of your project" 
              rows="4"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Supervisor</label>
            <select
              name="supervisor" 
              value={ideaForm.supervisor} 
              onChange={handleIdeaChange} 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              required
            >
              <option value="">Select Supervisor</option>
              {facultyList.map(f => (
                <option key={f.id} value={f.name}>{f.name} ({f.domain})</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
              disabled={loading}
            >
              Submit Idea
            </button>
          </div>
        </form>
      </div>

      {/* Submitted Ideas Section */}
      {submittedIdeas.length > 0 && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Your Submitted Ideas</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {submittedIdeas.map((idea) => (
              <div key={idea.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">{idea.title}</h3>
                    <p className="text-gray-600 mt-1">{idea.description}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <p><span className="font-medium">Supervisor:</span> {idea.supervisor}</p>
                      <p><span className="font-medium">Submitted:</span> {formatDate(idea.submittedAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(idea.status)}`}>
                      {idea.status}
                    </span>
                    <button
                      onClick={() => handleDeleteProposal(idea.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Student;