# Form Builder Integration Guide

## Overview

The `@devcode-tech/form-builder` package has been successfully integrated into the Contest Creation flow (Step 2: Create Form).

## What Was Done

### 1. Installed Required Dependencies
The form-builder package requires the following peer dependencies:
```bash
npm install @devcode-tech/form-builder@^1.0.1
npm install @tiptap/react@^2.0.0 @tiptap/starter-kit@^2.0.0
```

**Fixed Peer Dependency Issue:**
- **Problem**: The form-builder package required `lucide-react@^0.263.0` but the app uses `lucide-react@^0.294.0`
- **Solution**: Updated the form-builder package's `peerDependencies` to accept `lucide-react@>=0.263.0`
- **Published**: `@devcode-tech/form-builder@1.0.1`

### 2. Security Updates
- Updated Next.js from `14.0.3` to `14.2.33` to fix critical security vulnerabilities
- Updated `eslint-config-next` to match

### 3. Created Integration Component
**File**: `src/components/organisms/ContestFormBuilder.tsx`

This component wraps the form builder and provides:
- Save/edit functionality
- Data structure for contest forms
- Error handling
- Loading states
- Integration with the contest creation flow

### 4. Updated Contest Creation Page
**File**: `src/components/organisms/CreateContestPage.tsx`

Changes:
- Imported `ContestFormBuilder` component
- Added `formBuilderData` state to store form builder output
- Created `handleFormBuilderSubmit` handler
- Replaced "Coming Soon" placeholder with the actual form builder
- Updated completion summary to show form builder data

### 5. Added TypeScript Definitions
**File**: `src/types/form-builder.d.ts`

Provides full TypeScript support for the form-builder package including:
- All field types
- Form design options
- Layout containers
- Validation rules
- Component props

## Usage

### In Contest Creation Flow

The form builder is automatically integrated into Step 2 of the contest creation process:

1. User completes Basic Details (Step 1)
2. User builds their form using the drag-and-drop builder (Step 2)
3. Form data is saved and passed to the next step
4. User continues with Actions, Post Capture, and Targeting

### Data Structure

The form builder outputs the following data structure:

```typescript
interface ContestFormData {
  formId?: string
  formTitle: string
  formDescription: string
  fields: FormFieldData[]
  containers: LayoutContainer[]
  design: FormDesign
}
```

### Accessing Form Data

The form data is stored in the `formBuilderData` state and can be accessed in the final submission:

```typescript
const handleTargetingSubmit = (data: TargetingFormData) => {
  console.log('All form data:', {
    basicDetails: basicDetailsData,
    formBuilder: formBuilderData, // ← Form builder data here
    actions: actionsData,
    postCapture: postCaptureData,
    targeting: data
  })
}
```

## Features Available

The integrated form builder provides:

### Field Types
- **Text Inputs**: text, email, password, number, tel, url, search
- **Text Areas**: longtext, richtext
- **Selection**: dropdown, radio, checkbox, multiselect
- **Date/Time**: date, time, datetime-local
- **File Uploads**: file, image, video, document
- **Advanced**: range, color, postal, terms, signature, rating

### Layout Options
- Single-column layouts
- Two-column layouts
- Drag-and-drop field reordering
- Responsive design

### Customization
- Field validation rules
- Custom styling per field
- Conditional logic
- Theme customization
- Submit button styling

### User Experience
- Welcome tour for first-time users
- Real-time preview
- Toast notifications
- Empty state guidance
- Drag-and-drop interface

## Next Steps

### TODO: Backend Integration

Currently, the form builder saves data locally. You need to implement:

1. **API Endpoint**: Create an endpoint to save form configurations
   ```typescript
   POST /api/contests/forms
   {
     contestId: string,
     formData: ContestFormData
   }
   ```

2. **Update `ContestFormBuilder.tsx`**:
   ```typescript
   const handleSave = async (formData: any) => {
     const response = await fetch('/api/contests/forms', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(formData)
     })
     // Handle response
   }
   ```

3. **Load Existing Forms**: Implement form loading for edit mode
   ```typescript
   useEffect(() => {
     if (defaultValues?.formId) {
       // Fetch form data from API
       fetchFormData(defaultValues.formId)
     }
   }, [defaultValues])
   ```

### Optional Enhancements

1. **Auto-save**: Implement periodic auto-save functionality
2. **Templates**: Add pre-built form templates for common contest types
3. **Preview Mode**: Add a preview button to test the form
4. **Export/Import**: Allow users to export/import form configurations
5. **Analytics**: Track which fields are most commonly used

## Troubleshooting

### TypeScript Errors
If you see TypeScript errors about missing types, ensure `src/types/form-builder.d.ts` exists.

### Peer Dependency Warnings
If you see peer dependency warnings during `npm install`, use:
```bash
npm install --legacy-peer-deps
```

Or configure it globally for the project:
```bash
npm config set legacy-peer-deps true
```

### Form Builder Not Rendering
Check browser console for errors. Common issues:
- Missing CSS imports
- Conflicting Tailwind classes
- Missing peer dependencies

## Fullscreen Integration

The form builder is integrated into the contest creation flow using a **fullscreen approach**:

```tsx
// In CreateContestPage.tsx
if (currentStep === 1) {
  return (
    <div className="fixed inset-0 z-50 bg-white">
      <ContestFormBuilder
        onSubmit={handleFormBuilderSubmit}
        defaultValues={formBuilderData || undefined}
      />
    </div>
  )
}
```

### Why Fullscreen?

- **Optimal Experience**: Form builder gets full viewport space
- **No Layout Conflicts**: Avoids complex responsive/overflow issues
- **Better UX**: Users focus solely on form creation
- **Simpler Integration**: Clean separation from multi-step wizard
- **Works Perfectly**: All features accessible without scrolling issues

## Package Information

- **Package**: `@devcode-tech/form-builder@2.0.0`
- **Repository**: `d:\form-builder-package`
- **Registry**: GitHub Packages (`https://npm.pkg.github.com`)

### Changelog

**v2.0.0** (Latest) - Clean Standalone Version
- 🔄 **Major refactor**: Removed all embedded mode complexity
- ✨ **Simplified props**: No embedded/hideHeader/hideSidebars props needed
- 🎯 **Fullscreen optimized**: Designed for fullscreen integration
- 🧹 **Cleaner codebase**: Removed 100+ lines of conditional styling
- 💡 **Better approach**: Use fullscreen mode in parent app instead

**v1.2.1** - Scrolling Fix
- 🔧 **Fixed scrolling issues**: Canvas area now scrolls properly
- 📏 **Reduced sidebar heights**: Mobile sidebars now max-height 200px (was 280px)
- 👁️ **Header always visible**: Toolbar with Preview/Customize/Save always accessible
- 📱 **Better mobile experience**: More vertical space for form canvas
- ⚡ **Improved overflow**: Explicit overflow-y-auto on canvas for better control

**v1.2.0** - Major UI Overhaul
- 🎨 **Complete design refresh** matching your app's aesthetics
- 🎯 **Brand color integration**: Uses `#005EB8` (your app's primary color)
- ✨ **Cleaner interface**: Reduced visual clutter, lighter borders
- 📐 **Refined spacing**: Tighter, more professional layout
- 🔤 **Better typography**: Smaller, more consistent font sizes
- 🎭 **Subtle shadows**: Added depth without heaviness
- 🔘 **Modern buttons**: Clean, minimal design with proper hover states
- 📊 **Improved layout buttons**: Icon + text with better visual hierarchy
- 🌈 **Softer colors**: Gray-50/100 backgrounds, lighter borders
- 💎 **Premium feel**: Professional, polished appearance

**v1.1.1**
- 🎨 **Comprehensive responsive improvements**
- 📱 **Mobile-first design** with optimized spacing and typography
- 🔄 **Better breakpoints**: Uses `xl:` (1280px) for sidebar layout transitions
- 📏 **Compact embedded mode**: Smaller padding, text sizes, and button sizes
- 🎯 **Icon-only buttons** on mobile for better space utilization
- ⚡ **Improved overflow handling** for better scrolling behavior
- 🖼️ **Flexible layout**: Sidebars stack vertically on mobile, horizontal on desktop

**v1.1.0**
- ✨ Added embedded mode with responsive layout
- 📱 Mobile-first responsive design
- 🎨 Customizable header and sidebar visibility
- 🔧 Custom save handler support
- 🎯 Better integration with parent applications

**v1.0.1**
- 🐛 Fixed lucide-react peer dependency issue
- 📦 Updated to accept `lucide-react@>=0.263.0`

## Support

For issues with the form builder package itself, check:
- Package source: `d:\form-builder-package`
- Package README: `d:\form-builder-package\README.md`
