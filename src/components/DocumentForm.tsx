import React, { useState, useEffect } from 'react';
import { DocumentType, FormField as FormFieldType, WillFormData, PoAFormData } from '../types';
import FormField from './FormField';
import ProgressBar from './ProgressBar';
import { AlertCircle, FileText, Eye, CreditCard, Download, CheckCircle, Lock } from 'lucide-react';

interface DocumentFormProps {
  documentType: DocumentType;
  onBack: () => void;
}

const WILL_FIELDS: FormFieldType[] = [
  { name: 'fullName', label: 'Full Legal Name', type: 'text', required: true, placeholder: 'Enter your full legal name' },
  { name: 'address', label: 'Complete Address', type: 'textarea', required: true, placeholder: 'Street address, city, state, ZIP code' },
  { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
  { name: 'executionDate', label: 'Date of Will Execution', type: 'date', required: true },
  { name: 'beneficiaries', label: 'Beneficiaries and Their Shares', type: 'textarea', required: true, placeholder: 'List all beneficiaries and what they will receive' },
  { name: 'executor', label: 'Executor Name', type: 'text', required: true, placeholder: 'Name of person to execute your will' },
  { name: 'executorAddress', label: 'Executor Address', type: 'textarea', required: true, placeholder: 'Complete address of executor' },
  { name: 'executorPhone', label: 'Executor Phone Number', type: 'text', required: true, placeholder: '(555) 123-4567' },
  { name: 'specialInstructions', label: 'Special Instructions', type: 'textarea', required: false, placeholder: 'Any specific instructions or wishes (optional)' },
  { name: 'witnessRequired', label: 'Witness Requirement', type: 'select', required: true, options: ['Yes, witnesses required', 'No witnesses required', 'Notarization only'] },
];

const POA_FIELDS: FormFieldType[] = [
  { name: 'principalName', label: 'Principal Full Name', type: 'text', required: true, placeholder: 'Your full legal name' },
  { name: 'principalAddress', label: 'Principal Address', type: 'textarea', required: true, placeholder: 'Your complete address' },
  { name: 'principalPhone', label: 'Principal Phone', type: 'text', required: true, placeholder: '(555) 123-4567' },
  { name: 'principalDOB', label: 'Principal Date of Birth', type: 'date', required: true },
  { name: 'attorneyName', label: 'Attorney-in-Fact Name', type: 'text', required: true, placeholder: 'Full name of person you are appointing' },
  { name: 'attorneyAddress', label: 'Attorney-in-Fact Address', type: 'textarea', required: true, placeholder: 'Complete address of attorney-in-fact' },
  { name: 'attorneyPhone', label: 'Attorney-in-Fact Phone', type: 'text', required: true, placeholder: '(555) 123-4567' },
  { name: 'scopeOfAuthority', label: 'Scope of Authority', type: 'textarea', required: true, placeholder: 'Describe what powers you are granting (financial, medical, real estate, etc.)' },
  { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true },
  { name: 'duration', label: 'Duration/Termination', type: 'textarea', required: true, placeholder: 'When does this power of attorney end?' },
];

export default function DocumentForm({ documentType, onBack }: DocumentFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WillFormData | PoAFormData>({} as any);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [hasPaid, setHasPaid] = useState(false);
  const [sessionId] = useState(() => Math.random().toString(36).substr(2, 9));

  const fields = documentType === 'will' ? WILL_FIELDS : POA_FIELDS;
  const stepLabels = ['Form', 'Preview', 'Payment', 'Download'];

  // Load saved data on mount
  useEffect(() => {
    const saved = localStorage.getItem(`${documentType}-form-data`);
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved data:', e);
      }
    }
  }, [documentType]);

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem(`${documentType}-form-data`, JSON.stringify(formData));
    }
  }, [formData, documentType]);

  const handleFieldChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      if (field.required && !formData[field.name as keyof typeof formData]) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePreview = async () => {
    if (!validateForm()) return;
    
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentType,
          formData,
          sessionId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setCurrentStep(2);
    } catch (error) {
  if (error instanceof Error) {
    alert(`Failed to generate preview: ${error.message}. Please check that all required fields are filled and try again.`);
  } else {
    alert('Failed to generate preview: Unknown error occurred.');
  }
} finally {
      setIsGenerating(false);
    }
  };

  const simulatePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const response = await fetch('http://localhost:3001/api/simulate-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Payment processing failed');
      }

      setHasPaid(true);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment processing failed. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const downloadFinalDocument = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/download-final', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) {
        throw new Error('Failed to download document');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = documentType === 'will' ? 'will.pdf' : 'power_of_attorney.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document. Please try again.');
    }
  };

  const renderFormStep = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field) => (
          <div key={field.name} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
            <FormField
              field={field}
              value={formData[field.name as keyof typeof formData] || ''}
              onChange={handleFieldChange}
              error={errors[field.name]}
            />
          </div>
        ))}
      </div>
      
      <div className="flex justify-between pt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Back to Menu
        </button>
        <button
          onClick={generatePreview}
          disabled={isGenerating}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
        >
          {isGenerating ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Eye className="h-5 w-5" />
              <span>Generate Preview</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderPreviewStep = () => (
    <div className="space-y-6">
      {previewUrl && (
        <div className="space-y-4">
          {/* Security Notice */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Lock className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-red-800">Preview Only - Protected Document</h4>
                <p className="text-red-700 text-sm">
                  This preview cannot be downloaded, printed, or saved. Complete payment to access the final document.
                </p>
              </div>
            </div>
          </div>

          {/* PDF Preview Container */}
          <div 
            className="bg-slate-100 rounded-lg p-4 relative"
            onContextMenu={(e) => { e.preventDefault(); return false; }}
            onKeyDown={(e) => {
              if (
                (e.ctrlKey && (e.key === 's' || e.key === 'p')) ||
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I')
              ) {
                e.preventDefault();
                return false;
              }
            }}
            tabIndex={0}
            style={{ 
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none'
            }}
          >
            <iframe
              src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&view=FitH`}
              width="100%"
              height="600"
              className="border-0 rounded-lg shadow-lg"
              title={`Preview of ${documentType === 'will' ? 'Last Will & Testament' : 'Power of Attorney'}`}
              style={{
                pointerEvents: 'auto',
                userSelect: 'none'
              }}
            />
            
            {/* Overlay to prevent direct PDF access */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-90">
                PREVIEW ONLY
              </div>
              <div className="absolute bottom-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold opacity-90">
                NOT FOR DOWNLOAD
              </div>
            </div>
          </div>

          {/* Footer Notice */}
          <div className="text-center text-sm text-slate-500 bg-slate-50 rounded-lg p-3">
            <Eye className="h-4 w-4 inline mr-2" />
            Preview mode active - Final document available after payment
          </div>

          {/* CSS to hide PDF toolbar and disable printing */}
          <style>{`
            iframe {
              -webkit-print-color-adjust: exact;
            }
            
            @media print {
              iframe {
                display: none !important;
              }
              
              .no-print {
                display: block !important;
                text-align: center;
                font-size: 24px;
                color: red;
                margin: 50px;
              }
            }
          `}</style>
          
          <div className="no-print" style={{ display: 'none' }}>
            PRINTING DISABLED - PREVIEW ONLY
          </div>
        </div>
      )}
      
      <div className="flex justify-between pt-6">
        <button
          onClick={() => setCurrentStep(1)}
          className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
        >
          Edit Form
        </button>
        <button
          onClick={() => setCurrentStep(3)}
          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center space-x-2"
        >
          <CreditCard className="h-5 w-5" />
          <span>Proceed to Payment</span>
        </button>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-lg">
          <div className="text-center space-y-6">
            <CreditCard className="h-16 w-16 text-blue-500 mx-auto" />
            <div>
              <h3 className="text-xl font-semibold text-slate-900">Secure Payment</h3>
              <p className="text-slate-600">Complete your purchase to download the final document</p>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Document Type:</span>
                <span className="capitalize">{documentType === 'will' ? 'Last Will & Testament' : 'Power of Attorney'}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-medium">Price:</span>
                <span className="text-2xl font-bold text-green-600">$29.99</span>
              </div>
            </div>
            
            <button
              onClick={simulatePayment}
              disabled={isProcessingPayment}
              className="w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {isProcessingPayment ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Processing Payment...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-5 w-5" />
                  <span>Pay Now (Demo)</span>
                </>
              )}
            </button>
            
            <p className="text-xs text-slate-500">
              This is a demo payment. No actual charges will be made.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDownloadStep = () => (
    <div className="space-y-6">
      <div className="max-w-md mx-auto">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-900 mb-2">Payment Successful!</h3>
          <p className="text-green-700 mb-6">Your document is ready for download</p>
          
          <button
            onClick={downloadFinalDocument}
            className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download Final Document</span>
          </button>
          
          <p className="text-sm text-slate-600 mt-4">
            Your document will be downloaded without watermarks
          </p>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderFormStep();
      case 2: return renderPreviewStep();
      case 3: return renderPaymentStep();
      case 4: return renderDownloadStep();
      default: return renderFormStep();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <ProgressBar
        currentStep={currentStep}
        totalSteps={4}
        stepLabels={stepLabels}
      />
      
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
}