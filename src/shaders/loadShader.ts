/**
 * Tiny GLSL preprocessor.
 *
 * Replaces `#include "name"` directives in a shader source with the
 * contents of the matching entry from the `includes` map. Matches the
 * whole line (leading whitespace allowed), so the directive can sit on
 * its own line anywhere in the file.
 *
 * Includes are resolved once, non-recursively. If an include itself
 * contains `#include` directives, re-run the preprocessor on it first.
 */
const INCLUDE_RE = /^[ \t]*#include\s+"([^"]+)"[ \t]*$/gm;

export function loadShader(
  source: string,
  includes: Record<string, string> = {}
): string {
  return source.replace(INCLUDE_RE, (_match, name: string) => {
    const chunk = includes[name];
    if (chunk === undefined) {
      throw new Error(`[loadShader] Missing GLSL include: "${name}"`);
    }
    return chunk;
  });
}
