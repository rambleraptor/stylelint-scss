import { utils } from "stylelint";
import { namespace } from "../../utils";
import valueParser from "postcss-value-parser";

export const ruleName = namespace("no-non-numeric-dimensions");

export const messages = utils.ruleMessages(ruleName, {
  rejected: "Expected `$value * 1px` instead of `#{value}px"
});

export const units = [
  // Font-relative lengths:
  // https://www.w3.org/TR/css-values-4/#font-relative-lengths
  "em",
  "ex",
  "cap",
  "ch",
  "ic",
  "rem",
  "lh",
  "rlh",

  // Viewport-relative lengths:
  // https://www.w3.org/TR/css-values-4/#viewport-relative-lengths
  "vw",
  "vh",
  "vi",
  "vb",
  "vmin",
  "vmax",

  // Absolute lengths:
  // https://www.w3.org/TR/css-values-4/#absolute-lengths
  "cm",
  "mm",
  "Q",
  "in",
  "pc",
  "pt",
  "px",

  // Angle units:
  // https://www.w3.org/TR/css-values-4/#angles
  "deg",
  "grad",
  "rad",
  "turn",

  // Duration units:
  // https://www.w3.org/TR/css-values-4/#time
  "s",
  "ms",

  // Frequency units:
  // https://www.w3.org/TR/css-values-4/#frequency
  "Hz",
  "kHz",

  // Resolution units:
  // https://www.w3.org/TR/css-values-4/#resolution
  "dpi",
  "dpcm",
  "dppx",
  "x",

  // Flexible lengths:
  // https://www.w3.org/TR/css-grid-1/#fr-unit
  "fr",

  // Percentage:
  // https://www.w3.org/TR/css-values-4/#percentages
  "%"
];

export default function rule(primary) {
  return (root, result) => {
    const validOptions = utils.validateOptions(result, ruleName, {
      actual: primary
    });

    if (!validOptions) {
      return;
    }

    root.walkDecls(decl => {
      valueParser(decl.value).walk(node => {
        // All words are non-quoted, while strings are quoted.
        // If quoted, it's probably a deliberate non-numeric dimension.
        if (node.type !== "word") {
          return;
        }

        if (!isInterpolated(node.value)) {
          return;
        }

        utils.report({
          ruleName,
          result,
          message: messages.rejected,
          node: decl
        });
      });
    });
  };
}

function isInterpolated(value) {
  let boolean = false;

  units.forEach(unit => {
    const regex = new RegExp("#{[a-z_-]*}" + unit);

    if (value.match(regex)) {
      boolean = true;
    }
  });

  return boolean;
}