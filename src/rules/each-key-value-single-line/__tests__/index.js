import rule, { messages, ruleName } from "..";

testRule(rule, {
  ruleName,
  config: [true],
  syntax: "scss",

  accept: [
    {
      code: `
      $font-weights: ("regular": 400, "medium": 500, "bold": 700);
      @each $key, $value in $font-weights {}
      `,
      description: "Proper map loop that gets both keys + values"
    },
    {
      code: `
      $font-weights: ("regular": 400, "medium": 500, "bold": 700);
      @each $key in map-keys($font-weights) {}
      `,
      description: "Loop that just gets keys + has no need for values"
    }
  ],

  reject: [
    {
      code: `
      $font-weights: ("regular": 400, "medium": 500, "bold": 700);
      @each $key in map-keys($font-weights) {
        $value: map-get($font-weights, $key);
      }
      `,
      description: "Loop that gets keys + then grabs values inside the map",
      message: messages.rejected,
      line: 4
    }
  ]
});