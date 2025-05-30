import { useState, useEffect } from 'react';
import { BarChart3, Download, ArrowLeft } from 'lucide-react';

const ResponseViewer = ({ darkMode, setDarkMode, onBack }) => {
  const [responses, setResponses] = useState([]);
  const [form, setForm] = useState(null);
  const [forms, setForms] = useState({});
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [formResponses, setFormResponses] = useState({});

  useEffect(() => {
    try {
      // Load all forms and responses from localStorage
      const storedResponses = JSON.parse(localStorage.getItem('formResponses') || '{}');
      const formData = JSON.parse(localStorage.getItem('formBuilderForms') || '{}');
      const sharedForms = JSON.parse(localStorage.getItem('sharedForms') || '{}');
      
      const allForms = { ...formData, ...sharedForms };
      setForms(allForms);
      setFormResponses(storedResponses);
      
      if (selectedFormId) {
        setResponses(storedResponses[selectedFormId] || []);
        setForm(allForms[selectedFormId]);
      }
    } catch (error) {
      console.warn('Failed to load forms or responses:', error);
    }
  }, [selectedFormId]);

  const handleFormSelect = (formId) => {
    setSelectedFormId(formId);
  };

  const exportToCSV = () => {
    if (!responses.length || !form) return;

    try {
      const headers = form.fields.map(field => field.label);
      const csvContent = [
        ['Timestamp', ...headers].join(','),
        ...responses.map(response => [
          new Date(response.timestamp).toLocaleString(),
          ...form.fields.map(field => {
            const value = response.responses[field.id];
            if (Array.isArray(value)) {
              return `"${value.join(', ')}"`;
            }
            return `"${value || ''}"`;
          })
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${form.title}-responses.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.warn('Failed to export CSV:', error);
    }
  };

  // If no form is selected, show the form selection screen
  if (!selectedFormId) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
        <header className={`px-6 py-4 ${
          darkMode 
            ? 'bg-gray-900 border-b border-gray-700/50' 
            : 'bg-white/70 backdrop-blur-md border-b border-gray-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className={`text-2xl font-bold ${
                darkMode ? 'text-purple-400' : 'text-gray-800'
              }`}>
                Form Responses
              </h2>
            </div>
            
            <div className="flex items-center space-x-3">
              {onBack && (
                <button
                  onClick={onBack}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                    darkMode 
                      ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white border border-gray-700/50' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 backdrop-blur-sm'
                  }`}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Builder</span>
                </button>
              )}
              
              <div className="w-px h-8 bg-gray-300 dark:bg-gray-700"></div>
              
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full ${
                  darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                    />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>
        
        <div className="p-6">
          <p className={`mb-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Select a form to view responses
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(forms).map(([id, formData]) => {
              const responseCount = (formResponses[id] || []).length;
              
              return (
                <div
                  key={id}
                  onClick={() => handleFormSelect(id)}
                  className={`p-6 rounded-xl border cursor-pointer transition-all ${
                    darkMode 
                      ? 'border-gray-700 hover:border-gray-600 bg-gray-800 hover:bg-gray-700' 
                      : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 shadow-sm'
                  }`}
                >
                  <h3 className="text-lg font-semibold mb-2">{formData.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {formData.fields?.length || 0} fields
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      responseCount > 0
                        ? darkMode 
                          ? 'bg-green-900 text-green-300' 
                          : 'bg-green-100 text-green-800'
                        : darkMode
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-100 text-gray-600'
                    }`}>
                      {responseCount} {responseCount === 1 ? 'response' : 'responses'}
                    </span>
                  </div>
                </div>
              );
            })}

            {Object.keys(forms).length === 0 && (
              <div className={`col-span-3 text-center py-12 ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg">No forms found</p>
                <p>Create a form first to collect responses</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <header className={`px-6 py-4 ${
        darkMode 
          ? 'bg-gray-900 border-b border-gray-700/50' 
          : 'bg-white/70 backdrop-blur-md border-b border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedFormId(null)}
              className={`p-2 rounded-lg transition-colors ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className={`text-2xl font-bold ${
              darkMode ? 'text-purple-400' : 'text-gray-800'
            }`}>
              {form?.title}
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs ${
              darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
            }`}>
              {responses.length} {responses.length === 1 ? 'response' : 'responses'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            {responses.length > 0 && (
              <button
                onClick={exportToCSV}
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-green-700 hover:bg-green-600 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                <Download size={16} />
                <span>Export CSV</span>
              </button>
            )}
            
            {onBack && (
              <button
                onClick={onBack}
                className={`px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2 ${
                  darkMode 
                    ? 'bg-gray-800/60 hover:bg-gray-700/60 text-gray-300 hover:text-white border border-gray-700/50' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200'
                }`}
              >
                <ArrowLeft size={16} />
                <span>Back to Builder</span>
              </button>
            )}
            
            <div className="w-px h-8 bg-gray-300 dark:bg-gray-700"></div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-100 text-gray-700'
              }`}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      <div className="p-6">
        {responses.length === 0 ? (
          <div className={`text-center py-12 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No responses yet</p>
            <p>Share your form to start collecting responses</p>
          </div>
        ) : (
          <div className={`overflow-x-auto rounded-lg border shadow-lg ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <table className={`w-full ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <thead className={`${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}>
                <tr>
                  <th className={`px-4 py-3 text-left text-sm font-medium ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Timestamp
                  </th>
                  {form?.fields?.map((field) => (
                    <th
                      key={field.id}
                      className={`px-4 py-3 text-left text-sm font-medium ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      {field.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${
                darkMode ? 'divide-gray-700' : 'divide-gray-200'
              }`}>
                {responses.map((response) => (
                  <tr key={response.id}>
                    <td className={`px-4 py-3 text-sm ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {new Date(response.timestamp).toLocaleString()}
                    </td>
                    {form?.fields?.map((field) => (
                      <td
                        key={field.id}
                        className={`px-4 py-3 text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}
                      >
                        {Array.isArray(response.responses[field.id])
                          ? response.responses[field.id].join(', ')
                          : response.responses[field.id] || '-'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResponseViewer;
