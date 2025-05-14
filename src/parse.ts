export interface HTMLNode {
  type: "element" | "text";
  tagName?: string;
  attributes?: Record<string, string>;
  children: HTMLNode[];
  content?: string;
}

export default function parse(htmlString: string): HTMLNode {
  const root: HTMLNode = {
    type: "element",
    tagName: "root",
    children: [],
  };

  let currentPosition = 0;
  const stack: HTMLNode[] = [root];

  while (currentPosition < htmlString.length) {
    // </> 태그 찾기
    if (htmlString[currentPosition] === "<") {
      if (htmlString[currentPosition + 1] === "/") {
        const endTagStart = currentPosition;
        currentPosition = htmlString.indexOf(">", currentPosition) + 1;

        if (stack.length > 1) {
          stack.pop();
        }
      }
      // 여는 태그 찾기
      else {
        const tagStart = currentPosition;

        let tagEnd = htmlString.indexOf(">", currentPosition);
        if (tagEnd === -1) tagEnd = htmlString.length;

        const tagContent = htmlString.substring(tagStart + 1, tagEnd);
        const spaceIndex = tagContent.indexOf(" ");

        const tagName =
          spaceIndex !== -1 ? tagContent.substring(0, spaceIndex) : tagContent;

        // 자체 닫는 태그 확인 (예: <img />)
        const selfClosing = tagContent.endsWith("/");

        // 새 노드 생성
        const newNode: HTMLNode = {
          type: "element",
          tagName: tagName.toLowerCase(),
          attributes: {},
          children: [],
        };

        // 속성 추출 (간단한 구현)
        if (spaceIndex !== -1) {
          const attrString = tagContent.substring(spaceIndex + 1);
          const attrMatches = attrString.match(/(\w+)="([^"]*)"/g);

          if (attrMatches) {
            attrMatches.forEach((attr) => {
              const [name, value] = attr.split("=");
              if (newNode.attributes) {
                newNode.attributes[name] = value.replace(/"/g, "");
              }
            });
          }
        }

        // 현재 스택의 마지막 노드에 추가
        stack[stack.length - 1].children.push(newNode);

        // 자체 닫는 태그가 아니면 스택에 추가
        if (!selfClosing) {
          stack.push(newNode);
        }

        currentPosition = tagEnd + 1;
      }
    } else {
      const textStart = currentPosition;
      let textEnd = htmlString.indexOf("<", currentPosition);
      if (textEnd === -1) textEnd = htmlString.length;

      const text = htmlString.substring(textStart, textEnd).trim();

      if (text) {
        const textNode: HTMLNode = {
          type: "text",
          content: text,
          children: [],
        };

        stack[stack.length - 1].children.push(textNode);
      }

      currentPosition = textEnd;
    }
  }

  return root;
}
