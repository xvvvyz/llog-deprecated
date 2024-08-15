'use client';

import Tip from '@/_components/tip';
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
import Underline from '@tiptap/extension-underline';
import Youtube from '@tiptap/extension-youtube';
import * as TipTap from '@tiptap/react';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';
import DirtyHtml from './dirty-html';

const RichTextarea = (
  {
    'aria-label': ariaLabel,
    className,
    name,
    label,
    onChange,
    onEnter,
    placeholder,
    right,
    tooltip,
    value,
  }: Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> & {
    label?: string;
    onEnter?: (e: KeyboardEvent) => void;
    right?: React.ReactNode;
    tooltip?: React.ReactNode;
    value?: string | null;
  },
  ref: React.Ref<{ focus: () => void }>,
) => {
  const editorRef: React.MutableRefObject<TipTap.Editor | null> =
    React.useRef(null);

  const editor = TipTap.useEditor({
    content: value as TipTap.Content,
    editorProps: {
      attributes: {
        'aria-label': ariaLabel ?? '',
        class: twMerge(
          'prose input cursor-text min-h-[4.2rem]',
          right && 'pr-10',
          className,
        ),
        role: 'textbox',
      },
      handleKeyDown: (view, e: KeyboardEvent) => {
        if (
          onEnter &&
          e.target &&
          e.key === 'Enter' &&
          !e.shiftKey &&
          !e.altKey &&
          !e.ctrlKey &&
          !e.metaKey
        ) {
          onEnter(e);
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
          'first:before:text-fg-4 first:before:absolute first:before:content-[attr(data-placeholder)]',
        placeholder,
      }),
      Text,
      Typography,
      Underline,
      Youtube.configure({ disableKBcontrols: true, modestBranding: true }),
      TipTap.Extension.create({
        addKeyboardShortcuts() {
          const handleEnter: TipTap.KeyboardShortcutCommand = ({ editor }) => {
            editor.commands.enter();
            return true;
          };

          return { 'Mod-Enter': handleEnter, 'Shift-Enter': handleEnter };
        },
      }),
    ],
    injectCSS: false,
    onUpdate: ({ editor }) => {
      if (!onChange) return;

      onChange({
        target: {
          name,
          value: editor.getHTML() === '<p></p>' ? '' : editor.getHTML(),
        },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    },
  });

  React.useEffect(() => {
    if (!editor || value === editorRef.current?.getHTML()) return;
    editor.commands.setContent(value ?? '');
  }, [editor, value]);

  React.useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  React.useImperativeHandle(ref, () => ({
    focus() {
      // hack to get newly created textarea to focus via react-hook-form
      setTimeout(() => editorRef.current?.commands.focus('end'), 10);
    },
  }));

  return (
    <div className="group relative w-full">
      <div className="flex justify-between">
        {label && (
          <label
            className="label"
            onClick={() => editorRef.current?.commands?.focus('end')}
          >
            {label}
          </label>
        )}
        {tooltip && (
          <Tip className="relative -top-1 -mr-[0.2rem]" side="left">
            {tooltip}
          </Tip>
        )}
      </div>
      {editor ? (
        <TipTap.EditorContent editor={editor} name={name} />
      ) : (
        <DirtyHtml
          className={twMerge(
            'input min-h-[4.2rem]',
            !value && 'text-fg-4',
            right && 'pr-10',
            className,
          )}
        >
          {value || `<p>${placeholder ?? '‎'}</p>`}
        </DirtyHtml>
      )}
      {right && (
        <div className="absolute right-0 top-0 flex h-full w-10 flex-col items-center justify-start">
          {right}
        </div>
      )}
    </div>
  );
};

RichTextarea.displayName = 'RichTextarea';

export default React.forwardRef(RichTextarea);
