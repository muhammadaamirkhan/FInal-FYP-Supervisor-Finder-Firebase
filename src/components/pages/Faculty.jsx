import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    email: '',
    domain: '',
    slots: '',
    officeHours: ''
  });

  const [proposals, setProposals] = useState([]);
  const [activeTab, setActiveTab] = useState('faculty');
  const [loading, setLoading] = useState(false);

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
        setFaculty(facultyData);
      } catch (error) {
        console.error("Error fetching faculty: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaculty();
  }, []);

  // Fetch proposals data from Firestore
  useEffect(() => {
    const fetchProposals = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, 'proposals'));
        const proposalsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProposals(proposalsData);
      } catch (error) {
        console.error("Error fetching proposals: ", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeTab === 'ideas') {
      fetchProposals();
    }
  }, [activeTab]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (formData.id) {
        // Update existing faculty member
        const facultyDoc = doc(db, 'faculty', formData.id);
        await updateDoc(facultyDoc, {
          name: formData.name,
          email: formData.email,
          domain: formData.domain,
          slots: formData.slots,
          officeHours: formData.officeHours
        });
        
        setFaculty(faculty.map(f => f.id === formData.id ? { ...formData } : f));
      } else {
        // Add new faculty member
        const docRef = await addDoc(collection(db, 'faculty'), {
          name: formData.name,
          email: formData.email,
          domain: formData.domain,
          slots: formData.slots,
          officeHours: formData.officeHours
        });
        
        setFaculty([...faculty, { ...formData, id: docRef.id }]);
      }
      
      setFormData({ id: null, name: '', email: '', domain: '', slots: '', officeHours: '' });
    } catch (error) {
      console.error("Error saving faculty: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (facultyMember) => {
    setFormData(facultyMember);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'faculty', id));
      setFaculty(faculty.filter(f => f.id !== id));
    } catch (error) {
      console.error("Error deleting faculty: ", error);
    } finally {
      setLoading(false);
    }
  };

  const updateProposalStatus = async (id, status) => {
    setLoading(true);
    try {
      const proposalDoc = doc(db, 'proposals', id);
      await updateDoc(proposalDoc, { status });
      
      setProposals(proposals.map(proposal => 
        proposal.id === id ? { ...proposal, status } : proposal
      ));
    } catch (error) {
      console.error("Error updating proposal status: ", error);
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

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Faculty Management</h1>
        <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('faculty')} 
            className={`px-4 py-2 rounded-md ${activeTab === 'faculty' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          >
            Faculty
          </button>
          <button 
            onClick={() => setActiveTab('ideas')} 
            className={`px-4 py-2 rounded-md ${activeTab === 'ideas' ? 'bg-white shadow-sm' : 'text-gray-600'}`}
          >
            FYP Proposals
          </button>
        </div>
      </div>

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

      {activeTab === 'faculty' && (
        <>
          {/* Faculty Form */}
          <div className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">
              {formData.id ? 'Edit Faculty Member' : 'Add New Faculty Member'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleInputChange} 
                    placeholder="Full Name" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="Email Address" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                  <select
                    name="domain" 
                    value={formData.domain} 
                    onChange={handleInputChange} 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required
                  >
                    <option value="">Select Domain</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Available Slots</label>
                  <input 
                    type="number" 
                    name="slots" 
                    value={formData.slots} 
                    onChange={handleInputChange} 
                    placeholder="Number of Slots" 
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                  <input 
                    type="text" 
                    name="officeHours" 
                    value={formData.officeHours} 
                    onChange={handleInputChange} 
                    placeholder="e.g., Mon 10-12, Wed 2-4" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    required 
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3">
                {formData.id && (
                  <button 
                    type="button"
                    onClick={() => setFormData({ id: null, name: '', email: '', domain: '', slots: '', officeHours: '' })}
                    className="px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button 
                  type="submit" 
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
                  disabled={loading}
                >
                  {formData.id ? 'Update Faculty' : 'Add Faculty'}
                </button>
              </div>
            </form>
          </div>

          {/* Faculty List */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Faculty Members</h2>
              <span className="text-sm text-gray-500">{faculty.length} faculty members</span>
            </div>
            {faculty.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No faculty members found. Add your first faculty member above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slots</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Office Hours</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {faculty.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{member.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDomainColor(member.domain)}`}>
                            {member.domain}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className={`h-2 w-2 rounded-full mr-2 ${member.slots > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                            {member.slots}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">{member.officeHours}</td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button 
                            onClick={() => handleEdit(member)} 
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(member.id)} 
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'ideas' && (
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">FYP Proposal Submissions</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Supervisor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {proposals.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                      No proposals submitted yet.
                    </td>
                  </tr>
                ) : (
                  proposals.map((proposal) => (
                    <tr key={proposal.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{proposal.title}</td>
                      <td className="px-6 py-4 text-gray-500 max-w-xs truncate">{proposal.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{proposal.studentName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{proposal.supervisor}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(proposal.status)}`}>
                          {proposal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap space-x-2">
                        <button 
                          onClick={() => updateProposalStatus(proposal.id, 'accepted')} 
                          className="text-green-600 hover:text-green-800 font-medium"
                        >
                          Accept
                        </button>
                        <button 
                          onClick={() => updateProposalStatus(proposal.id, 'rejected')} 
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => updateProposalStatus(proposal.id, 'revision')} 
                          className="text-yellow-600 hover:text-yellow-800 font-medium"
                        >
                          Revision
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Faculty;

