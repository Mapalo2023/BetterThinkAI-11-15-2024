import React from 'react';
import { Scale } from 'lucide-react';
import { useLegalComplianceStore } from '../../store/features/legalComplianceStore';
import ComplianceReportCard from './shared/ComplianceReportCard';
import SavedFeaturesButton from './shared/SavedFeaturesButton';

export default function LegalCompliance() {
  const { reports, isLoading, generateReport, removeReport } = useLegalComplianceStore();
  const [formData, setFormData] = React.useState({
    businessType: '',
    regions: [''],
    dataHandling: [''],
    currentMeasures: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessType || !formData.currentMeasures) {
      return;
    }
    
    const regions = formData.regions.filter(r => r.trim());
    const dataHandling = formData.dataHandling.filter(d => d.trim());
    
    if (regions.length === 0 || dataHandling.length === 0) {
      return;
    }

    try {
      await generateReport(
        formData.businessType,
        regions,
        dataHandling,
        formData.currentMeasures
      );
      setFormData({
        businessType: '',
        regions: [''],
        dataHandling: [''],
        currentMeasures: ''
      });
    } catch (error) {
      // Error is handled by the store
      console.error('Form submission error:', error);
    }
  };

  const addField = (field: 'regions' | 'dataHandling') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeField = (field: 'regions' | 'dataHandling', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: 'regions' | 'dataHandling', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Scale className="w-8 h-8 text-blue-500" />
            Legal & Compliance
          </h1>
          <p className="text-gray-500 mt-1">
            Get AI-powered legal and compliance recommendations
          </p>
        </div>
        <SavedFeaturesButton count={reports.length} title="Saved Reports" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData(prev => ({ ...prev, businessType: e.target.value }))}
                  className="input"
                  required
                >
                  <option value="">Select type</option>
                  <option value="startup">Startup</option>
                  <option value="saas">SaaS</option>
                  <option value="ecommerce">E-commerce</option>
                  <option value="marketplace">Marketplace</option>
                  <option value="service">Service Provider</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Operating Regions
                  </label>
                  <button
                    type="button"
                    onClick={() => addField('regions')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add Region
                  </button>
                </div>
                {formData.regions.map((region, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={region}
                      onChange={(e) => updateField('regions', index, e.target.value)}
                      className="input"
                      placeholder="Enter region"
                      required
                    />
                    {formData.regions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField('regions', index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Data Handling
                  </label>
                  <button
                    type="button"
                    onClick={() => addField('dataHandling')}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Add Data Type
                  </button>
                </div>
                {formData.dataHandling.map((data, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <select
                      value={data}
                      onChange={(e) => updateField('dataHandling', index, e.target.value)}
                      className="input"
                      required
                    >
                      <option value="">Select data type</option>
                      <option value="personal">Personal Data</option>
                      <option value="financial">Financial Data</option>
                      <option value="health">Health Data</option>
                      <option value="location">Location Data</option>
                      <option value="biometric">Biometric Data</option>
                      <option value="none">No Sensitive Data</option>
                    </select>
                    {formData.dataHandling.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeField('dataHandling', index)}
                        className="p-2 text-red-500 hover:text-red-600"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Compliance Measures
                </label>
                <textarea
                  value={formData.currentMeasures}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentMeasures: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Describe your current compliance measures..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn btn-primary"
              >
                {isLoading ? 'Generating...' : 'Generate Report'}
              </button>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="space-y-6">
            {reports.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <Scale className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No compliance reports yet</h3>
                <p className="text-gray-500">
                  Start by generating your first compliance report
                </p>
              </div>
            ) : (
              reports.map((report) => (
                <ComplianceReportCard
                  key={report.id}
                  report={report}
                  onDelete={removeReport}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}