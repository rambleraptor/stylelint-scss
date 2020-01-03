import rule, { ruleName, messages } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
      @use color;
      a {
       background: color.adjust(#6b717f, $red: 15);
      }
    `,
      description: "Non-global function with different name"
    },
    {
      code: `
      @use color;
      a {
       background: color.red(#6b717f);
      }
    `,
      description: "Non-global function with different name"
    }
  ],

  reject: [
    {
      code: `
      a {
        background: adjust-color(#6b717f, $red: 15);
      }
    `,
      line: 3,
      message: messages.rejected("adjust-color"),
      description: "A function that is not using the module system"
    },
    {
      code: `
      a {
        background: red(#6b717f);
      }
    `,
      line: 3,
      message: messages.rejected("red"),
      description: "A function that is not using the module system"
    }
  ]
});
