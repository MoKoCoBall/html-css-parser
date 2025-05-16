import parse, { HTMLNode } from "./parse.js";

const htmlString = `
<html>
  <head>
    <title>Hello</title>
  </head>
  <body>
    <div class="hello">Hello</div>
    <div class="world">World</div>
    <div class="button">
      <button>Click me</button>
      <p><img src="*" alt="image" />Image</p>
      <span id="span">Hello World</span>
    </div>
  </body>
</html>`;

const parsedResult: HTMLNode = parse(htmlString);

console.log(JSON.stringify(parsedResult, null, 2));
