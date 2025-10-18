'use client'

import React from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import { cn } from '@/lib/utils'

interface EnhancedRichTextEditorProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  minHeight?: string
  className?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [showColorPicker, setShowColorPicker] = React.useState(false)
  const [customColor, setCustomColor] = React.useState('#000000')

  if (!editor) {
    return null
  }

  const presetColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Orange', value: '#f97316' },
    { name: 'Pink', value: '#ec4899' },
  ]

  return (
    <div className="border-b border-[#E4E7EC] bg-[#F9FAFB] p-2 flex flex-wrap gap-1 items-center">
      {/* Text Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn(
          'p-2 rounded hover:bg-[#E4E7EC] transition-colors',
          editor.isActive('bold') ? 'bg-[#005EB8] text-white' : 'text-[#637083]'
        )}
        type="button"
        title="Bold"
      >
        <strong>B</strong>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn(
          'p-2 rounded hover:bg-[#E4E7EC] transition-colors',
          editor.isActive('italic') ? 'bg-[#005EB8] text-white' : 'text-[#637083]'
        )}
        type="button"
        title="Italic"
      >
        <em>I</em>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={cn(
          'p-2 rounded hover:bg-[#E4E7EC] transition-colors',
          editor.isActive('strike') ? 'bg-[#005EB8] text-white' : 'text-[#637083]'
        )}
        type="button"
        title="Strikethrough"
      >
        <s>S</s>
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={cn(
          'p-2 rounded hover:bg-[#E4E7EC] transition-colors',
          editor.isActive('underline') ? 'bg-[#005EB8] text-white' : 'text-[#637083]'
        )}
        type="button"
        title="Underline"
      >
        <u>U</u>
      </button>

      <div className="w-px h-6 bg-[#E4E7EC] mx-1" />

      {/* Headings */}
      <select
        onChange={(e) => {
          const level = e.target.value
          if (level === 'p') {
            editor.chain().focus().setParagraph().run()
          } else {
            editor.chain().focus().setHeading({ level: parseInt(level) }).run()
          }
        }}
        value={
          editor.isActive('heading', { level: 1 }) ? '1' :
          editor.isActive('heading', { level: 2 }) ? '2' :
          editor.isActive('heading', { level: 3 }) ? '3' :
          editor.isActive('heading', { level: 4 }) ? '4' :
          editor.isActive('heading', { level: 5 }) ? '5' :
          editor.isActive('heading', { level: 6 }) ? '6' : 'p'
        }
        className="px-3 py-1 rounded border border-[#E4E7EC] text-sm text-[#637083] bg-white hover:bg-[#F9FAFB] cursor-pointer"
      >
        <option value="p">Paragraph</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
      </select>

      <div className="w-px h-6 bg-[#E4E7EC] mx-1" />

      {/* Lists */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn(
          'px-2 py-1 rounded hover:bg-[#E4E7EC] transition-colors text-sm',
          editor.isActive('bulletList') ? 'bg-[#005EB8] text-white' : 'text-[#637083]'
        )}
        type="button"
        title="Bullet List"
      >
        • List
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn(
          'px-2 py-1 rounded hover:bg-[#E4E7EC] transition-colors text-sm',
          editor.isActive('orderedList') ? 'bg-[#005EB8] text-white' : 'text-[#637083]'
        )}
        type="button"
        title="Numbered List"
      >
        1. List
      </button>

      <div className="w-px h-6 bg-[#E4E7EC] mx-1" />

      {/* Color Picker */}
      <div className="relative flex items-center gap-1">
        <span className="text-xs text-[#637083] px-1">Color:</span>
        {presetColors.map((color) => (
          <button
            key={color.value}
            onClick={() => editor.chain().focus().setColor(color.value).run()}
            className={cn(
              'w-6 h-6 rounded border-2 transition-all',
              editor.isActive('textStyle', { color: color.value })
                ? 'border-[#005EB8] scale-110'
                : 'border-[#E4E7EC] hover:scale-105'
            )}
            style={{ backgroundColor: color.value }}
            type="button"
            title={color.name}
          />
        ))}
        
        {/* Custom Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="px-2 py-1 text-xs rounded border border-[#E4E7EC] text-[#637083] hover:bg-[#F9FAFB] bg-white"
            type="button"
            title="Custom Color"
          >
            🎨 Custom
          </button>
          
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-[#E4E7EC] rounded shadow-lg z-50">
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-10 h-8 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => setCustomColor(e.target.value)}
                  className="w-20 px-2 py-1 text-xs border border-[#E4E7EC] rounded"
                  placeholder="#000000"
                />
                <button
                  onClick={() => {
                    editor.chain().focus().setColor(customColor).run()
                    setShowColorPicker(false)
                  }}
                  className="px-2 py-1 text-xs bg-[#005EB8] text-white rounded hover:bg-[#004A94]"
                  type="button"
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>
        
        <button
          onClick={() => editor.chain().focus().unsetColor().run()}
          className="px-2 py-1 text-xs rounded border border-[#E4E7EC] text-[#637083] hover:bg-[#F9FAFB]"
          type="button"
          title="Clear Color"
        >
          Clear
        </button>
      </div>
    </div>
  )
}

export const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({
  value,
  onChange,
  label,
  placeholder,
  error,
  required,
  minHeight = '200px',
  className
}) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
      }),
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none p-4 focus:outline-none',
      },
    },
  })

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="text-sm font-medium text-[#141C25]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div
        className={cn(
          'border rounded-lg overflow-hidden transition-colors bg-white',
          error ? 'border-red-500' : 'border-[#E4E7EC] focus-within:border-[#005EB8]'
        )}
        style={{ minHeight }}
      >
        <MenuBar editor={editor} />
        <EditorContent 
          editor={editor} 
          placeholder={placeholder}
          className="min-h-[150px]"
        />
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <p className="text-xs text-[#97A1AF]">
        Use the toolbar to format your content with headings, colors, lists, and more.
      </p>
    </div>
  )
}
