'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import type { ContestFormData } from '@/types/contestForm'

interface FormField {
  id: string
  type: 'text' | 'email' | 'phone' | 'select' | 'textarea'
  label: string
  placeholder: string
  required: boolean
  options?: string[]
}

interface ContestCreationState {
  currentStep: number
  basicDetails: ContestFormData
  formFields: FormField[]
  actions: any[]
  postCapture: any
  targeting: any
  isDraft: boolean
  lastSaved?: Date
}

type ContestCreationAction =
  | { type: 'SET_STEP'; payload: number }
  | { type: 'UPDATE_BASIC_DETAILS'; payload: Partial<ContestFormData> }
  | { type: 'SET_FORM_FIELDS'; payload: FormField[] }
  | { type: 'ADD_FORM_FIELD'; payload: FormField }
  | { type: 'UPDATE_FORM_FIELD'; payload: { id: string; updates: Partial<FormField> } }
  | { type: 'REMOVE_FORM_FIELD'; payload: string }
  | { type: 'SAVE_DRAFT' }
  | { type: 'LOAD_DRAFT'; payload: ContestCreationState }
  | { type: 'RESET_FORM' }

const initialState: ContestCreationState = {
  currentStep: 0,
  basicDetails: {
    name: '',
    contestType: '',
    startDate: '',
    endDate: ''
  },
  formFields: [
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
  ],
  actions: [],
  postCapture: null,
  targeting: null,
  isDraft: false
}

function contestCreationReducer(
  state: ContestCreationState,
  action: ContestCreationAction
): ContestCreationState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload }
    
    case 'UPDATE_BASIC_DETAILS':
      return {
        ...state,
        basicDetails: { ...state.basicDetails, ...action.payload },
        isDraft: true
      }
    
    case 'SET_FORM_FIELDS':
      return { ...state, formFields: action.payload, isDraft: true }
    
    case 'ADD_FORM_FIELD':
      return {
        ...state,
        formFields: [...state.formFields, action.payload],
        isDraft: true
      }
    
    case 'UPDATE_FORM_FIELD':
      return {
        ...state,
        formFields: state.formFields.map(field =>
          field.id === action.payload.id
            ? { ...field, ...action.payload.updates }
            : field
        ),
        isDraft: true
      }
    
    case 'REMOVE_FORM_FIELD':
      return {
        ...state,
        formFields: state.formFields.filter(field => field.id !== action.payload),
        isDraft: true
      }
    
    case 'SAVE_DRAFT':
      return { ...state, isDraft: false, lastSaved: new Date() }
    
    case 'LOAD_DRAFT':
      return action.payload
    
    case 'RESET_FORM':
      return initialState
    
    default:
      return state
  }
}

interface ContestCreationContextType {
  state: ContestCreationState
  dispatch: React.Dispatch<ContestCreationAction>
  goToStep: (step: number) => void
  updateBasicDetails: (updates: Partial<ContestFormData>) => void
  addFormField: (field: FormField) => void
  updateFormField: (id: string, updates: Partial<FormField>) => void
  removeFormField: (id: string) => void
  saveDraft: () => void
  resetForm: () => void
}

const ContestCreationContext = createContext<ContestCreationContextType | undefined>(undefined)

export function ContestCreationProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(contestCreationReducer, initialState)

  const contextValue: ContestCreationContextType = {
    state,
    dispatch,
    goToStep: (step: number) => dispatch({ type: 'SET_STEP', payload: step }),
    updateBasicDetails: (updates: Partial<ContestFormData>) =>
      dispatch({ type: 'UPDATE_BASIC_DETAILS', payload: updates }),
    addFormField: (field: FormField) =>
      dispatch({ type: 'ADD_FORM_FIELD', payload: field }),
    updateFormField: (id: string, updates: Partial<FormField>) =>
      dispatch({ type: 'UPDATE_FORM_FIELD', payload: { id, updates } }),
    removeFormField: (id: string) =>
      dispatch({ type: 'REMOVE_FORM_FIELD', payload: id }),
    saveDraft: () => dispatch({ type: 'SAVE_DRAFT' }),
    resetForm: () => dispatch({ type: 'RESET_FORM' })
  }

  return (
    <ContestCreationContext.Provider value={contextValue}>
      {children}
    </ContestCreationContext.Provider>
  )
}

export function useContestCreation() {
  const context = useContext(ContestCreationContext)
  if (context === undefined) {
    throw new Error('useContestCreation must be used within a ContestCreationProvider')
  }
  return context
}
