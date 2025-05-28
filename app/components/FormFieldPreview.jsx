import { useEffect, useState } from 'react';

const FormFieldPreview = ({ field, darkMode }) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const baseInputClasses = `w-full p-3 border rounded-lg transition-all ${
    darkMode 
      ? 'bg-gray-700 border-gray-600 text-gray-200 focus:border-cyan-500' 
      : 'bg-white/70 border-[#c0e6e9]/50 text-gray-900 focus:border-purple-500 backdrop-blur-sm'
  } placeholder-gray-400 shadow-sm`;

  if (!isMounted) {
    return <div className={`${baseInputClasses} h-10`}></div>;
  }

  switch (field.type) {
    case 'text':
    case 'email':
    case 'phone':
      return (
        <input
          type={field.type}
          placeholder={field.placeholder}
          className={baseInputClasses}
          disabled
        />
      );
    
    case 'textarea':
      return (
        <textarea
          placeholder={field.placeholder}
          className={`${baseInputClasses} h-24 resize-none`}
          disabled
        />
      );
    
    case 'select':
      return (
        <div className="relative">
          <select className={`${baseInputClasses} appearance-none`} disabled>
            <option>{field.placeholder || "Choose an option"}</option>
            {field.options?.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      );
    
    case 'checkbox':
      return (
        <div className="space-y-3">
          {field.options?.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                darkMode 
                  ? 'border-gray-500 bg-gray-700' 
                  : 'border-[#c0e6e9]/70 bg-white/50'
              }`}>
                {/* Empty checkbox */}
              </div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{option}</span>
            </label>
          ))}
        </div>
      );
    
    case 'radio':
      return (
        <div className="space-y-3">
          {field.options?.map((option, index) => (
            <label key={index} className="flex items-center space-x-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                darkMode 
                  ? 'border-gray-500 bg-gray-700' 
                  : 'border-[#c0e6e9]/70 bg-white/50'
              }`}>
                {/* Empty radio button */}
              </div>
              <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{option}</span>
            </label>
          ))}
        </div>
      );
    
    case 'date':
      return (
        <div className="relative">
          <input
            type="text"
            placeholder="Select date"
            className={baseInputClasses}
            disabled
          />
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <svg className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      );
    
    case 'number':
      return (
        <input
          type="number"
          placeholder={field.placeholder}
          className={baseInputClasses}
          disabled
        />
      );
    
    default:
      return <div>Unknown field type</div>;
  }
};

export default FormFieldPreview;