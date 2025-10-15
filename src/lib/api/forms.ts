import { supabase } from '@/lib/supabase/client'
import type { FormBuilderData } from '@/schemas/contestSchema'

export async function createForm(data: FormBuilderData) {
  const { data: form, error } = await supabase
    .from('forms')
    .insert({
      form_title: data.formTitle,
      form_description: data.formDescription,
      fields: data.fields,
      containers: data.containers,
      design: data.design || {}
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating form:', error)
    throw new Error(error.message)
  }
  
  return form
}

export async function updateForm(formId: string, data: FormBuilderData) {
  const { data: form, error } = await supabase
    .from('forms')
    .update({
      form_title: data.formTitle,
      form_description: data.formDescription,
      fields: data.fields,
      containers: data.containers,
      design: data.design || {},
      updated_at: new Date().toISOString()
    })
    .eq('id', formId)
    .select()
    .single()

  if (error) {
    console.error('Error updating form:', error)
    throw new Error(error.message)
  }
  
  return form
}

export async function getForm(formId: string) {
  const { data: form, error } = await supabase
    .from('forms')
    .select('*')
    .eq('id', formId)
    .single()

  if (error) {
    console.error('Error fetching form:', error)
    throw new Error(error.message)
  }
  
  return form
}

export async function deleteForm(formId: string) {
  const { error } = await supabase
    .from('forms')
    .delete()
    .eq('id', formId)

  if (error) {
    console.error('Error deleting form:', error)
    throw new Error(error.message)
  }
}
