# API Integration Pattern for Contest Forms

## Overview

The contest creation/editing flow uses **two separate API endpoints**:
1. **Form Schema API** - Stores the form builder configuration
2. **Contest Data API** - Stores contest details and references the form schema

## API Structure

### 1. Form Schema API

**Endpoint:** `/api/forms`

**Create Form Schema:**
```typescript
POST /api/forms
Content-Type: application/json

{
  "formTitle": "Contest Entry Form",
  "formDescription": "Enter your details to participate",
  "fields": [
    {
      "id": "field_1",
      "type": "text",
      "label": "Full Name",
      "placeholder": "Enter your name",
      "required": true,
      "validation": { ... }
    },
    {
      "id": "field_2",
      "type": "email",
      "label": "Email",
      "placeholder": "your@email.com",
      "required": true
    }
  ],
  "containers": [ ... ],
  "design": {
    "theme": "default",
    "colors": { ... }
  }
}

Response:
{
  "formId": "form_abc123",
  "createdAt": "2025-10-15T12:00:00Z"
}
```

**Update Form Schema:**
```typescript
PUT /api/forms/:formId
Content-Type: application/json

{
  "formTitle": "Updated Form Title",
  "formDescription": "Updated description",
  "fields": [ ... ],
  "containers": [ ... ],
  "design": { ... }
}

Response:
{
  "formId": "form_abc123",
  "updatedAt": "2025-10-15T12:30:00Z"
}
```

### 2. Contest Data API

**Endpoint:** `/api/contests`

**Create Contest:**
```typescript
POST /api/contests
Content-Type: application/json

{
  "name": "Summer Giveaway 2025",
  "contestType": "engagement",
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "formId": "form_abc123",  // Reference to form schema
  "actions": {
    "rewardType": "single-coupon",
    "chooseReward": "dynamic-coupons"
  },
  "postCapture": {
    "behaviour": "thank-you",
    "autoclose": "after-5-seconds",
    "title": "Thank You!",
    "description": "Your entry has been recorded",
    "url": "https://example.com/thank-you"
  },
  "targeting": {
    "audienceSegment": "smart-audience-segment"
  }
}

Response:
{
  "contestId": "contest_xyz789",
  "status": "draft",
  "createdAt": "2025-10-15T12:00:00Z"
}
```

**Update Contest:**
```typescript
PUT /api/contests/:contestId
Content-Type: application/json

{
  "name": "Updated Contest Name",
  "contestType": "engagement",
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "formId": "form_abc123",
  "actions": { ... },
  "postCapture": { ... },
  "targeting": { ... }
}

Response:
{
  "contestId": "contest_xyz789",
  "updatedAt": "2025-10-15T12:30:00Z"
}
```

**Get Contest:**
```typescript
GET /api/contests/:contestId

Response:
{
  "contestId": "contest_xyz789",
  "name": "Summer Giveaway 2025",
  "contestType": "engagement",
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "formId": "form_abc123",
  "actions": { ... },
  "postCapture": { ... },
  "targeting": { ... },
  "form": {  // Populated form data
    "formTitle": "Contest Entry Form",
    "fields": [ ... ],
    "containers": [ ... ],
    "design": { ... }
  },
  "createdAt": "2025-10-15T12:00:00Z",
  "updatedAt": "2025-10-15T12:30:00Z"
}
```

## Implementation in CreateContestPage

```typescript
// In CreateContestPage.tsx

const handleFinalSubmit = async () => {
  const allData = getValues()
  
  try {
    // Step 1: Create/Update Form Schema
    const formSchemaPayload = {
      formTitle: allData.formBuilder.formTitle,
      formDescription: allData.formBuilder.formDescription,
      fields: allData.formBuilder.fields,
      containers: allData.formBuilder.containers,
      design: allData.formBuilder.design
    }
    
    const formResponse = await fetch('/api/forms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formSchemaPayload)
    })
    
    if (!formResponse.ok) {
      throw new Error('Failed to save form schema')
    }
    
    const { formId } = await formResponse.json()
    console.log('Form schema saved:', formId)
    
    // Step 2: Create Contest with Form Reference
    const contestPayload = {
      name: allData.basicDetails.name,
      contestType: allData.basicDetails.contestType,
      startDate: allData.basicDetails.startDate,
      endDate: allData.basicDetails.endDate,
      formId, // Link to form schema
      actions: allData.actions,
      postCapture: allData.postCapture,
      targeting: allData.targeting
    }
    
    const contestResponse = await fetch('/api/contests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contestPayload)
    })
    
    if (!contestResponse.ok) {
      throw new Error('Failed to create contest')
    }
    
    const { contestId } = await contestResponse.json()
    console.log('Contest created:', contestId)
    
    // Success - move to completion step
    setCurrentStep(5)
    
  } catch (error) {
    console.error('Submission error:', error)
    // TODO: Show error toast/notification
    alert('Failed to create contest. Please try again.')
  }
}
```

## Implementation in EditContestPage

```typescript
// In EditContestPage.tsx

// Load existing contest data
useEffect(() => {
  const loadContestData = async () => {
    try {
      setIsLoading(true)
      
      const response = await fetch(`/api/contests/${contestId}`)
      
      if (!response.ok) {
        throw new Error('Failed to load contest')
      }
      
      const contestData = await response.json()
      
      // Transform API response to match form structure
      const formData: CompleteContestData = {
        basicDetails: {
          name: contestData.name,
          contestType: contestData.contestType,
          startDate: contestData.startDate,
          endDate: contestData.endDate
        },
        formBuilder: {
          formId: contestData.formId,
          formTitle: contestData.form.formTitle,
          formDescription: contestData.form.formDescription,
          fields: contestData.form.fields,
          containers: contestData.form.containers,
          design: contestData.form.design
        },
        actions: contestData.actions,
        postCapture: contestData.postCapture,
        targeting: contestData.targeting
      }
      
      // Populate all forms
      reset(formData)
      
      setIsLoading(false)
    } catch (error) {
      console.error('Error loading contest:', error)
      setIsLoading(false)
      // TODO: Show error notification
    }
  }

  loadContestData()
}, [contestId, reset])

// Update contest
const handleFinalSubmit = async () => {
  const allData = getValues()
  
  try {
    // Step 1: Update Form Schema
    const formSchemaPayload = {
      formTitle: allData.formBuilder.formTitle,
      formDescription: allData.formBuilder.formDescription,
      fields: allData.formBuilder.fields,
      containers: allData.formBuilder.containers,
      design: allData.formBuilder.design
    }
    
    const formResponse = await fetch(`/api/forms/${allData.formBuilder.formId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formSchemaPayload)
    })
    
    if (!formResponse.ok) {
      throw new Error('Failed to update form schema')
    }
    
    console.log('Form schema updated')
    
    // Step 2: Update Contest
    const contestPayload = {
      name: allData.basicDetails.name,
      contestType: allData.basicDetails.contestType,
      startDate: allData.basicDetails.startDate,
      endDate: allData.basicDetails.endDate,
      formId: allData.formBuilder.formId,
      actions: allData.actions,
      postCapture: allData.postCapture,
      targeting: allData.targeting
    }
    
    const contestResponse = await fetch(`/api/contests/${contestId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contestPayload)
    })
    
    if (!contestResponse.ok) {
      throw new Error('Failed to update contest')
    }
    
    console.log('Contest updated')
    
    // Success - redirect to contest view
    router.push(`/contests/${contestId}`)
    
  } catch (error) {
    console.error('Update error:', error)
    // TODO: Show error toast/notification
    alert('Failed to update contest. Please try again.')
  }
}
```

## Error Handling Pattern

```typescript
interface APIError {
  message: string
  field?: string
  code?: string
}

const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error
    const apiError: APIError = error.response.data
    
    if (apiError.field) {
      // Set field-specific error
      form.setError(apiError.field as any, {
        type: 'server',
        message: apiError.message
      })
    } else {
      // Show general error
      alert(apiError.message)
    }
  } else if (error.request) {
    // Request made but no response
    alert('Network error. Please check your connection.')
  } else {
    // Something else happened
    alert('An unexpected error occurred.')
  }
}

// Usage
try {
  await submitData()
} catch (error) {
  handleAPIError(error)
}
```

## Loading States

```typescript
const [isSubmitting, setIsSubmitting] = useState(false)

const handleFinalSubmit = async () => {
  setIsSubmitting(true)
  
  try {
    // ... API calls
  } catch (error) {
    // ... error handling
  } finally {
    setIsSubmitting(false)
  }
}

// In render
<button 
  onClick={handleNext}
  disabled={isSubmitting}
>
  {isSubmitting ? 'Saving...' : 'Complete Contest'}
</button>
```

## Optimistic Updates (Optional)

```typescript
const handleFinalSubmit = async () => {
  const allData = getValues()
  
  // Optimistically show success
  setCurrentStep(5)
  
  try {
    // Make API calls in background
    await Promise.all([
      submitFormSchema(allData.formBuilder),
      submitContestData(allData)
    ])
    
    // Actually succeeded
    console.log('Contest created successfully')
    
  } catch (error) {
    // Revert on error
    setCurrentStep(4)
    handleAPIError(error)
  }
}
```

## Testing API Integration

```typescript
// Mock API for testing
const mockAPI = {
  createForm: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { formId: `form_${Date.now()}` }
  },
  
  createContest: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    return { contestId: `contest_${Date.now()}` }
  },
  
  getContest: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      contestId: id,
      name: 'Test Contest',
      // ... mock data
    }
  }
}

// Use in development
const API = process.env.NODE_ENV === 'development' ? mockAPI : realAPI
```

## Summary

1. **Two separate APIs**: Form schema and contest data
2. **Sequential submission**: Form first, then contest with formId reference
3. **Edit mode**: Load contest with populated form data, update both APIs
4. **Error handling**: Handle both network and server errors gracefully
5. **Loading states**: Show feedback during async operations
6. **Type safety**: Use TypeScript interfaces for API payloads

This pattern ensures clean separation of concerns and makes it easy to manage form schemas independently from contest configurations.
