import React, { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseconfig';

ChartJS.register(...registerables);

function Admin() {
  // State for all data
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [evaluationSlots, setEvaluationSlots] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [newComment, setNewComment] = useState('');
  const [commentProjectId, setCommentProjectId] = useState(null);
  const [newSlot, setNewSlot] = useState({ faculty: '', date: '', time: '' });
  const [showFacultyForm, setShowFacultyForm] = useState(false);
  const [newFaculty, setNewFaculty] = useState({
    name: '', email: '', domain: '', slots: 0, officeHours: ''
  });

  // Fetch data from Firebase
  useEffect(() => {
    const fetchData = async () => {
      // Fetch faculty
      const facultySnapshot = await getDocs(collection(db, 'faculty'));
      const facultyData = facultySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setFacultyMembers(facultyData);

      // Fetch projects
      const projectsSnapshot = await getDocs(collection(db, 'proposals'));
      const projectsData = projectsSnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        comments: doc.data().comments || []
      }));
      setProjects(projectsData);

      // Fetch evaluation slots
      const slotsSnapshot = await getDocs(collection(db, 'evaluationSlots'));
      const slotsData = slotsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEvaluationSlots(slotsData);
    };

    fetchData();
  }, []);

  // Project management functions
  const updateProjectStatus = async (projectId, status) => {
    try {
      await updateDoc(doc(db, 'proposals', projectId), { status });
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status } : project
      ));
    } catch (error) {
      console.error("Error updating project status: ", error);
    }
  };

  const addComment = async (projectId) => {
    if (!newComment.trim()) return;
    
    const comment = {
      text: newComment,
      author: 'Admin',
      date: new Date().toISOString().split('T')[0]
    };
    
    try {
      const projectRef = doc(db, 'proposals', projectId);
      await updateDoc(projectRef, {
        comments: [...projects.find(p => p.id === projectId).comments, comment]
      });
      
      setProjects(projects.map(project => 
        project.id === projectId 
          ? { ...project, comments: [...project.comments, comment] } 
          : project
      ));
      
      setNewComment('');
      setCommentProjectId(null);
    } catch (error) {
      console.error("Error adding comment: ", error);
    }
  };

  // Faculty management functions
  const addFacultyMember = async () => {
    try {
      const docRef = await addDoc(collection(db, 'faculty'), {
        ...newFaculty,
        slots: parseInt(newFaculty.slots)
      });
      
      setFacultyMembers([...facultyMembers, { id: docRef.id, ...newFaculty }]);
      setNewFaculty({
        name: '', email: '', domain: '', slots: 0, officeHours: ''
      });
      setShowFacultyForm(false);
    } catch (error) {
      console.error("Error adding faculty: ", error);
    }
  };

  const deleteFacultyMember = async (id) => {
    try {
      await deleteDoc(doc(db, 'faculty', id));
      setFacultyMembers(facultyMembers.filter(member => member.id !== id));
      
      // Also delete any evaluation slots for this faculty
      const slotsToDelete = evaluationSlots.filter(slot => slot.facultyId === id);
      for (const slot of slotsToDelete) {
        await deleteDoc(doc(db, 'evaluationSlots', slot.id));
      }
      setEvaluationSlots(evaluationSlots.filter(slot => slot.facultyId !== id));
    } catch (error) {
      console.error("Error deleting faculty: ", error);
    }
  };

  // Evaluation slot functions
  const addEvaluationSlot = async () => {
    try {
      const faculty = facultyMembers.find(f => f.name === newSlot.faculty);
      if (!faculty) return;
      
      const docRef = await addDoc(collection(db, 'evaluationSlots'), {
        faculty: newSlot.faculty,
        facultyId: faculty.id,
        date: newSlot.date,
        time: newSlot.time,
        status: 'available'
      });
      
      setEvaluationSlots([...evaluationSlots, { 
        id: docRef.id, 
        faculty: newSlot.faculty,
        facultyId: faculty.id,
        date: newSlot.date,
        time: newSlot.time,
        status: 'available'
      }]);
      setNewSlot({ faculty: '', date: '', time: '' });
    } catch (error) {
      console.error("Error adding evaluation slot: ", error);
    }
  };

  const deleteEvaluationSlot = async (id) => {
    try {
      await deleteDoc(doc(db, 'evaluationSlots', id));
      setEvaluationSlots(evaluationSlots.filter(slot => slot.id !== id));
    } catch (error) {
      console.error("Error deleting evaluation slot: ", error);
    }
  };

  // Chart data
  const projectsByStatusData = {
    labels: ['Approved', 'Pending', 'Revision', 'Rejected'],
    datasets: [{
      label: 'Projects by Status',
      data: [
        projects.filter(p => p.status === 'approved').length,
        projects.filter(p => p.status === 'pending').length,
        projects.filter(p => p.status === 'revision').length,
        projects.filter(p => p.status === 'rejected').length
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ]
    }]
  };

  const facultySlotsData = {
    labels: facultyMembers.map(f => f.name),
    datasets: [{
      label: 'Available Slots',
      data: facultyMembers.map(f => f.slots),
      backgroundColor: 'rgba(153, 102, 255, 0.6)'
    }]
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
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
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">FYP Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Admin Navigation */}
        <div className="bg-white shadow rounded-lg mb-6">
          <nav className="flex space-x-4 p-4 overflow-x-auto">
            <button onClick={() => setActiveTab('dashboard')} className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'dashboard' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Dashboard
            </button>
            <button onClick={() => setActiveTab('faculty')} className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'faculty' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Faculty Management
            </button>
            <button onClick={() => setActiveTab('projects')} className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'projects' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Project Approvals
            </button>
            <button onClick={() => setActiveTab('evaluations')} className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap ${activeTab === 'evaluations' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}>
              Evaluation Slots
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Projects by Status</h3>
                <div className="h-64">
                  <Pie data={projectsByStatusData} options={{ maintainAspectRatio: false }} />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-medium mb-4">Faculty Availability</h3>
                <div className="h-64">
                  <Bar data={facultySlotsData} options={{ 
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1
                        }
                      }
                    }
                  }} />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-4">Recent Activities</h3>
              <div className="space-y-4">
                {projects.slice(0, 5).map(project => (
                  <div key={project.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{project.title}</p>
                        <p className="text-sm text-gray-500">
                          {project.studentName} with {project.supervisor}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Faculty Management Tab */}
        {activeTab === 'faculty' && (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Faculty Members</h3>
              <button 
                onClick={() => setShowFacultyForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                Add New Faculty
              </button>
            </div>

            {showFacultyForm && (
              <div className="p-6 border-b border-gray-200">
                <h4 className="text-md font-medium mb-4">Add New Faculty Member</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.name}
                      onChange={(e) => setNewFaculty({...newFaculty, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.email}
                      onChange={(e) => setNewFaculty({...newFaculty, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.domain}
                      onChange={(e) => setNewFaculty({...newFaculty, domain: e.target.value})}
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
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.slots}
                      onChange={(e) => setNewFaculty({...newFaculty, slots: e.target.value})}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Hours</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      value={newFaculty.officeHours}
                      onChange={(e) => setNewFaculty({...newFaculty, officeHours: e.target.value})}
                      placeholder="Example: Mon 10-12, Wed 2-4"
                    />
                  </div>
                </div>
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowFacultyForm(false);
                      setNewFaculty({ name: '', email: '', domain: '', slots: 0, officeHours: '' });
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addFacultyMember}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Add Faculty
                  </button>
                </div>
              </div>
            )}

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
                  {facultyMembers.map(faculty => (
                    <tr key={faculty.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                            {faculty.name.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{faculty.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getDomainColor(faculty.domain)}`}>
                          {faculty.domain}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="font-medium">{faculty.slots}</span> available
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{faculty.officeHours}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => deleteFacultyMember(faculty.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Project Approvals Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Project Approvals</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {projects.map(project => (
                  <div key={project.id} className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-md font-medium">{project.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Student: {project.studentName} | Supervisor: {project.supervisor}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">{project.description}</p>
                        {project.comments.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-sm font-medium text-gray-700">Comments:</h5>
                            <ul className="mt-1 space-y-2">
                              {project.comments.map((comment, idx) => (
                                <li key={idx} className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                  <span className="font-medium">{comment.author}</span> ({comment.date}): {comment.text}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => updateProjectStatus(project.id, 'approved')}
                          className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => {
                            setCommentProjectId(project.id);
                            updateProjectStatus(project.id, 'revision');
                          }}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Request Revision
                        </button>
                        <button
                          onClick={() => updateProjectStatus(project.id, 'rejected')}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>

                    {commentProjectId === project.id && (
                      <div className="mt-4">
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          rows="3"
                          placeholder="Enter your comments..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                        ></textarea>
                        <div className="mt-2 flex justify-end space-x-2">
                          <button
                            onClick={() => {
                              setNewComment('');
                              setCommentProjectId(null);
                            }}
                            className="px-3 py-1 border border-gray-300 text-sm rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => addComment(project.id)}
                            className="px-3 py-1 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                          >
                            Submit Comment
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Evaluation Slots Tab */}
        {activeTab === 'evaluations' && (
          <div className="space-y-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Evaluation Slots</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h4 className="text-md font-medium mb-4">Available Slots</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Faculty</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {evaluationSlots.map(slot => (
                            <tr key={slot.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.faculty || 'Unassigned'}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.date}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{slot.time}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  slot.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {slot.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button
                                  onClick={() => deleteEvaluationSlot(slot.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium mb-4">Create New Slot</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newSlot.faculty}
                          onChange={(e) => setNewSlot({...newSlot, faculty: e.target.value})}
                        >
                          <option value="">Select Faculty</option>
                          {facultyMembers.map(faculty => (
                            <option key={faculty.id} value={faculty.name}>{faculty.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newSlot.date}
                          onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                          type="time"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          value={newSlot.time}
                          onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                        />
                      </div>
                      <button
                        onClick={addEvaluationSlot}
                        className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        disabled={!newSlot.date || !newSlot.time}
                      >
                        Create Slot
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Admin;