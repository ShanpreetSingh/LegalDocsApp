import React from 'react';
import { FileText, Scale, Users, Shield, Clock, CheckCircle } from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const documentTypes = [
    {
      id: 'will',
      title: 'Last Will & Testament',
      description: 'Ensure your assets are distributed according to your wishes with a legally sound will.',
      icon: FileText,
      color: 'bg-blue-500',
      features: ['Asset Distribution', 'Executor Appointment', 'Beneficiary Designation', 'Special Instructions'],
      estimatedTime: '10-15 minutes'
    },
    {
      id: 'poa',
      title: 'Power of Attorney',
      description: 'Authorize someone you trust to make decisions on your behalf when you cannot.',
      icon: Scale,
      color: 'bg-teal-500',
      features: ['Financial Authority', 'Medical Decisions', 'Legal Representation', 'Custom Scope'],
      estimatedTime: '8-12 minutes'
    }
  ];

  const features = [
    { icon: Shield, title: 'Secure & Confidential', description: 'Your information is encrypted and protected' },
    { icon: Clock, title: 'Quick Generation', description: 'Complete documents in minutes, not hours' },
    { icon: Users, title: 'Expert Templates', description: 'Created by legal professionals' },
    { icon: CheckCircle, title: 'Instant Download', description: 'Get your documents immediately after payment' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-4">Professional Legal Document Generator</h1>
          <p className="text-xl text-blue-100">
            Create legally sound documents quickly and securely. Our expert-designed templates ensure
            your important legal documents meet professional standards.
          </p>
        </div>
      </div>

      {/* Document Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {documentTypes.map((doc) => {
          const Icon = doc.icon;
          return (
            <div key={doc.id} className="bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className={`${doc.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">{doc.title}</h3>
                    <p className="text-slate-600 mb-4">{doc.description}</p>
                    
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-sm text-slate-500">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Estimated time: {doc.estimatedTime}</span>
                      </div>
                      
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-2">Includes:</p>
                        <div className="grid grid-cols-2 gap-1">
                          {doc.features.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm text-slate-600">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => onNavigate(doc.id)}
                      className="w-full py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
                    >
                      Start {doc.title}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Features */}
      <div className="bg-slate-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Why Choose Our Platform?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="text-center">
                <div className="bg-white p-4 rounded-lg shadow-sm mb-4 inline-block">
                  <Icon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-600">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Process Flow */}
      <div className="bg-white rounded-lg border border-slate-200 p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Fill Form', description: 'Complete our guided questionnaire' },
            { step: '02', title: 'Preview', description: 'Review your document with watermark' },
            { step: '03', title: 'Secure Payment', description: 'Pay securely for final document' },
            { step: '04', title: 'Download', description: 'Get your professional document' },
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-blue-100 text-blue-600 font-bold text-xl rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                {step.step}
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-sm text-slate-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}