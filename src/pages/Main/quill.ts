import Quill, { Parchment } from "quill";
import "./quill.css";

const Inline = Quill.import("blots/inline") as Parchment.BlotConstructor;

class CustomHighlight extends Inline {
  static blotName = "customHighlight";
  static tagName = "span";
  static create(id: string) {
    const node = super.create() as HTMLSpanElement;
    node.setAttribute("id", id);
    node.setAttribute("class", "typo-highlight transition badge-error");
    return node;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static formats(node: HTMLSpanElement) {
    return node.getAttribute("id");
  }
}

Quill.register(CustomHighlight);

export const setupQuill = (dom: HTMLDivElement) => {
  const quillInst = new Quill(dom, {
    placeholder: "請貼上你的文章",
  });
  quillInst.scroll.domNode.addEventListener("compositionstart", () => {
    if (quillInst.editor.isBlank()) {
      quillInst.root.classList.remove("ql-blank");
    }
  });
  return quillInst;
};
