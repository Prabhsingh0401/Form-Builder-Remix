import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';

const FieldEditor = ({ field, onUpdate, onClose, darkMode }) => {
  const [localField, setLocalField] = useState(field);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleSave = () => {
    onUpdate(localField);
    onClose();
  };

  const addOption = () => {
    const options = localField.options || [];
    setLocalField({
      ...localField,
      options: [...options, `Option ${options.length + 1}`]
    });
  };

  const updateOption = (index, value) => {
    const options = [...localField.options];
    options[index] = value;
    setLocalField({ ...localField, options });
  };

  const removeOption = (index) => {
    const options = localField.options.filter((_, i) => i !== index);
    setLocalField({ ...localField, options });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md max-h-full overflow-hidden rounded-2xl shadow-2xl border ${
        darkMode 
          ? 'bg-gray-900 bg-opacity-95 border-gray-700 border-opacity-50 text-gray-100' 
          : 'bg-white bg-opacity-95 border-gray-200 border-opacity-50 text-gray-900'
      } backdrop-blur-xl transform transition-all duration-300 ease-out flex flex-col`}>
        
        {/* Header */}
        <div className={`px-6 py-5 border-b ${
          darkMode ? 'border-gray-700 border-opacity-50' : 'border-gray-200 border-opacity-50'
        }`}>
          <h3 className={`text-xl font-semibold ${
            darkMode 
              ? 'text-purple-400' 
              : 'text-purple-600'
          }`}>
            Edit Field
          </h3>
        </div>
        
        {/* Content */}
        <div className="px-6 py-5 overflow-y-auto scrollbar-hide flex-1">
          <div className="space-y-6">
            
            {/* Label Input */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Label
              </label>
              <input
                type="text"
                value={localField.label}
                onChange={(e) => setLocalField({ ...localField, label: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-800 bg-opacity-50 border-gray-600 border-opacity-50 focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-20' 
                    : 'bg-gray-50 bg-opacity-50 border-gray-300 border-opacity-50 focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-20'
                }`}
              />
            </div>
            
            {/* Placeholder Input */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Placeholder
              </label>
              <input
                type="text"
                value={localField.placeholder || ''}
                onChange={(e) => setLocalField({ ...localField, placeholder: e.target.value })}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${
                  darkMode 
                    ? 'bg-gray-800 bg-opacity-50 border-gray-600 border-opacity-50 focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-20' 
                    : 'bg-gray-50 bg-opacity-50 border-gray-300 border-opacity-50 focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-20'
                }`}
              />
            </div>
            
            {/* Required Checkbox */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <input
                  type="checkbox"
                  id="required"
                  checked={localField.required}
                  onChange={(e) => setLocalField({ ...localField, required: e.target.checked })}
                  className="sr-only"
                />
                <label 
                  htmlFor="required"
                  className={`flex items-center justify-center w-5 h-5 rounded-md border-2 cursor-pointer transition-all duration-200 ${
                    localField.required
                      ? darkMode 
                        ? 'bg-cyan-500 border-cyan-500' 
                        : 'bg-purple-500 border-purple-500'
                      : darkMode
                        ? 'border-gray-600 hover:border-cyan-400'
                        : 'border-gray-300 hover:border-purple-400'
                  }`}
                >
                  {localField.required && (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              </div>
              <label htmlFor="required" className="text-sm font-medium cursor-pointer">
                Required field
              </label>
            </div>
            
            {/* Help Text */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Help Text
              </label>
              <textarea
                value={localField.helpText || ''}
                onChange={(e) => setLocalField({ ...localField, helpText: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 resize-none ${
                  darkMode 
                    ? 'bg-gray-800 bg-opacity-50 border-gray-600 border-opacity-50 focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-20' 
                    : 'bg-gray-50 bg-opacity-50 border-gray-300 border-opacity-50 focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-20'
                }`}
                placeholder="Optional help text for users..."
              />
            </div>
            
            {/* Options Section */}
            {(localField.type === 'select' || localField.type === 'radio' || localField.type === 'checkbox') && (
              <div className="space-y-3">
                <label className={`block text-sm font-medium ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Options
                </label>
                <div className="space-y-3">
                  {localField.options?.map((option, index) => (
                    <div key={index} className="group flex items-center space-x-3">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        className={`flex-1 px-4 py-2.5 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 ${
                          darkMode 
                            ? 'bg-gray-800 bg-opacity-50 border-gray-600 border-opacity-50 focus:border-cyan-500 focus:ring-cyan-500 focus:ring-opacity-20' 
                            : 'bg-gray-50 bg-opacity-50 border-gray-300 border-opacity-50 focus:border-purple-500 focus:ring-purple-500 focus:ring-opacity-20'
                        }`}
                      />
                      <button
                        onClick={() => removeOption(index)}
                        className={`p-2.5 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 ${
                          darkMode
                            ? 'text-red-400 hover:bg-red-500 hover:bg-opacity-20 hover:text-red-300'
                            : 'text-red-500 hover:bg-red-500 hover:bg-opacity-10 hover:text-red-600'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    onClick={addOption}
                    className={`w-full py-3 px-4 border-2 border-dashed rounded-xl transition-all duration-200 font-medium ${
                      darkMode 
                        ? 'border-gray-600 border-opacity-50 hover:border-purple-500 hover:border-opacity-50 text-purple-400 hover:bg-purple-500 hover:bg-opacity-5' 
                        : 'border-gray-300 border-opacity-50 hover:border-purple-500 hover:border-opacity-50 text-purple-600 hover:bg-purple-500 hover:bg-opacity-5'
                    }`}
                  >
                    <Plus size={16} className="inline mr-2" />
                    Add Option
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className={`px-6 py-4 border-t flex space-x-3 flex-shrink-0 ${
          darkMode ? 'border-gray-700 border-opacity-50 bg-gray-900 bg-opacity-50' : 'border-gray-200 border-opacity-50 bg-gray-50 bg-opacity-50'
        }`}>
          <button
            onClick={handleSave}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
              darkMode 
                ? 'bg-purple-600 text-white' 
                : 'bg-purple-600 text-white'
            }`}
          >
            Save Changes
          </button>
          <button
            onClick={onClose}
            className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 ${
              darkMode 
                ? 'bg-gray-700 bg-opacity-50 hover:bg-gray-700 hover:bg-opacity-70 text-gray-300 border border-gray-600 border-opacity-50' 
                : 'bg-gray-100 bg-opacity-50 hover:bg-gray-200 hover:bg-opacity-50 text-gray-700 border border-gray-300 border-opacity-50'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default FieldEditor;