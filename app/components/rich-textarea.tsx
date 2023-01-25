'use client';

import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import History from '@tiptap/extension-history';
import Italic from '@tiptap/extension-italic';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import Text from '@tiptap/extension-text';
import Typography from '@tiptap/extension-typography';
import { Content, EditorContent, useEditor } from '@tiptap/react';

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
          /* override the default behavior for enter. by returning true, it
          stops ProseMirror from calling any other handlers for the given input.
          read: https://prosemirror.net/docs/ref/#view.EditorProps */
          if (
            onEnter &&
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
        HardBreak.extend({
          addKeyboardShortcuts() {
            return {
              'Mod-Enter': () => this.editor.commands.setHardBreak(),
              'Shift-Enter': () => this.editor.commands.setHardBreak(),
            };
          },
        }),
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
