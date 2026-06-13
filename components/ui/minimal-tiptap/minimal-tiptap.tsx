import "./styles/index.css"

import type { Content, Editor } from "@tiptap/react"
import type { UseMinimalTiptapEditorProps } from "./hooks/use-minimal-tiptap"
import { EditorContent, EditorContext } from "@tiptap/react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { SectionOne } from "./components/section/one"
import { SectionTwo } from "./components/section/two"
import { SectionThree } from "./components/section/three"
import { SectionFour } from "./components/section/four"
import { SectionFive } from "./components/section/five"
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu"
import { useMinimalTiptapEditor } from "./hooks/use-minimal-tiptap"
import { MeasuredContainer } from "./components/measured-container"
import { useTiptapEditor } from "./hooks/use-tiptap-editor"

export interface MinimalTiptapProps extends Omit<
  UseMinimalTiptapEditorProps,
  "onUpdate"
> {
  value?: Content
  onChange?: (value: Content) => void
  className?: string
  editorContentClassName?: string
  uploader?: (file: File) => Promise<string>
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="border-border tiptap-toolbar flex h-11 min-w-0 max-w-full shrink-0 overflow-x-auto overflow-y-hidden border-b px-2 py-1.5 sm:h-12 sm:p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-1 sm:mx-2 h-6 sm:h-8" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-1 sm:mx-2 h-6 sm:h-8" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-1 sm:mx-2 h-6 sm:h-8" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-1 sm:mx-2 h-6 sm:h-8" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />
    </div>
  </div>
)

export const MinimalTiptapEditor = ({
  value,
  onChange,
  className,
  editorContentClassName,
  uploader,
  ...props
}: MinimalTiptapProps) => {
  const editor = useMinimalTiptapEditor({
    value,
    onUpdate: onChange,
    uploader,
    ...props,
  })

  if (!editor) {
    return null
  }

  return (
    <EditorContext.Provider value={{ editor }}>
      <MainMinimalTiptapEditor
        editor={editor}
        className={className}
        editorContentClassName={editorContentClassName}
      />
    </EditorContext.Provider>
  )
}

MinimalTiptapEditor.displayName = "MinimalTiptapEditor"

export default MinimalTiptapEditor

export const MainMinimalTiptapEditor = ({
  editor: providedEditor,
  className,
  editorContentClassName,
}: MinimalTiptapProps & { editor: Editor }) => {
  const { editor } = useTiptapEditor(providedEditor)

  if (!editor) {
    return null
  }

  return (
    <MeasuredContainer
      as="div"
      name="editor"
      className={cn(
        "border-input min-data-[orientation=vertical]:h-72 flex h-auto min-w-0 max-w-full flex-col overflow-hidden rounded-md border shadow-xs",
        "focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]",
        className
      )}
    >
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className={cn("minimal-tiptap-editor", editorContentClassName)}
      />
      <LinkBubbleMenu editor={editor} />
    </MeasuredContainer>
  )
}
