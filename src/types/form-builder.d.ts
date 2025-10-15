declare module '@devcode-tech/form-builder' {
  import { FC } from 'react'

  // Field Types
  export type FormFieldType =
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'tel'
    | 'url'
    | 'search'
    | 'longtext'
    | 'dropdown'
    | 'radio'
    | 'checkbox'
    | 'date'
    | 'time'
    | 'datetime-local'
    | 'file'
    | 'image'
    | 'video'
    | 'document'
    | 'range'
    | 'color'
    | 'richtext'
    | 'multiselect'
    | 'postal'
    | 'terms'
    | 'signature'
    | 'rating'

  export interface FieldOption {
    id: string
    label: string
    value: string
  }

  export interface ValidationRule {
    min?: number
    max?: number
    minLength?: number
    maxLength?: number
    pattern?: string
    customMessage?: string
    [key: string]: any
  }

  export interface FieldStyle {
    labelColor?: string
    labelFontSize?: string
    labelWeight?: string
    labelAlignment?: string
    inputBackgroundColor?: string
    inputBorderColor?: string
    inputBorderRadius?: string
    inputBorderWidth?: string
    inputPadding?: string
    inputFontSize?: string
    inputHeight?: string
    inputTextColor?: string
    marginBottom?: string
    [key: string]: any
  }

  export interface ConditionalLogic {
    enabled: boolean
    conditions: Array<{
      field: string
      operator: string
      value: string
    }>
    action: 'show' | 'hide'
  }

  export interface FormFieldData {
    id: string
    name: string
    type: FormFieldType
    label: string
    placeholder?: string
    required: boolean
    validation?: ValidationRule
    width?: string
    style?: FieldStyle
    options?: FieldOption[]
    conditionalLogic?: ConditionalLogic
    [key: string]: any
  }

  export interface LayoutContainer {
    id: string
    type: 'single-column' | 'two-column'
    fields?: string[]
    leftFields?: string[]
    rightFields?: string[]
  }

  export interface FormDesign {
    backgroundColor?: string
    fontFamily?: string
    fontSize?: string
    spacing?: {
      container?: string
      fields?: string
      columnGap?: string
      rowGap?: string
    }
    logoUrl?: string
    padding?: string
    maxWidth?: string
    borderRadius?: string
    boxShadow?: string
    submitButton?: {
      text?: string
      backgroundColor?: string
      textColor?: string
      padding?: string
      borderRadius?: string
      fontSize?: string
      fontWeight?: string
      width?: string
      alignment?: string
    }
    customFontFamily?: string
    customFonts?: Array<{
      fontFamily: string
      url: string
    }>
  }

  // Type aliases for specific field types
  export type TextFieldData = FormFieldData & { type: 'text' }
  export type EmailFieldData = FormFieldData & { type: 'email' }
  export type PasswordFieldData = FormFieldData & { type: 'password' }
  export type NumberFieldData = FormFieldData & { type: 'number' }
  export type TelFieldData = FormFieldData & { type: 'tel' }
  export type UrlFieldData = FormFieldData & { type: 'url' }
  export type SearchFieldData = FormFieldData & { type: 'search' }
  export type LongTextFieldData = FormFieldData & { type: 'longtext'; rows?: number }
  export type DropdownFieldData = FormFieldData & { type: 'dropdown'; options: FieldOption[] }
  export type RadioFieldData = FormFieldData & { type: 'radio'; options: FieldOption[] }
  export type CheckboxFieldData = FormFieldData & { type: 'checkbox' }
  export type DateFieldData = FormFieldData & { type: 'date'; dateFormat?: string }
  export type TimeFieldData = FormFieldData & { type: 'time' }
  export type DateTimeLocalFieldData = FormFieldData & { type: 'datetime-local' }
  export type FileFieldData = FormFieldData & { type: 'file'; accept?: string; multiple?: boolean }
  export type ImageFieldData = FormFieldData & { type: 'image'; accept?: string; multiple?: boolean }
  export type VideoFieldData = FormFieldData & { type: 'video'; accept?: string; multiple?: boolean }
  export type DocumentFieldData = FormFieldData & { type: 'document'; accept?: string; multiple?: boolean }
  export type RangeFieldData = FormFieldData & { type: 'range'; min?: number; max?: number; step?: number }
  export type ColorFieldData = FormFieldData & { type: 'color' }
  export type RichTextFieldData = FormFieldData & { type: 'richtext'; minHeight?: string; maxHeight?: string }
  export type MultiSelectFieldData = FormFieldData & { type: 'multiselect'; options: FieldOption[] }
  export type PostalFieldData = FormFieldData & { type: 'postal' }
  export type TermsFieldData = FormFieldData & { type: 'terms'; content?: string; links?: Array<{ id: string; text: string; url: string }> }
  export type SignatureFieldData = FormFieldData & { type: 'signature' }
  export type RatingFieldData = FormFieldData & { type: 'rating'; maxRating?: number }

  // Component Props
  export interface FormBuilderProps {
    initialFormId?: string | null
    onSave?: (data: any) => Promise<string | null>
    onUpdate?: (formId: string, data: any) => Promise<boolean>
    onLoad?: (formId: string) => Promise<any>
    onSubmit?: (formData: Record<string, any>) => Promise<void>
  }

  export interface FormSchema {
    id: string
    name: string
    title: string
    description: string
    fields: FormFieldData[]
    design: FormDesign
  }

  // Main Component
  export const FormBuilder: FC<FormBuilderProps>

  // Sub-components
  export const FormPreviewLive: FC<any>
  export const FieldPalette: FC<any>
  export const FieldDesignInspector: FC<any>
  export const ThemeInspector: FC<any>
  export const Modal: FC<any>
  export const Tooltip: FC<any>
  export const ToastContainer: FC<any>
  export const EmptyState: FC<any>
  export const WelcomeTour: FC<any>

  // Utility Functions
  export function applyDefaultErrorMessagesToFields(fields: FormFieldData[]): FormFieldData[]
  export function validateField(field: FormFieldData, value: any): { valid: boolean; error?: string }

  // Configuration
  export const FIELD_LABELS: Record<FormFieldType, string>
  export const FIELD_PLACEHOLDERS: Record<FormFieldType, string>
  export const DEFAULT_FIELD_STYLE: FieldStyle
  export const DEFAULT_OPTIONS: FieldOption[]
  export function fieldRequiresOptions(type: FormFieldType): boolean
}
