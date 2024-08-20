'use client';

import Button from '@/_components/button';
import DirtyHtml from '@/_components/dirty-html';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import * as Modal from '@/_components/modal';
import Tip from '@/_components/tip';
import BoldIcon from '@heroicons/react/24/outline/BoldIcon';
import ItalicIcon from '@heroicons/react/24/outline/ItalicIcon';
import LinkIcon from '@heroicons/react/24/outline/LinkIcon';
import ListBulletIcon from '@heroicons/react/24/outline/ListBulletIcon';
import NumberedListIcon from '@heroicons/react/24/outline/NumberedListIcon';
import UnderlineIcon from '@heroicons/react/24/outline/UnderlineIcon';
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
      Link.configure({
        HTMLAttributes: { target: '_blank' },
        defaultProtocol: 'https',
      }).extend({ inclusive: false }),
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

  const [setLinkModal, setSetLinkModal] = React.useState<{
    href: string;
    text: string;
  } | null>(null);

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
        <>
          <TipTap.BubbleMenu
            className="overflow-hidden rounded border border-alpha-2 bg-bg-3 drop-shadow"
            editor={editor}
            tippyOptions={{ placement: 'bottom-start' }}
          >
            <IconButton
              className={twMerge(
                'm-0',
                editor.isActive('bold') && 'bg-alpha-1 text-fg-2',
              )}
              icon={<BoldIcon className="w-5" />}
              label="Bold"
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <IconButton
              className={twMerge(
                'm-0',
                editor.isActive('italic') && 'bg-alpha-1 text-fg-2',
              )}
              icon={<ItalicIcon className="w-5" />}
              label="Italic"
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <IconButton
              className={twMerge(
                'm-0',
                editor.isActive('underline') && 'bg-alpha-1 text-fg-2',
              )}
              icon={<UnderlineIcon className="w-5" />}
              label="Underline"
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />
            <IconButton
              className={twMerge(
                'm-0',
                editor.isActive('bulletList') && 'bg-alpha-1 text-fg-2',
              )}
              icon={<ListBulletIcon className="w-5" />}
              label="Bullet list"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            />
            <IconButton
              className={twMerge(
                'm-0',
                editor.isActive('orderedList') && 'bg-alpha-1 text-fg-2',
              )}
              icon={<NumberedListIcon className="w-5" />}
              label="Ordered list"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            />
            <IconButton
              className={twMerge(
                'm-0',
                editor.isActive('link') && 'bg-alpha-1 text-fg-2',
              )}
              icon={<LinkIcon className="w-5" />}
              label="Set link"
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .extendMarkRange('link')
                  .command(({ editor, state, tr }) => {
                    setSetLinkModal({
                      href: editor.getAttributes('link').href,
                      text:
                        state.doc.textBetween(
                          tr.selection.$from.pos,
                          tr.selection.$to.pos,
                          ' ',
                        ) ?? '',
                    });

                    return true;
                  })
              }
            />
          </TipTap.BubbleMenu>
          <TipTap.EditorContent editor={editor} name={name} />
        </>
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
      {!!setLinkModal && !!editor && (
        <Modal.Root onOpenChange={() => setSetLinkModal(null)} open>
          <Modal.Portal>
            <Modal.Overlay>
              <Modal.Content className="max-w-sm p-8 text-center">
                <Modal.Title className="text-2xl">Set link</Modal.Title>
                <form
                  className="mt-16 flex flex-col gap-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const data = new FormData(e.currentTarget);
                    const href = data.get('href') as string;
                    const text = data.get('text') as string;

                    editor
                      .chain()
                      .focus()
                      .extendMarkRange('link')
                      .insertContent(`<a href="${href}">${text}</a>`)
                      .run();

                    setSetLinkModal(null);
                  }}
                >
                  <Input
                    defaultValue={setLinkModal.text}
                    name="text"
                    placeholder="Link text"
                    required
                  />
                  <Input
                    defaultValue={setLinkModal.href}
                    name="href"
                    placeholder="https://..."
                    required
                    type="url"
                  />
                  <div className="flex gap-4">
                    <Button
                      className="w-full"
                      colorScheme="transparent"
                      onClick={() => {
                        editor
                          .chain()
                          .focus()
                          .extendMarkRange('link')
                          .unsetLink()
                          .run();

                        setSetLinkModal(null);
                      }}
                    >
                      Unset
                    </Button>
                    <Button className="w-full" type="submit">
                      Set
                    </Button>
                  </div>
                  <Modal.Close asChild onClick={(e) => e.preventDefault()}>
                    <Button
                      className="m-0 -mb-3 w-full justify-center p-0 py-3"
                      onClick={() => setSetLinkModal(null)}
                      variant="link"
                    >
                      Close
                    </Button>
                  </Modal.Close>
                </form>
              </Modal.Content>
            </Modal.Overlay>
          </Modal.Portal>
        </Modal.Root>
      )}
    </div>
  );
};

RichTextarea.displayName = 'RichTextarea';

export default React.forwardRef(RichTextarea);
