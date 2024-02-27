'use client';

import Tooltip from '@/_components/tooltip';
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
import { twMerge } from 'tailwind-merge';
import DirtyHtml from './dirty-html';

import {
  Content,
  Editor,
  EditorContent,
  Extension,
  KeyboardShortcutCommand,
  useEditor,
} from '@tiptap/react';

import {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  ReactNode,
  Ref,
  TextareaHTMLAttributes,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';

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
  }: Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'value'> & {
    label?: string;
    onEnter?: (e: KeyboardEvent) => void;
    right?: ReactNode;
    tooltip?: ReactNode;
    value?: string | null;
  },
  ref: Ref<{ focus: () => void }>,
) => {
  const editorRef: MutableRefObject<Editor | null> = useRef(null);

  const editor = useEditor({
    content: value as Content,
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
      Youtube.configure({ modestBranding: true }),
      Extension.create({
        addKeyboardShortcuts() {
          const handleEnter: KeyboardShortcutCommand = ({ editor }) => {
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
      } as ChangeEvent<HTMLTextAreaElement>);
    },
  });

  useEffect(() => {
    if (!editor || value === editorRef.current?.getHTML()) return;
    editor.commands.setContent(value ?? '');
  }, [editor, value]);

  useEffect(() => {
    editorRef.current = editor;
  }, [editor]);

  useImperativeHandle(ref, () => ({
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
          <Tooltip
            className="relative -top-1 -mr-[0.15rem]"
            id={`${name}-tip`}
            tip={tooltip}
          />
        )}
      </div>
      {editor ? (
        <EditorContent editor={editor} name={name} />
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
export default forwardRef(RichTextarea);
