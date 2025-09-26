// ProgressCircle.tsx
import { Component, JSX, createMemo, splitProps, Show } from "solid-js";

type Props = {
  /** 0–100; omit or set `indeterminate: true` for spinner mode */
  value?: number;
  /** Diameter in px */
  size?: number;
  /** Stroke width in px */
  strokeWidth?: number;
  /** Track (background) stroke color */
  trackColor?: string;
  /** Progress stroke color */
  progressColor?: string;
  /** Round line caps for a nicer end */
  rounded?: boolean;
  /** Animate dashoffset changes */
  animated?: boolean;
  /** Start angle in degrees (default -90 = 12 o’clock) */
  startAngle?: number;
  /** Reverse direction */
  counterClockwise?: boolean;
  /** Show text label in the center */
  showLabel?: boolean;
  /** Custom label formatter */
  labelFormatter?: (v: number) => string;
  /** Indeterminate spinner mode */
  indeterminate?: boolean;
  /** Optional title (tooltip) */
  title?: string;
  /** Extra props for outer wrapper */
  class?: string;
  style?: JSX.CSSProperties;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

const ProgressCircle: Component<Props> = (allProps) => {
  const [props, rest] = splitProps(allProps, [
    "value",
    "size",
    "strokeWidth",
    "trackColor",
    "progressColor",
    "rounded",
    "animated",
    "startAngle",
    "counterClockwise",
    "showLabel",
    "labelFormatter",
    "indeterminate",
    "title",
    "class",
    "style",
  ]);

  const size = () => props.size ?? 16;
  const strokeW = () => props.strokeWidth ?? 3;
  const r = () => (size() - strokeW()) / 2;
  const c = () => 2 * Math.PI * r();
  const startAngle = () => (props.startAngle ?? -90) * (Math.PI / 180);

  const value = () =>
    props.indeterminate ? undefined : clamp(props.value ?? 0, 0, 100);
  const offset = createMemo(() =>
    value() == null ? 0 : c() * (1 - value()! / 100)
  );

const ariaProps = (): JSX.AriaAttributes & { role: "progressbar" } =>
  props.indeterminate
    ? {
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-busy": true as const, // or just true
      }
    : {
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": value()!, // non-null since not indeterminate
      };

  // Unique gradient id if you later want to add gradients; left simple for now
  const cap = () => (props.rounded ? "round" : "butt");

  return (
    <div
      class={props.class}
      style={{
        position: "relative",
        display: "inline-block",
        width: `${size()}px`,
        height: `${size()}px`,
        ...props.style,
      }}
      title={props.title}
      {...ariaProps()}
    >
      {/* Optional keyframes for indeterminate rotation */}
      <style>
        {`
        @keyframes pc-rotate { to { transform: rotate(360deg); } }
        @keyframes pc-dash {
          0%   { stroke-dasharray: 1, ${c()}; stroke-dashoffset: 0; }
          50%  { stroke-dasharray: ${c() * 0.6}, ${c()}; stroke-dashoffset: -${
          c() * 0.15
        }; }
          100% { stroke-dasharray: 1, ${c()}; stroke-dashoffset: -${c()}; }
        }
      `}
      </style>

      <svg
        aria-hidden={true}
        width={size()}
        height={size()}
        viewBox={`0 0 ${size()} ${size()}`}
        style={{
          transform: `rotate(${
            props.counterClockwise ? -startAngle() : startAngle()
          }rad)`,
          "transform-origin": "50% 50%",
          ...(props.indeterminate
            ? {
                animation: "pc-rotate 1.4s linear infinite",
              }
            : {}),
        }}
      >
        {/* Track */}
        <circle
          cx={size() / 2}
          cy={size() / 2}
          r={r()}
          fill="none"
          stroke={props.trackColor ?? "rgba(0,0,0,0.1)"}
          stroke-width={strokeW()}
          stroke-linecap={cap()}
        />
        {/* Progress */}
        <circle
          cx={size() / 2}
          cy={size() / 2}
          r={r()}
          fill="none"
          stroke={props.progressColor ?? "currentColor"}
          stroke-width={strokeW()}
          stroke-linecap={cap()}
          stroke-dasharray={`${c()} ${c()}`}
          stroke-dashoffset={
            props.counterClockwise
              ? value() == null
                ? 0
                : -offset()
              : offset()
          }
          style={{
            transition:
              props.animated && !props.indeterminate
                ? "stroke-dashoffset 300ms ease"
                : undefined,
            ...(props.indeterminate
              ? { animation: "pc-dash 1.4s ease-in-out infinite" }
              : {}),
          }}
        />
      </svg>

      <Show when={props.showLabel && !props.indeterminate}>
        <span
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            "place-items": "center",
            "font-size": `${Math.max(12, Math.round(size() * 0.2))}px`,
            "user-select": "none",
          }}
        >
          {props.labelFormatter
            ? props.labelFormatter(value()!)
            : `${value()}%`}
        </span>
      </Show>
    </div>
  );
};

export default ProgressCircle;
