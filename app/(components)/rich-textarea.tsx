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
import { twMerge } from 'tailwind-merge';
import DirtyHtml from './dirty-html';

import {
  Content,
  Editor,
  EditorContent,
  Extension,
  useEditor,
} from '@tiptap/react';

import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  MutableRefObject,
  ReactNode,
  TextareaHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

const RichTextarea = forwardRef(
  (
    {
      'aria-label': ariaLabel,
      className,
      name,
      onChange,
      onEnter,
      placeholder,
      right,
      value,
    }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
      onEnter?: () => void;
      right?: ReactNode;
      value?: string | null;
    },
    ref: ForwardedRef<{ focus: () => void }>
  ) => {
    const editorRef: MutableRefObject<Editor | null> = useRef(null);

    useImperativeHandle(ref, () => ({
      focus() {
        // hack to get newly created textarea to focus via react-hook-form
        setTimeout(() => editorRef.current?.commands.focus('end'), 10);
      },
    }));

    const editor = useEditor({
      content: value as Content,
      editorProps: {
        attributes: {
          'aria-label': ariaLabel ?? '',
          class: twMerge('prose input', right && 'pr-[2.4rem]', className),
          role: 'textbox',
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
            'first:before:text-fg-3 first:before:absolute first:before:content-[attr(data-placeholder)]',
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
    }, [editor, value]);

    useEffect(() => {
      editorRef.current = editor;
    }, [editor]);

    if (!editor) {
      return (
        <DirtyHtml
          className={twMerge('input', !value && 'text-fg-3', className)}
        >
          {value || `<p>${placeholder ?? ''}</p>`}
        </DirtyHtml>
      );
    }

    return (
      <div className="relative">
        <EditorContent editor={editor} name={name} />
        {right && (
          <div className="absolute right-0 top-0 flex h-full w-[2.4rem] items-center justify-center">
            {right}
          </div>
        )}
      </div>
    );
  }
);

RichTextarea.displayName = 'RichTextarea';
export default RichTextarea;
