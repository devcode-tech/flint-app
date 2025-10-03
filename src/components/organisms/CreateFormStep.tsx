'use client'

import React, { useState } from 'react'
import { Plus, Trash2, GripVertical } from 'lucide-react'
import { SimpleInput } from '@/components/atoms/SimpleInput'
import { FormDropdown } from '@/components/atoms/FormDropdown'
import { cn } from '@/lib/utils'

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea'
  label: string
  placeholder: string
  required: boolean
  options?: string[]
}

interface CreateFormStepProps {
  className?: string
}

const fieldTypeOptions = [
  { value: 'text', label: 'Text Input' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone Number' },
  { value: 'select', label: 'Dropdown Select' },
  { value: 'textarea', label: 'Text Area' }
]

export const CreateFormStep: React.FC<CreateFormStepProps> = ({ className }) => {
  const [formFields, setFormFields] = useState<FormField[]>([
    {
      id: '1',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true
    },
    {
      id: '2',
      type: 'email',
      label: 'Email Address',
      placeholder: 'Enter your email',
      required: true
    }
  ])

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: 'text',
      label: 'New Field',
      placeholder: 'Enter placeholder text',
      required: false
    }
    setFormFields([...formFields, newField])
  }

  const removeField = (id: string) => {
    setFormFields(formFields.filter(field => field.id !== id))
  }

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(field => 
      field.id === id ? { ...field, ...updates } : field
    ))
  }

  return (
    <div className={cn('flex w-[660px] h-[776px] p-4 flex-col items-start gap-2.5 bg-white', className)}>
      {/* Header */}
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col justify-center items-start gap-2 self-stretch">
          <div className="text-[#141C25] font-inter text-xl font-semibold leading-8 -tracking-[0.4px]">
            Create Form
          </div>
          <div className="self-stretch text-[#344051] font-inter text-sm font-normal leading-5">
            Design your contest entry form by adding and configuring form fields
          </div>
          
          {/* Divider */}
          <div className="flex h-0 justify-center items-center self-stretch">
            <div className="flex-1 h-px bg-[#E4E7EC]" />
          </div>
        </div>
        
        {/* Form Builder */}
        <div className="flex flex-col items-start gap-4 self-stretch max-h-[600px] overflow-y-auto">
          {/* Form Fields */}
          {formFields.map((field, index) => (
            <div key={field.id} className="flex flex-col items-start gap-3 self-stretch p-4 border border-[#E4E7EC] rounded-lg bg-[#F9FAFB]">
              {/* Field Header */}
              <div className="flex justify-between items-center self-stretch">
                <div className="flex items-center gap-2">
                  <GripVertical className="w-4 h-4 text-[#637083]" />
                  <span className="text-[#344051] font-inter text-sm font-medium">
                    Field {index + 1}
                  </span>
                </div>
                <button
                  onClick={() => removeField(field.id)}
                  className="p-1 text-[#DC2626] hover:bg-[#FEE2E2] rounded transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Field Configuration */}
              <div className="flex flex-col items-start gap-3 self-stretch">
                <div className="flex gap-3 self-stretch">
                  <SimpleInput
                    label="Field Label"
                    value={field.label}
                    onChange={(value) => updateField(field.id, { label: value })}
                    className="flex-1"
                  />
                  <FormDropdown
                    label="Field Type"
                    value={field.type}
                    onChange={(value) => updateField(field.id, { type: value as FormField['type'] })}
                    options={fieldTypeOptions}
                    className="w-40" name={''}                  />
                </div>
                
                <SimpleInput
                  label="Placeholder Text"
                  value={field.placeholder}
                  onChange={(value) => updateField(field.id, { placeholder: value })}
                />
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`required-${field.id}`}
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="w-4 h-4 text-[#005EB8] border-[#E4E7EC] rounded focus:ring-[#005EB8]"
                  />
                  <label htmlFor={`required-${field.id}`} className="text-[#344051] font-inter text-sm">
                    Required field
                  </label>
                </div>
              </div>
            </div>
          ))}
          
          {/* Add Field Button */}
          <button
            onClick={addField}
            className="flex px-4 py-2 items-center gap-2 self-stretch justify-center border-2 border-dashed border-[#E4E7EC] rounded-lg hover:border-[#005EB8] hover:bg-[#F8FAFC] transition-colors"
          >
            <Plus className="w-4 h-4 text-[#637083]" />
            <span className="text-[#637083] font-inter text-sm font-medium">
              Add Form Field
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
