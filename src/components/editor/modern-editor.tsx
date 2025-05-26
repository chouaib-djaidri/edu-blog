"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Highlighter,
  Wand2,
  ArrowDownToLine,
  ArrowUpToLine,
  CheckCircle,
  Sparkles,
  List as ListIcon,
  ListOrdered,
  Quote as QuoteIcon,
  Table as TableIcon,
  Smile,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Type,
  Loader2
} from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import NestedList from '@editorjs/nested-list';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';

// Custom CSS import
import "@/styles/modern-editor.css";

// Types
interface EditorJSData {
  time?: number;
  blocks: Array<{
    id?: string;
    type: string;
    data: any;
  }>;
  version?: string;
}

interface ModernEditorProps {
  content: EditorJSData;
  setContent: (content: EditorJSData) => void;
}

// Color constants
const TEXT_COLORS = [
  '#000000', '#374151', '#6b7280', '#ef4444', '#f97316', '#f59e0b',
  '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899',
  '#f43f5e'
];

const HIGHLIGHT_COLORS = [
  'transparent', '#fef3c7', '#fde68a', '#fde047', '#facc15', '#fbbf24',
  '#fed7aa', '#fdba74', '#fecaca', '#fca5a5', '#fde7e7', '#e0e7ff',
  '#ddd6fe', '#e9d5ff', '#fae8ff', '#fce7f3', '#ffe4e6'
];

// Custom Emoji Tool
class EmojiTool {
  static get toolbox() {
    return {
      title: 'Emoji',
      icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>'
    };
  }

  constructor({ data }: any) {
    this.data = data || {};
    this.wrapper = null;
  }

  render() {
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('emoji-tool-wrapper');

    if (this.data.emoji) {
      this.wrapper.innerHTML = `<div class="emoji-display">${this.data.emoji}</div>`;
    } else {
      this.showEmojiPicker();
    }

    return this.wrapper;
  }

  showEmojiPicker() {
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇',
      '🙂', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋',
      '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳',
      '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫',
      '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳',
      '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🤭',
      '🤫', '🤥', '😶', '😐', '😑', '😬', '🙄', '😯', '😦', '😧',
      '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '🤐', '🥴', '🤢',
      '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠', '😈', '👿', '👹',
      '👺', '🤡', '💩', '👻', '💀', '☠️', '👽', '👾', '🤖', '🎃',
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '✨', '⭐',
      '🌟', '💫', '🔥', '💥', '💢', '💯', '🎉', '🎊', '🎈', '🎁'];

    const picker = document.createElement('div');
    picker.classList.add('emoji-picker-grid');

    emojis.forEach(emoji => {
      const emojiBtn = document.createElement('button');
      emojiBtn.classList.add('emoji-picker-item');
      emojiBtn.textContent = emoji;
      emojiBtn.addEventListener('click', () => {
        this.data.emoji = emoji;
        this.wrapper.innerHTML = `<div class="emoji-display">${emoji}</div>`;
      });
      picker.appendChild(emojiBtn);
    });

    this.wrapper.appendChild(picker);
  }

  save() {
    return {
      emoji: this.data.emoji || '😀'
    };
  }
}

// Slash Menu Implementation
const createSlashMenu = (editor: EditorJS) => {
  const menu = document.createElement('div');
  menu.classList.add('slash-menu');
  menu.style.display = 'none';

  const menuItems = [
    { icon: Heading2, label: 'Heading 2', action: () => insertBlock(editor, 'header', { text: '', level: 2 }) },
    { icon: Heading3, label: 'Heading 3', action: () => insertBlock(editor, 'header', { text: '', level: 3 }) },
    { icon: Heading4, label: 'Heading 4', action: () => insertBlock(editor, 'header', { text: '', level: 4 }) },
    { icon: Heading5, label: 'Heading 5', action: () => insertBlock(editor, 'header', { text: '', level: 5 }) },
    { icon: Heading6, label: 'Heading 6', action: () => insertBlock(editor, 'header', { text: '', level: 6 }) },
    { icon: Type, label: 'Paragraph', action: () => insertBlock(editor, 'paragraph', { text: '' }) },
    { icon: ListIcon, label: 'Bullet List', action: () => insertBlock(editor, 'list', { style: 'unordered', items: [''] }) },
    { icon: ListOrdered, label: 'Numbered List', action: () => insertBlock(editor, 'list', { style: 'ordered', items: [''] }) },
    { icon: ListIcon, label: 'Nested List', action: () => insertBlock(editor, 'nestedList', { style: 'unordered', items: [] }) },
    { icon: QuoteIcon, label: 'Quote', action: () => insertBlock(editor, 'quote', { text: '', caption: '' }) },
    { icon: TableIcon, label: 'Table', action: () => insertBlock(editor, 'table', { content: [['', ''], ['', '']] }) },
    { icon: Smile, label: 'Emoji', action: () => insertBlock(editor, 'emoji', {}) },
    { icon: Sparkles, label: 'AI Complete', action: () => handleAIComplete(editor) },
  ];

  menuItems.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.classList.add('slash-menu-item');

    const IconComponent = item.icon;
    const iconWrapper = document.createElement('div');
    iconWrapper.classList.add('slash-menu-icon');
    iconWrapper.innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${getIconPath(item.icon.name)}</svg>`;

    const label = document.createElement('span');
    label.textContent = item.label;

    menuItem.appendChild(iconWrapper);
    menuItem.appendChild(label);
    menuItem.addEventListener('click', () => {
      item.action();
      menu.style.display = 'none';
    });

    menu.appendChild(menuItem);
  });

  return menu;
};

// Helper function to get icon SVG paths
const getIconPath = (iconName: string): string => {
  const iconPaths: Record<string, string> = {
    Heading2: '<path d="M4 12h8m-8 6V6m8 12V6m9 12h-6m0 0c0-1.7 1.3-3 3-3 1.7 0 3 1.3 3 3v0m-6 0v-6"/>',
    Heading3: '<path d="M4 12h8m-8 6V6m8 12V6m5.5 6.5c0-1.4 1.1-2.5 2.5-2.5v0m0 0c1.4 0 2.5 1.1 2.5 2.5S20.4 15 19 15c1.4 0 2.5 1.1 2.5 2.5S20.4 20 19 20c-1.4 0-2.5-1.1-2.5-2.5"/>',
    Heading4: '<path d="M4 12h8m-8 6V6m8 12V6m10 10v4m0-4h-5m5 0v-6"/>',
    Heading5: '<path d="M4 12h8m-8 6V6m8 12V6m10 4h-5v4h4c.6 0 1 .4 1 1v1c0 .6-.4 1-1 1h-4"/>',
    Heading6: '<path d="M4 12h8m-8 6V6m8 12V6m9 9c0 1.7-1.3 3-3 3s-3-1.3-3-3 1.3-3 3-3c1.1 0 2 .6 2.5 1.5"/>',
    Type: '<path d="M4 7V4h16v3M9 20h6M12 4v16"/>',
    List: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    ListOrdered: '<line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4m-1 0h2m-1 8V14m0 0h-1m1 0h1"/>',
    Quote: '<path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>',
    TableIcon: '<path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>',
    Smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
    Sparkles: '<path d="M12 3l1.912 5.813 6.088.387-4.5 4.1 1.912 5.813L12 16l-5.412 3.113L8.5 13.3 4 9.2l6.088-.387z"/>',
  };

  return iconPaths[iconName] || '';
};

const insertBlock = async (editor: EditorJS, type: string, data: any) => {
  const index = editor.blocks.getCurrentBlockIndex();
  await editor.blocks.insert(type, data, undefined, index + 1);
  editor.caret.setToBlock(index + 1);
};

const handleAIComplete = async (editor: EditorJS) => {
  const currentBlock = editor.blocks.getBlockByIndex(editor.blocks.getCurrentBlockIndex());
  if (!currentBlock) return;

  const blockData = await currentBlock.save();
  const text = blockData.data.text || '';

  if (!text.trim()) return;

  try {
    const response = await fetch('/api/ai/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });

    if (!response.ok) throw new Error('AI service error');

    const data = await response.json();
    if (data.completed) {
      await editor.blocks.update(blockData.id, {
        ...blockData.data,
        text: text + ' ' + data.completed
      });
    }
  } catch (error) {
    console.error('AI completion error:', error);
  }
};

// Main Editor Component
const ModernEditor: React.FC<ModernEditorProps> = ({ content, setContent }) => {
  const editorRef = useRef<EditorJS | null>(null);
  const holderRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState('');
  const slashMenuRef = useRef<HTMLDivElement | null>(null);

  // Initialize Editor
  useEffect(() => {
    if (!holderRef.current || editorRef.current) return;

    const editor = new EditorJS({
      holder: holderRef.current,
      placeholder: 'Start writing or type / for commands...',
      data: content,
      tools: {
        header: {
          class: Header,
          config: {
            levels: [2, 3, 4, 5, 6],
            defaultLevel: 2
          }
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        nestedList: {
          class: NestedList,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered'
          }
        },
        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: 'Enter a quote',
            captionPlaceholder: 'Quote author'
          }
        },
        table: {
          class: Table,
          inlineToolbar: true,
          config: {
            rows: 2,
            cols: 3
          }
        },
        delimiter: Delimiter,
        inlineCode: InlineCode,
        marker: {
          class: Marker,
          shortcut: 'CMD+SHIFT+M',
        },
        emoji: EmojiTool
      },
      onReady: () => {
        setIsReady(true);
        // setupSlashMenu(editor);
      },
      onChange: () => {
        saveContent();
      }
    });

    editorRef.current = editor;

    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  // Setup slash menu
  const setupSlashMenu = (editor: EditorJS) => {
    if (!holderRef.current) return;

    const slashMenu = createSlashMenu(editor);
    holderRef.current.appendChild(slashMenu);
    slashMenuRef.current = slashMenu;

    // Listen for slash key
    holderRef.current.addEventListener('keydown', (e) => {
      if (e.key === '/') {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        slashMenu.style.display = 'block';
        slashMenu.style.top = `${rect.bottom + window.scrollY + 5}px`;
        slashMenu.style.left = `${rect.left + window.scrollX}px`;
      } else if (e.key === 'Escape') {
        slashMenu.style.display = 'none';
      }
    });

    // Hide menu on click outside
    document.addEventListener('click', (e) => {
      if (!slashMenu.contains(e.target as Node)) {
        slashMenu.style.display = 'none';
      }
    });
  };

  // Save content
  const saveContent = useDebouncedCallback(async () => {
    if (!editorRef.current || !isReady) return;

    try {
      const data = await editorRef.current.save();
      setContent(data);
    } catch (error) {
      console.error('Error saving content:', error);
    }
  }, 300);

  // Track text selection
  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString());
      } else {
        setSelectedText('');
      }
    };

    document.addEventListener('selectionchange', handleSelection);
    return () => document.removeEventListener('selectionchange', handleSelection);
  }, []);

  // Format functions
  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
  };

  const applyAlignment = (align: string) => {
    applyFormat(`justify${align}`);
  };

  const applyColor = (color: string, isHighlight = false) => {
    applyFormat(isHighlight ? 'backColor' : 'foreColor', color);
  };

  // AI functions
  const handleAI = async (action: string) => {
    if (!selectedText.trim()) {
      alert('Please select some text first');
      return;
    }

    setIsLoading(action);

    try {
      const response = await fetch(`/api/ai/${action}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: selectedText })
      });

      if (!response.ok) throw new Error('AI service error');

      const data = await response.json();
      const resultKey = action === 'grammar' ? 'corrected' :
        action === 'shorten' ? 'shortened' :
          action === 'expand' ? 'expanded' : 'improved';

      if (data[resultKey]) {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(data[resultKey]));
        }
      }
    } catch (error) {
      console.error(`AI ${action} error:`, error);
      alert(`Failed to ${action} text. Please try again.`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="modern-editor-container">
      {/* Toolbar */}
      <div className="modern-editor-toolbar">
        {/* Text Formatting */}
        <div className="toolbar-group">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('bold')}
            className="toolbar-button"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('italic')}
            className="toolbar-button"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('underline')}
            className="toolbar-button"
          >
            <Underline className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyFormat('strikeThrough')}
            className="toolbar-button"
          >
            <Strikethrough className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Alignment */}
        <div className="toolbar-group">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyAlignment('Left')}
            className="toolbar-button"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyAlignment('Center')}
            className="toolbar-button"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => applyAlignment('Right')}
            className="toolbar-button"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Colors */}
        <div className="toolbar-group">
          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="toolbar-button">
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="color-picker">
                <h4 className="color-picker-title">Text Color</h4>
                <div className="color-grid">
                  {TEXT_COLORS.map(color => (
                    <button
                      key={color}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      onClick={() => applyColor(color)}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button type="button" variant="ghost" size="sm" className="toolbar-button">
                <Highlighter className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64">
              <div className="color-picker">
                <h4 className="color-picker-title">Highlight Color</h4>
                <div className="color-grid">
                  {HIGHLIGHT_COLORS.map(color => (
                    <button
                      key={color}
                      className="color-swatch"
                      style={{ backgroundColor: color }}
                      onClick={() => applyColor(color, true)}
                    />
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* AI Tools */}
        <div className="toolbar-group ai-group">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAI('grammar')}
            disabled={isLoading === 'grammar' || !selectedText}
            className="toolbar-button ai-button"
          >
            {isLoading === 'grammar' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <span>Grammar</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAI('shorten')}
            disabled={isLoading === 'shorten' || !selectedText}
            className="toolbar-button ai-button"
          >
            {isLoading === 'shorten' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowDownToLine className="h-4 w-4" />
            )}
            <span>Shorter</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAI('expand')}
            disabled={isLoading === 'expand' || !selectedText}
            className="toolbar-button ai-button"
          >
            {isLoading === 'expand' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpToLine className="h-4 w-4" />
            )}
            <span>Longer</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleAI('improve')}
            disabled={isLoading === 'improve' || !selectedText}
            className="toolbar-button ai-button"
          >
            {isLoading === 'improve' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4" />
            )}
            <span>Improve</span>
          </Button>
        </div>
      </div>

      {/* Editor Container */}
      <div ref={holderRef} className="modern-editor-content" />
    </div>
  );
};

export default ModernEditor;
