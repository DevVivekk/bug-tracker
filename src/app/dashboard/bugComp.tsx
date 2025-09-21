import callApi from '@/helpers/apiHit'
import React, { useEffect, useState } from 'react'

interface bugdata {
  title: string | "",
  description: string | "",
  severity: string | "",
  remark?: string | "",
  status?: string | ""
  createdAt?:Date | "",
  updatedAt?:Date | "",
  _id: string | ""
}

interface bugReporter {
  username: string,
  email: string
}

interface bugInterface {
  isEditing: boolean,
  isAdmin: boolean,
  data: bugdata,
  isAdd:boolean
  reporter?: bugReporter,
  fn: (showedit?:boolean) => Promise<void>
}

const BugComp: React.FC<bugInterface> = ({ isEditing,isAdd, isAdmin, data, reporter,fn }) => {
  console.log(isEditing)
  const [bugdata, setBugData] = useState<bugdata>({ title: "", description: "", severity: "", remark: "", status: "", _id: "" })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if(isAdd) return;
    if (!isAdmin) {
      setBugData({ title: data?.title, description: data.description, severity: data.severity, _id: data._id })
    } else {
      setBugData({
        title: data.title,
        description: data.description,
        severity: data.severity,
        status: data?.status ? data.status : "",
        remark: data?.remark ? data.remark : "",
        _id: data._id
      })
    }
  }, [isAdmin, isEditing, data, isAdd])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBugData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const tempdata = {...bugdata,bugid:bugdata._id}; //deep cpy
    const dataa = {method:"POST",data:tempdata,path:isAdmin?`${process.env.NEXT_PUBLIC_URL}/server/api/v1/admin/update-bug`:`${process.env.NEXT_PUBLIC_URL}/server/api/v1/reporter/submit-bug`}
    const ans = await callApi(dataa);
    if(ans.status){
      await fn(isAdd?true:false) //close the edit after adding
      alert(ans.message)
    }else{
      alert(ans.message)
    }
    setIsSubmitting(false);
   // console.log(ans)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'extreme': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-100 text-gray-800'
      case 'onhold': return 'bg-blue-100 text-blue-800'
      case 'closed': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if(isAdd){
    return(
          <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin || isEditing ? 'Edit Bug Report' : 'Report a New Bug'}
            </h2>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(bugdata.severity)}`}>
              {bugdata.severity.charAt(0).toUpperCase() + bugdata.severity.slice(1)}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Bug Title
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="title"
                value={bugdata.title}
                placeholder="Enter bug title"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                onChange={handleChange}
                name="description"
                value={bugdata.description}
                placeholder="Describe the bug in detail"
                rows={4}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severity Level
              </label>
              <select
                onChange={handleChange}
                value={bugdata.severity}
                name="severity"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Submit Bug Report</>
              )}
            </button>
          </div>
        </form>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-2xl">
      {isAdd?
      <>
      <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin ? 'Edit Bug Report' : 'Report a New Bug'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Bug Title
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="title"
                value={bugdata.title}
                placeholder="Enter bug title"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                onChange={handleChange}
                name="description"
                value={bugdata.description}
                placeholder="Describe the bug in detail"
                rows={4}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severity Level
              </label>
              <select
                onChange={handleChange}
                value={bugdata.severity}
                name="severity"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>

            {isAdmin && (
              <>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    onChange={handleChange}
                    value={bugdata.status || ''}
                    name="status"
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="open">Open</option>
                    <option value="onhold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="remark" className="block text-black text-sm font-medium mb-1">
                    Remarks
                  </label>
                  <textarea
                    onChange={handleChange}
                    name="remark"
                    value={bugdata.remark || ''}
                    placeholder="Add any remarks or notes"
                    rows={3}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Submit Bug Report</>
              )}
            </button>
          </div>
        </form>
      </>
      :null
     }
      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fadeIn min-w-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {isAdmin ? 'Edit Bug Report' : 'Report a New Bug'}
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Bug Title
              </label>
              <input
                onChange={handleChange}
                type="text"
                name="title"
                value={bugdata.title}
                placeholder="Enter bug title"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                onChange={handleChange}
                name="description"
                value={bugdata.description}
                placeholder="Describe the bug in detail"
                rows={4}
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            <div>
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
                Severity Level
              </label>
              <select
                onChange={handleChange}
                value={bugdata.severity}
                name="severity"
                className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              >
                <option value="low">Low</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
                <option value="extreme">Extreme</option>
              </select>
            </div>

            {isAdmin && (
              <>
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    onChange={handleChange}
                    value={bugdata.status || ''}
                    name="status"
                    className="w-full text-black px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  >
                    <option value="open">Open</option>
                    <option value="onhold">On Hold</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="remark" className="block text-black text-sm font-medium mb-1">
                    Remarks
                  </label>
                  <textarea
                    onChange={handleChange}
                    name="remark"
                    value={bugdata.remark || ''}
                    placeholder="Add any remarks or notes"
                    rows={3}
                    className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>Submit Bug Report</>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="animate-fadeIn min-w-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Bug Details</h2>
             {/* Date part */}
              <div className='flex flex-col mt-4 text-black'>
              <div className={`px-3 py-1 rounded-full text-sm  font-semibold`}>
              Created: <span>{data.createdAt ? new Date(data.createdAt).toLocaleString() : ""}</span>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-semibold`}>
             Updated: <span>{data.updatedAt ? new Date(data.updatedAt).toLocaleString() : ""}</span>
            </div>
              </div>
          </div>

          <div className="space-y-6">
              <div>
              <p className="text-sm font-medium text-gray-500">Bug Name</p>
              <h2 className="text-xl font-semibold text-gray-800 mt-1">{data.title}</h2>
              </div>

            <div>
              <p className="text-sm font-medium text-gray-500">Bug Description</p>
              <p className="text-gray-700 mt-1 whitespace-pre-line">{data.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Severity</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getSeverityColor(data.severity)}`}>
                  {data.severity.charAt(0).toUpperCase() + data.severity.slice(1)}
                </span>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                {data.status ? (
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(data.status)}`}>
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                  </span>
                ) : (
                  <span className="text-gray-500">Not set</span>
                )}
              </div>
            </div>

            {data.remark && (
              <div>
                <p className="text-sm font-medium text-gray-500">Remarks</p>
                <div className="bg-blue-50 p-4 rounded-lg mt-1">
                  <p className="text-blue-800">{data.remark}</p>
                </div>
              </div>
            )}

            {isAdmin && (
              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-500">Reported By</p>
                <div className="flex items-center mt-2">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-indigo-800 font-semibold">{reporter?.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{reporter?.username}</p>
                    <p className="text-sm text-gray-500">{reporter?.email}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default BugComp