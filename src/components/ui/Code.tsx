"use client";

import { cn } from "@/lib/utils";
import { Highlight, themes } from "prism-react-renderer";
import React from "react";

// Inline code span for use within text
interface InlineCodeProps extends React.HTMLAttributes<HTMLElement> {
  children: string;
}

export function InlineCode({ children, className, ...props }: InlineCodeProps) {
  return (
    <code
      className={cn(
        "px-1.5 py-0.5 rounded-md text-[0.9em]",
        "bg-zinc-100 text-zinc-800",
        "font-mono font-medium",
        "border border-zinc-200",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

// Full code block with syntax highlighting
interface CodeBlockProps {
  children: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeBlock({
  children,
  language,
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const code = children.trim();
  const highlightLanguage = language || "typescript";

  return (
    <div
      className={cn(
        "w-full max-w-text-content mx-auto rounded-xl overflow-hidden",
        "border border-zinc-200 bg-zinc-50",
        className
      )}
    >
      {/* Header with filename and language */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-100 border-b border-zinc-200">
          {filename && (
            <span className="text-sm font-mono text-zinc-600">{filename}</span>
          )}
          {!filename && language && (
            <span className="text-sm font-mono text-zinc-500 uppercase tracking-wider">
              {language}
            </span>
          )}
          {filename && language && (
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>
      )}

      {/* Code content */}
      <Highlight theme={themes.github} code={code} language={highlightLanguage}>
        {({
          className: highlightClass,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            className={cn(
              highlightClass,
              "p-4 overflow-x-auto text-sm leading-relaxed",
              "font-mono"
            )}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => {
              const { key: lineKey, ...lineProps } = getLineProps({ line });
              return (
                <div
                  key={i}
                  {...lineProps}
                  className={cn(lineProps.className, "table-row")}
                >
                  {showLineNumbers && (
                    <span className="table-cell pr-4 text-zinc-400 select-none text-right w-8">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell">
                    {line.map((token, j) => {
                      const { key: tokenKey, ...tokenProps } = getTokenProps({
                        token,
                      });
                      return <span key={j} {...tokenProps} />;
                    })}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}

// Dark theme variant
export function CodeBlockDark({
  children,
  language,
  filename,
  showLineNumbers = false,
  className,
}: CodeBlockProps) {
  const code = children.trim();
  const highlightLanguage = language || "typescript";

  return (
    <div
      className={cn(
        "w-full max-w-text-content mx-auto rounded-xl overflow-hidden",
        "border border-zinc-800 bg-zinc-900",
        className
      )}
    >
      {/* Header with filename and language */}
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-800 border-b border-zinc-700">
          <div className="flex items-center gap-2">
            {/* Traffic lights */}
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            {filename && (
              <span className="text-sm font-mono text-zinc-400 ml-2">
                {filename}
              </span>
            )}
          </div>
          {language && (
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>
      )}

      {/* Code content */}
      <Highlight theme={themes.vsDark} code={code} language={highlightLanguage}>
        {({
          className: highlightClass,
          style,
          tokens,
          getLineProps,
          getTokenProps,
        }) => (
          <pre
            className={cn(
              highlightClass,
              "p-4 overflow-x-auto text-sm leading-relaxed",
              "font-mono"
            )}
            style={{ ...style, backgroundColor: "transparent" }}
          >
            {tokens.map((line, i) => {
              const { key: lineKey, ...lineProps } = getLineProps({ line });
              return (
                <div
                  key={i}
                  {...lineProps}
                  className={cn(lineProps.className, "table-row")}
                >
                  {showLineNumbers && (
                    <span className="table-cell pr-4 text-zinc-600 select-none text-right w-8">
                      {i + 1}
                    </span>
                  )}
                  <span className="table-cell">
                    {line.map((token, j) => {
                      const { key: tokenKey, ...tokenProps } = getTokenProps({
                        token,
                      });
                      return <span key={j} {...tokenProps} />;
                    })}
                  </span>
                </div>
              );
            })}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
