
import React from 'react';
import type { ConversionOptions, ConversionFormat } from '../types';

interface ConversionSettingsProps {
  options: ConversionOptions;
  setOptions: React.Dispatch<React.SetStateAction<ConversionOptions>>;
  disabled: boolean;
}

const ConversionSettings: React.FC<ConversionSettingsProps> = ({ options, setOptions, disabled }) => {
  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions(prev => ({ ...prev, format: e.target.value as ConversionFormat }));
  };

  const handleQualityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, quality: parseFloat(e.target.value) }));
  };

  const handleResizeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptions(prev => ({ ...prev, resize: e.target.checked }));
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOptions(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const isQualityApplicable = options.format === 'jpeg' || options.format === 'webp';

  return (
    <div className="bg-slate-800/50 rounded-lg p-6 space-y-6">
      <h3 className="text-lg font-semibold text-white">Conversion Settings</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Format Selection */}
        <div>
          <label htmlFor="format" className="block text-sm font-medium text-slate-300 mb-2">
            Target Format
          </label>
          <select
            id="format"
            name="format"
            value={options.format}
            onChange={handleFormatChange}
            disabled={disabled}
            className="w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
            <option value="webp">WebP</option>
            <option value="gif">GIF (Static)</option>
          </select>
        </div>

        {/* Quality Slider */}
        <div className={`transition-opacity duration-300 ${isQualityApplicable ? 'opacity-100' : 'opacity-40'}`}>
          <label htmlFor="quality" className="block text-sm font-medium text-slate-300 mb-2">
            Quality ({Math.round(options.quality * 100)}%)
          </label>
          <input
            id="quality"
            type="range"
            min="0.1"
            max="1"
            step="0.05"
            value={options.quality}
            onChange={handleQualityChange}
            disabled={disabled || !isQualityApplicable}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:cursor-not-allowed"
          />
        </div>
      </div>
      
      {/* Resize Options */}
      <div className="pt-4 border-t border-slate-700">
        <div className="flex items-center">
          <input
            id="resize"
            name="resize"
            type="checkbox"
            checked={options.resize}
            onChange={handleResizeToggle}
            disabled={disabled}
            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500 disabled:opacity-50"
          />
          <label htmlFor="resize" className="ml-3 text-sm font-medium text-slate-300">
            Resize Image
          </label>
        </div>
        <div className={`grid grid-cols-2 gap-4 mt-4 transition-all duration-300 ${options.resize ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div>
            <label htmlFor="width" className="block text-sm font-medium text-slate-400 mb-1">
              Width (px)
            </label>
            <input
              type="number"
              name="width"
              id="width"
              value={options.width}
              onChange={handleDimensionChange}
              disabled={disabled || !options.resize}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="height" className="block text-sm font-medium text-slate-400 mb-1">
              Height (px)
            </label>
            <input
              type="number"
              name="height"
              id="height"
              value={options.height}
              onChange={handleDimensionChange}
              disabled={disabled || !options.resize}
              className="w-full bg-slate-700 border border-slate-600 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversionSettings;
