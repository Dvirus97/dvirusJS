export type RgbaCss = `rgba(${number},${number},${number}${`,${number}` | ""})`;

type GapType = "margin" | "padding";
type GapPosition = "top" | "right" | "bottom" | "left" | "inline" | "block";

export type GapCss = GapType | `${GapType}-${GapPosition}`;

type SizeType = "px" | "rem";

export type SizeCss = `${number}${SizeType}`;

type MarginPadding = {
    [key in GapCss]?: SizeCss;
};

function main() {
    const color: RgbaCss = "rgba(1, 2, 3)";

    const margin: MarginPadding = {
        "margin-top": "10px",
        "margin-bottom": "20rem",
        "padding-inline": "30px",
        "padding-block": "40rem",
        padding: "50px",
    };
}
