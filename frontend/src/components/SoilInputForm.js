import React from 'react';

const SoilInputForm = ({ soilData, setSoilData }) => {
  const handleChange = (field) => (e) =>
    setSoilData({ ...soilData, [field]: e.target.value });

  return (
    <>
      {/* Timeline Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <div className="flex flex-col items-center w-1/3">
            <div className="rounded-full bg-green-500 text-white w-10 h-10 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="h-1 w-full bg-green-500 mt-2"></div>
            <p className="text-center text-green-700 font-medium mt-2">Add Soil Data</p>
          </div>
          
          {/* Step 2 */}
          <div className="flex flex-col items-center w-1/3">
            <div className="rounded-full bg-gray-300 text-white w-10 h-10 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="h-1 w-full bg-gray-300 mt-2"></div>
            <p className="text-center text-gray-500 font-medium mt-2">Recommend Crops</p>
          </div>
          
          {/* Step 3 */}
          <div className="flex flex-col items-center w-1/3">
            <div className="rounded-full bg-gray-300 text-white w-10 h-10 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="h-1 w-full bg-gray-300 mt-2"></div>
            <p className="text-center text-gray-500 font-medium mt-2">Predict Price</p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Nitrogen (N)</label>
          <input
            type="number"
            value={soilData.nitrogen}
            onChange={handleChange('nitrogen')}
            placeholder="Enter Nitrogen level"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Potassium (K)</label>
          <input
            type="number"
            value={soilData.potassium}
            onChange={handleChange('potassium')}
            placeholder="Enter Potassium level"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">Phosphorus (P)</label>
          <input
            type="number"
            value={soilData.phosphorus}
            onChange={handleChange('phosphorus')}
            placeholder="Enter Phosphorus level"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700">pH</label>
          <input
            type="number"
            value={soilData.ph}
            onChange={handleChange('ph')}
            placeholder="Enter pH level"
            className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>
    </>
  );
};

export default SoilInputForm;