'use client'

import React, { useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import Highlight from '@tiptap/extension-highlight'
import { Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, Undo, Redo, Palette, Highlighter } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  label?: string
  error?: string
  required?: boolean
  className?: string
  minHeight?: string
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value = '',
  onChange,
  placeholder = 'Start typing...',
  label,
  error,
  required = false,
  className,
  minHeight = '150px'
}) => {
  const [showTextColorPicker, setShowTextColorPicker] = useState(false)
  const [showHighlightPicker, setShowHighlightPicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true
      })
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange?.(html)
    },
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm max-w-none focus:outline-none',
          'px-4 py-3 min-h-[' + minHeight + ']',
          'text-[#141C25] text-sm leading-relaxed'
        ),
        'data-placeholder': placeholder
      }
    }
  })

  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive, 
    icon: Icon, 
    title 
  }: { 
    onClick: () => void
    isActive?: boolean
    icon: React.ElementType
    title: string
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        'p-2 rounded hover:bg-[#F9FAFB] transition-colors',
        isActive ? 'bg-[#E4E7EC] text-[#005EB8]' : 'text-[#637083]'
      )}
    >
      <Icon className="w-4 h-4" />
    </button>
  )

  const colorPresets = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#4B5563' },
    { name: 'Gray', value: '#9CA3AF' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Orange', value: '#F97316' },
    { name: 'Yellow', value: '#EAB308' },
    { name: 'Green', value: '#22C55E' },
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Purple', value: '#A855F7' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'White', value: '#FFFFFF' },
  ]

  const ColorPicker = ({ 
    type, 
    show, 
    onClose 
  }: { 
    type: 'text' | 'highlight'
    show: boolean
    onClose: () => void
  }) => {
    if (!show) return null

    return (
      <div className="absolute top-full left-0 mt-1 z-50 bg-white border border-[#E4E7EC] rounded-lg shadow-lg p-3">
        <div className="grid grid-cols-4 gap-2 mb-2">
          {colorPresets.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => {
                if (type === 'text') {
                  editor?.chain().focus().setColor(color.value).run()
                } else {
                  editor?.chain().focus().setHighlight({ color: color.value }).run()
                }
                onClose()
              }}
              className="w-8 h-8 rounded border border-[#E4E7EC] hover:scale-110 transition-transform"
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
        <div className="flex gap-2 pt-2 border-t border-[#E4E7EC]">
          <button
            type="button"
            onClick={() => {
              if (type === 'text') {
                editor?.chain().focus().unsetColor().run()
              } else {
                editor?.chain().focus().unsetHighlight().run()
              }
              onClose()
            }}
            className="flex-1 px-2 py-1 text-xs text-[#637083] hover:bg-[#F9FAFB] rounded"
          >
            Clear
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && (
        <label className="flex items-center gap-1 text-[#141C25] text-sm font-medium leading-5">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <div className={cn(
        'border rounded-lg overflow-hidden bg-white',
        error ? 'border-red-500' : 'border-[#C1C7CD] focus-within:border-[#005EB8]'
      )}>
        {/* Toolbar */}
        <div className="flex items-center gap-1 px-2 py-2 border-b border-[#E4E7EC] bg-[#F9FAFB] flex-wrap">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            icon={Bold}
            title="Bold"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            icon={Italic}
            title="Italic"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive('strike')}
            icon={UnderlineIcon}
            title="Strikethrough"
          />
          
          <div className="w-px h-6 bg-[#E4E7EC] mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            icon={List}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            icon={ListOrdered}
            title="Numbered List"
          />
          
          <div className="w-px h-6 bg-[#E4E7EC] mx-1" />
          
          {/* Text Color */}
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                setShowTextColorPicker(!showTextColorPicker)
                setShowHighlightPicker(false)
              }}
              icon={Palette}
              title="Text Color"
            />
            <ColorPicker 
              type="text" 
              show={showTextColorPicker} 
              onClose={() => setShowTextColorPicker(false)} 
            />
          </div>
          
          {/* Highlight Color */}
          <div className="relative">
            <ToolbarButton
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker)
                setShowTextColorPicker(false)
              }}
              icon={Highlighter}
              title="Highlight Color"
            />
            <ColorPicker 
              type="highlight" 
              show={showHighlightPicker} 
              onClose={() => setShowHighlightPicker(false)} 
            />
          </div>
          
          <div className="w-px h-6 bg-[#E4E7EC] mx-1" />
          
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            icon={Undo}
            title="Undo"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            icon={Redo}
            title="Redo"
          />
        </div>

        {/* Editor Content */}
        <EditorContent 
          editor={editor} 
          className="rich-text-editor"
          placeholder={placeholder}
        />
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  )
}
