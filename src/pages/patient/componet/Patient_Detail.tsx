import { useLocation, useNavigate } from "react-router-dom";
import type { IPatient } from "./helper/interface";
import Back from "../../../component/global/back/back";

const PatientDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const data: IPatient = location.state as IPatient;

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Back />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-4">No Patient Data Found</h1>
          <p className="text-slate-600 mb-6">The patient details could not be loaded. Please go back and try again.</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 text-white rounded-xl transition-all duration-200 font-semibold"
            style={{
              background: "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)"
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-50 text-green-700 border-green-200" 
      : "bg-slate-50 text-slate-600 border-slate-200";
  };

  const getGenderColor = (gender: string) => {
    const colors = {
      MALE: "bg-blue-50 text-blue-700 border-blue-200",
      FEMALE: "bg-pink-50 text-pink-700 border-pink-200",
      OTHER: "bg-purple-50 text-purple-700 border-purple-200"
    };
    return colors[gender as keyof typeof colors] || "bg-slate-50 text-slate-700 border-slate-200";
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    return "bg-red-50 text-red-700 border-red-200";
  };

  const age = calculateAge(data.dateOfBirth);

  return (
    <div className="max-w-6xl mx-auto my-10">
      <div className="mb-6">
        <Back />
      </div>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8" style={{
        background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)"
      }}>
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg" style={{
              background: "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)"
            }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">{data.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(data.isActive)}`}>
                  {data.isActive ? "Active Patient" : "Inactive"}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGenderColor(data.gender)}`}>
                  {data.gender.toLowerCase()}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBloodGroupColor(data.bloodGroup)}`}>
                  {data.bloodGroup}
                </span>
                {data.oneTimeFlag && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    One-Time Visit
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="bg-slate-50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-800">{age}</p>
              <p className="text-sm text-slate-600">Years Old</p>
            </div>
            <div className="text-center text-sm text-slate-500">
              Patient ID: <span className="font-mono font-semibold">#{data.id}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 xl:col-span-1" style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)"
        }}>
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
              background: "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)"
            }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            Personal Information
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{
                background: "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)"
              }}>
                <span className="text-sm font-semibold text-white">
                  {data.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-slate-800">{data.name}</p>
                <p className="text-sm text-slate-500">Patient</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Gender</label>
                  <p className="text-sm font-semibold text-slate-800 capitalize">{data.gender.toLowerCase()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Age</label>
                  <p className="text-sm font-semibold text-slate-800">{age} years</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Date of Birth</label>
                <p className="text-sm text-slate-800">{formatDate(data.dateOfBirth)}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Blood Group</label>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getBloodGroupColor(data.bloodGroup)}`}>
                  {data.bloodGroup}
                </span>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Contact</label>
                <p className="text-sm font-semibold text-slate-800">{data.contactNumber}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Email</label>
                <p className="text-sm text-slate-800 break-all">{data.email}</p>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Address</label>
                <p className="text-sm text-slate-800">{data.address || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Medical & Registration Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 xl:col-span-1" style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)"
        }}>
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
              background: "linear-gradient(135deg, #0369a1 0%, #7c3aed 100%)"
            }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z" />
              </svg>
            </div>
            Medical Information
          </h2>

          <div className="space-y-4">
            {/* Status Information */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Patient Status</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(data.isActive)}`}>
                  {data.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                {data.isActive 
                  ? "This patient is currently active and can schedule appointments"
                  : "This patient is inactive and cannot schedule new appointments"
                }
              </p>
            </div>

            {/* Visit Type */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-700">Visit Type</span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.oneTimeFlag 
                    ? "bg-amber-50 text-amber-700 border border-amber-200" 
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {data.oneTimeFlag ? "One-Time Visit" : "Regular Patient"}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                {data.oneTimeFlag 
                  ? "This patient is registered for a single visit only"
                  : "This patient is a regular patient with ongoing care"
                }
              </p>
            </div>

            {/* Blood Group Info */}
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-red-100">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800">Blood Group: {data.bloodGroup}</p>
                  <p className="text-xs text-slate-600">Critical medical information</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Registration Details */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 xl:col-span-1" style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)"
        }}>
          <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{
              background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
            }}>
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            Registration Details
          </h2>

          <div className="space-y-4">
            {/* Registered By Staff */}
            {data.staffRegisteredBy && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Registered by Staff</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                  }}>
                    <span className="text-xs font-semibold text-white">
                      {data.staffRegisteredBy.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{data.staffRegisteredBy.name}</p>
                    <p className="text-xs text-slate-600">{data.staffRegisteredBy.role || "Staff Member"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Registered By Admin */}
            {data.adminRegisteredBy && (
              <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
                <h4 className="text-sm font-semibold text-slate-800 mb-3">Registered by Admin</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
                  }}>
                    <span className="text-xs font-semibold text-white">
                      {data.adminRegisteredBy.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{data.adminRegisteredBy.name}</p>
                    <p className="text-xs text-slate-600">{data.adminRegisteredBy.role || "Administrator"}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-200 bg-white/50">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Registration Date</label>
                <p className="text-sm font-semibold text-slate-800">{formatDateTime(data.createdAt)}</p>
              </div>

              <div className="p-3 rounded-xl border border-slate-200 bg-white/50">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Last Updated</label>
                <p className="text-sm font-semibold text-slate-800">{formatDateTime(data.updatedAt)}</p>
              </div>
            </div>

            {/* Patient ID Card */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white/50">
              <div className="text-center">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Patient ID</p>
                <p className="text-lg font-mono font-bold text-slate-800">#{data.id}</p>
                <p className="text-xs text-slate-500 mt-1">Unique Patient Identifier</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors duration-200 font-semibold"
        >
          Back to List
        </button>
        <button
          onClick={() => navigate(`/patients/edit/${data.id}`, { state: data })}
          className="px-6 py-3 text-white rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          style={{
            background: "linear-gradient(135deg, #0d9488 0%, #0369a1 100%)"
          }}
        >
          Edit Patient Details
        </button>
        <button
          onClick={() => navigate(`/appointment/create`, { state: { patient: data } })}
          className="px-6 py-3 text-white rounded-xl transition-all duration-200 font-semibold shadow-sm hover:shadow-md"
          style={{
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)"
          }}
        >
          Schedule Appointment
        </button>
      </div>
    </div>
  );
};

export default PatientDetail;