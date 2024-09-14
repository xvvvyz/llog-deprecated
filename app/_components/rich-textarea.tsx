'use client';

import Button from '@/_components/button';
import DirtyHtml from '@/_components/dirty-html';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import * as Modal from '@/_components/modal';
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

type RichTextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  'value'
> & {
  onEnter?: (e: KeyboardEvent) => void;
  value?: string | null;
};

const RichTextarea = React.forwardRef<{ focus: () => void }, RichTextareaProps>(
  (
    {
      'aria-label': ariaLabel,
      className,
      id,
      name,
      onChange,
      onEnter,
      placeholder,
      value,
    },
    ref,
  ) => {
    const editorRef: React.MutableRefObject<TipTap.Editor | null> =
      React.useRef(null);

    const editor = TipTap.useEditor({
      content: value as TipTap.Content,
      editorProps: {
        attributes: {
          'aria-label': ariaLabel ?? '',
          class: twMerge(
            'prose input group-hover:bg-alpha-2 cursor-text min-h-[4.2rem]',
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
          emptyEditorClass:
            'first:before:text-fg-4 first:before:absolute first:before:content-[attr(data-placeholder)]',
          placeholder: ({ node }) =>
            node.childCount > 0 ? '' : (placeholder ?? ''),
        }),
        Text,
        Typography,
        Underline,
        Youtube.configure({ disableKBcontrols: true, modestBranding: true }),
        TipTap.Extension.create({
          addKeyboardShortcuts() {
            const handleEnter: TipTap.KeyboardShortcutCommand = ({
              editor,
            }) => {
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
      editorRef.current = editor;
    }, [editor]);

    React.useEffect(() => {
      if (value === editorRef.current?.getHTML()) return;
      editorRef.current?.commands.setContent(value ?? '');
    }, [value]);

    React.useEffect(() => {
      if (!name) return;
      const label = document.querySelector(`[for="${id ?? name}"]`);
      if (!label) return;
      const listener = () => editorRef.current?.commands.focus('end');
      label.addEventListener('click', listener);
      return () => label.removeEventListener('click', listener);
    }, [id, name]);

    React.useImperativeHandle(ref, () => ({
      focus() {
        // hack to get newly created textarea to focus via react-hook-form
        setTimeout(() => editorRef.current?.commands.focus('end'), 10);
      },
    }));

    return (
      <>
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
              className,
            )}
          >
            {value || `<p>${placeholder ?? '‎'}</p>`}
          </DirtyHtml>
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
      </>
    );
  },
);

RichTextarea.displayName = 'RichTextarea';

export default RichTextarea;
