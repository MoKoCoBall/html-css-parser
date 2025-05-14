import parse, { HTMLNode } from "./parse.js";

const htmlString = `
<html>
  <head>
    <title>Hello</title>
  </head>
  <body>
    <div class="hello-container">Hello</div>
    <div class="world-container">World</div>
    <div class="button-container">
      <button>Click me</button>
      <span id="hello-span">Hello <strong>Strong</strong> World</span>
    </div>
  </body>
</html>`;

const parsedResult: HTMLNode = parse(htmlString);

console.log(JSON.stringify(parsedResult, null, 2));
