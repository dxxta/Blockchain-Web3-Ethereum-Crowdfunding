import { useState } from "react";
import { ActionIcon, FileButton, useMantineColorScheme } from "@mantine/core";
import { IconPhotoScan } from "@tabler/icons-react";
import { RichTextEditor, Link, RichTextEditorProps } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import Highlight from "@tiptap/extension-highlight";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import SubScript from "@tiptap/extension-subscript";
import Image from "@tiptap/extension-image";
import "@mantine/tiptap/styles.css";

export type textEditorImageProps = {
  src: string;
  newSource?: string;
  file: File;
};

type TextEditorProps = {
  value: string;
  onChangeValue: React.Dispatch<React.SetStateAction<string>>;
  onImagesChange: (value: textEditorImageProps[]) => void;
} & RichTextEditorProps;

const allowedImageTypes = [
  "image/bmp",
  "image/gif",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/tiff",
  "image/webp",
  "image/x-icon",
];

export const TextEditor = ({
  value,
  onChangeValue,
  onImagesChange,
  ...props
}: TextEditorProps) => {
  const [images, setImages] = useState<textEditorImageProps[]>([]);
  const { colorScheme } = useMantineColorScheme();
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      SubScript,
      Highlight,
      Image.configure({
        HTMLAttributes: {
          class: "project-image-content",
        },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (editor.getHTML() == "<p></p>") {
        onChangeValue("");
      } else {
        onChangeValue(editor.getHTML());
      }
    },
  });

  // const addImage = useCallback(() => {
  //   const url = window.prompt("URL");
  //   if (url) {
  //     editor?.chain().focus().setImage({ src: url }).run();
  //   }
  // }, [editor]);

  return (
    <RichTextEditor {...props} editor={editor} style={{ zIndex: 0 }}>
      <RichTextEditor.Toolbar>
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Bold />
          <RichTextEditor.Italic />
          <RichTextEditor.Underline />
          <RichTextEditor.Strikethrough />
          <RichTextEditor.ClearFormatting />
          <RichTextEditor.Highlight />
          <RichTextEditor.Code />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.H1 />
          <RichTextEditor.H2 />
          <RichTextEditor.H3 />
          <RichTextEditor.H4 />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Blockquote />
          <RichTextEditor.Hr />
          <RichTextEditor.BulletList />
          <RichTextEditor.OrderedList />
          <RichTextEditor.Subscript />
          <RichTextEditor.Superscript />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Link />
          <RichTextEditor.Unlink />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.AlignLeft />
          <RichTextEditor.AlignCenter />
          <RichTextEditor.AlignJustify />
          <RichTextEditor.AlignRight />
        </RichTextEditor.ControlsGroup>

        <RichTextEditor.ControlsGroup>
          <RichTextEditor.Undo />
          <RichTextEditor.Redo />
        </RichTextEditor.ControlsGroup>

        <FileButton
          onChange={(value) => {
            try {
              const url = URL.createObjectURL(value as Blob);
              editor?.chain().focus().setImage({ src: url }).run();

              const newSetOfImages = [...images, { src: url, file: value! }];
              setImages(newSetOfImages);

              if (typeof onImagesChange == "function") {
                onImagesChange(newSetOfImages);
              }
            } catch (error) {
              console.log(error);
            }
          }}
          accept={allowedImageTypes.join()}
        >
          {(props) => (
            <ActionIcon
              {...props}
              variant="subtle"
              c={colorScheme == "light" ? "black" : "white"}
              size="compact-sm"
            >
              <IconPhotoScan style={{ width: "70%" }} />
            </ActionIcon>
          )}
        </FileButton>
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
};
