export interface HTMLNode {
  type: "element" | "text"; // text와 non-text 노드 구분
  tagName?: string;
  attributes?: Record<string, string>; // class, id, onclick등
  children: HTMLNode[]; // 자식 노드들의 배열
  content?: string; // 텍스트 노드의 내용
}

export default function parse(htmlString: string): HTMLNode {
  // 루트 노드 생성
  const rootNode: HTMLNode = {
    type: "element",
    tagName: "root",
    children: [],
  };

  let currentPosition = 0;
  const stack: HTMLNode[] = [rootNode]; // 스택을 활용하여 노드의 계층 구조를 관리

  /*
  태그를 읽는 순서
  1. 여는 태그 확인하기
  2. <div>인지 </div>인지 확인하기
  3. </div>인 경우 마지막 요소 pop
  4. <div>인 경우 <div/>가 아니라면 새로운 노드 생성
  5. 둘 다 아니라면 텍스트 노드 생성
  */
  while (currentPosition < htmlString.length) {
    if (htmlString[currentPosition] === "<") {
      if (htmlString[currentPosition + 1] === "/") {
        const endTagStart = currentPosition;
        currentPosition = htmlString.indexOf(">", currentPosition) + 1;

        // 루트 노드를 제외한 나머지 요소 pop
        if (stack.length > 1) {
          stack.pop();
        }
      } else {
        const tagStart = currentPosition;

        let tagEnd = htmlString.indexOf(">", currentPosition);
        if (tagEnd === -1) {
          tagEnd = htmlString.length;
        }

        const tagContent = htmlString.substring(tagStart + 1, tagEnd);
        const spaceIndex = tagContent.indexOf(" ");

        const tagName =
          spaceIndex !== -1 ? tagContent.substring(0, spaceIndex) : tagContent;

        // 자체 닫는 태그인지 확인 <img /> 등
        const selfClosing = tagContent.endsWith("/");

        const newNode: HTMLNode = {
          type: "element",
          tagName: tagName.toLowerCase(),
          attributes: {},
          children: [],
        };

        // 속성 추출
        if (spaceIndex !== -1) {
          const attrString = tagContent.substring(spaceIndex + 1);
          const attrMatches = attrString.match(/(\w+)\s*=\s*"([^"]*)"/g);

          if (attrMatches) {
            attrMatches.forEach((attr) => {
              const [name, value] = attr.split("=").map((s) => s.trim());
              if (newNode.attributes) {
                newNode.attributes[name] = value.replace(/"/g, "");
              }
            });
          }
        }

        stack[stack.length - 1].children.push(newNode);

        if (!selfClosing) {
          stack.push(newNode);
        }

        currentPosition = tagEnd + 1;
      }
    } else {
      const textStart = currentPosition;
      let textEnd = htmlString.indexOf("<", currentPosition);
      if (textEnd === -1) {
        textEnd = htmlString.length;
      }

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

  return rootNode;
}
