import * as React from "react";
const SvgTransliterate = ({ title, titleId, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    id="transliterate_svg__svg2"
    width="1em"
    height="1em"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={0}
    aria-hidden="true"
    viewBox="0 0 24 24"
    aria-labelledby={titleId}
    {...props}
  >
    {title ? <title id={titleId}>{title}</title> : null}
    <defs id="transliterate_svg__defs2">
      <filter
        id="transliterate_svg__mask-powermask-path-effect57_inverse"
        width={100}
        height={100}
        x={-50}
        y={-50}
        style={{
          colorInterpolationFilters: "sRGB",
        }}
      >
        <feColorMatrix
          id="transliterate_svg__mask-powermask-path-effect57_primitive1"
          result="fbSourceGraphic"
          type="saturate"
          values={1}
        />
        <feColorMatrix
          id="transliterate_svg__mask-powermask-path-effect57_primitive2"
          in="fbSourceGraphic"
          values="-1 0 0 0 1 0 -1 0 0 1 0 0 -1 0 1 0 0 0 1 0"
        />
      </filter>
      <style id="style1" type="text/css">
        {".transliterate_svg__fil0{fill:#1f1a17;fill-rule:nonzero}"}
      </style>
    </defs>
    <g
      id="transliterate_svg__g43"
      style={{
        display: "inline",
      }}
      transform="matrix(.97108 0 0 .97108 .362 .335)"
    >
      <path
        id="transliterate_svg__path4"
        d="M5.609-.095c-1.264 0-2.272.003-2.711.008C1.347-.087.005.839.005 2.839v14.275c0 1.69 1.163 3.083 2.485 3.083h7.63a.927.927 0 0 0 .887-.666l5.386-18.433a.927.927 0 0 0-.89-1.185S9.4-.098 5.608-.095zm3.204 2.283h1.955v5.641s-.022 1.658-.022 3.094c0 1.472-.102 2.554-.558 3.439-.455.885-1.452 1.4-2.415 1.4-1.053 0-2.01-.673-2.456-1.587-.445-.914-.575-2.028-.575-3.373h1.957c0 1.194.162 2.072.378 2.514.216.442.286.49.696.49.5 0 .5 0 .676-.34.174-.339.338-1.193.338-2.543 0-.657.004-1.327.01-1.893a3.297 3.297 0 0 1-1.859.583c-.8.003-1.534-.216-2.073-.67a2.799 2.799 0 0 1-.642-.788 1.06 1.06 0 0 0-.14.292c-.117.369-.133 1.267-.107 3.133l-1.957.028c-.026-1.856-.096-2.82.197-3.749.245-.777.75-1.287 1.44-1.866-.067-.766-.053-1.576-.046-2.401a1.59 1.59 0 0 1-.145-.113c-.322-.284-.531-.73-.531-1.243h1.001c0 .263.08.394.191.493.113.099.285.16.463.159a.72.72 0 0 0 .465-.167c.114-.102.195-.232.195-.485H6.25c0 .507-.211.95-.53 1.233a1.656 1.656 0 0 1-.15.116c0 1.31.002 2.473.184 3.158.101.383.231.586.37.702.138.117.335.212.806.211.403-.001.637-.116.875-.326.238-.21.454-.54.614-.907.31-.71.39-1.445.394-1.49Z"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
          InkscapeStroke: "none",
          paintOrder: "stroke markers fill",
        }}
      />
      <path
        id="transliterate_svg__path34"
        d="m15.69 9.413-4.122 10.995H13.4l1.026-2.749h4.354l1.035 2.749h1.831L17.523 9.413Zm.918 2.446 1.484 3.967h-2.97z"
        style={{
          display: "inline",
          strokeWidth: 0,
        }}
      />
      <path
        id="transliterate_svg__path7"
        d="M14.73 3.738a.927.927 0 0 0-.89.666L8.46 22.835a.927.927 0 0 0 .889 1.187h12.649c1.144 0 2.03-.926 2.03-2.126V6.242c0-1.341-.667-2.504-2.382-2.504zm-.097 1.376c.036 0 .094.044.234.044h6.283c1.559 0 1.29.563 1.29 1.782v14.224c0 1.09.16 1.28-.88 1.28H10.787c-1.25 0 .088-2.368.22-2.913l2.977-12.308.65-2.109z"
        style={{
          strokeLinecap: "round",
          strokeLinejoin: "round",
          InkscapeStroke: "none",
          paintOrder: "stroke markers fill",
        }}
      />
    </g>
  </svg>
);
export default SvgTransliterate;
