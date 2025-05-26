"use client";

import type { BlogFormValues } from "@/schemas/creator/blog-form.schema";
import { useFormContext } from "react-hook-form";
import ModernEditor from "@/components/editor/modern-editor";

// Editor.js data structure interface
interface EditorJSData {
  time?: number;
  blocks: Array<{
    id?: string;
    type: string;
    data: any;
  }>;
  version?: string;
}

const Step2 = () => {
  const { setValue, watch } = useFormContext<BlogFormValues>();
  const content = watch("content");

  // Ensure content is in EditorJS format
  const getEditorContent = (): EditorJSData => {
    // If no content, return empty editor structure
    if (!content) {
      return {
        blocks: [{ type: 'paragraph', data: { text: '' } }]
      };
    }

    // If content already has blocks property, it's already in EditorJS format
    if (content.blocks && Array.isArray(content.blocks)) {
      return content as EditorJSData;
    }

    // If content is a different format, try to convert it
    if (typeof content === 'object' && content.content) {
      return convertToEditorJS(content);
    }

    // Default: return empty editor
    return {
      blocks: [{ type: 'paragraph', data: { text: '' } }]
    };
  };

  // Convert from other formats to EditorJS format
  const convertToEditorJS = (otherContent: any): EditorJSData => {
    const blocks: any[] = [];

    if (otherContent.content && Array.isArray(otherContent.content)) {
      otherContent.content.forEach((node: any) => {
        if (node.type === 'paragraph') {
          const text = extractText(node);
          if (text || blocks.length === 0) {
            blocks.push({
              type: 'paragraph',
              data: { text }
            });
          }
        } else if (node.type === 'heading') {
          const text = extractText(node);
          const level = node.attrs?.level || 2;
          blocks.push({
            type: 'header',
            data: {
              text,
              level: Math.max(2, Math.min(6, level))
            }
          });
        } else if (node.type === 'bulletList' || node.type === 'orderedList') {
          const style = node.type === 'bulletList' ? 'unordered' : 'ordered';
          const items: string[] = [];

          node.content?.forEach((listItem: any) => {
            const itemText = extractText(listItem);
            if (itemText) {
              items.push(itemText);
            }
          });

          if (items.length > 0) {
            blocks.push({
              type: 'list',
              data: {
                style,
                items
              }
            });
          }
        } else if (node.type === 'blockquote') {
          const text = extractText(node);
          if (text) {
            blocks.push({
              type: 'quote',
              data: {
                text,
                caption: ''
              }
            });
          }
        }
      });
    }

    return {
      blocks: blocks.length > 0 ? blocks : [{ type: 'paragraph', data: { text: '' } }]
    };
  };

  // Helper function to extract text from nodes
  const extractText = (node: any): string => {
    if (node.text) return node.text;
    if (node.content && Array.isArray(node.content)) {
      return node.content
        .map((n: any) => extractText(n))
        .join('');
    }
    return '';
  };

  const handleContentChange = (newContent: EditorJSData) => {
    setValue("content", newContent);
  };

  return (
    <div className="w-full h-full min-h-[600px] bg-background">
      <ModernEditor
        content={getEditorContent()}
        setContent={handleContentChange}
      />
    </div>
  );
};

export default Step2;
