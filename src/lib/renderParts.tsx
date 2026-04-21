import React from "react";

export type ResultPart = string | { key: string };

export function renderParts(
  parts: ResultPart[] | undefined,
  values: Record<string, string>,
  styles: Record<string, React.CSSProperties>
) {
  return parts?.map((part, i) => {
    if (typeof part === "string") return <span key={i}>{part}</span>;
    return (
      <span
        key={i}
        style={styles[part.key] ?? styles.default}
      >
        {values[part.key] ?? ""}
      </span>
    );
  });
}
