'use client';

import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import Typography from '@tiptap/extension-typography';
import { Content, EditorContent, Extension, useEditor } from '@tiptap/react';

import {
  ChangeEvent,
  forwardRef,
  TextareaHTMLAttributes,
  useEffect,
} from 'react';

import { twMerge } from 'tailwind-merge';

interface RichTextareaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  onEnter?: () => void;
}

const RichTextarea = forwardRef<HTMLTextAreaElement, RichTextareaProps>(
  ({ className, name, onChange, onEnter, placeholder, value }, ref) => {
    const editor = useEditor({
      content: value as Content,
      editorProps: {
        attributes: {
          class: twMerge('prose input', className),
        },
        handleKeyDown: (view, e) => {
          if (
            onEnter &&
            e.target &&
            e.key === 'Enter' &&
            !e.shiftKey &&
            !e.altKey &&
            !e.ctrlKey &&
            !e.metaKey
          ) {
            onEnter();
            return true;
          }
        },
      },
      extensions: [
        Bold,
        BulletList,
        Document,
        History,
        Italic,
        Link.configure({ HTMLAttributes: { target: '_blank' } }),
        ListItem,
        OrderedList,
        Paragraph,
        Placeholder.configure({
          emptyNodeClass:
            'first:before:text-alpha-4 first:before:absolute first:before:content-[attr(data-placeholder)]',
          placeholder,
        }),
        Text,
        Typography,
        Extension.create({
          addKeyboardShortcuts() {
            return {
              'Shift-Enter': ({ editor }) => {
                editor.commands.enter();
                return true;
              },
            };
          },
        }),
      ],
      injectCSS: false,
      onUpdate: ({ editor }) => {
        if (!onChange) return;

        onChange({
          target: { name, value: editor.getHTML() },
        } as ChangeEvent<HTMLTextAreaElement>);
      },
    });

    useEffect(() => {
      if (!editor || value) return;
      editor.commands.setContent('');
    });

    return <EditorContent editor={editor} name={name} ref={() => ref} />;
  }
);

RichTextarea.displayName = 'RichTextarea';
export default RichTextarea;
