/**
 * useAntiCheat — Monitors browser events that indicate cheating attempts
 * during an active assessment session.
 *
 * Tracked events:
 *  - tab_switch    : User switches to another tab (visibilitychange)
 *  - window_blur   : Browser window loses focus
 *  - copy_attempt  : User tries to copy content
 *  - paste_attempt : User tries to paste content
 *  - right_click   : User right-clicks (context menu)
 *  - devtools_open : DevTools detected via resize heuristic
 *  - screen_resize : Significant window resize (may indicate split-screen)
 *
 * Usage:
 *   const { score, events } = useAntiCheat(sessionId, isActive);
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as assessmentService from '@/services/assessmentService';

type AntiCheatEventType =
  | 'tab_switch'
  | 'window_blur'
  | 'copy_attempt'
  | 'paste_attempt'
  | 'right_click'
  | 'devtools_open'
  | 'screen_resize';

interface UseAntiCheatReturn {
  /** Current anti-cheat score (starts at 100, decremented per event) */
  score: number;
  /** Total number of events recorded */
  totalEvents: number;
  /** Whether monitoring is active */
  isMonitoring: boolean;
}

export function useAntiCheat(
  sessionId: string | undefined,
  isActive: boolean = true
): UseAntiCheatReturn {
  const [score, setScore] = useState(100);
  const [totalEvents, setTotalEvents] = useState(0);
  const lastWidthRef = useRef(window.innerWidth);
  const lastHeightRef = useRef(window.innerHeight);
  const devtoolsOpenRef = useRef(false);

  const record = useCallback(
    async (event: AntiCheatEventType, details?: string) => {
      if (!sessionId) return;
      try {
        const res = await assessmentService.recordAntiCheatEvent(sessionId, event, details);
        setScore(res.antiCheatScore);
        setTotalEvents(res.totalEvents);
      } catch {
        // Silently fail — don't break assessment if recording fails
      }
    },
    [sessionId]
  );

  useEffect(() => {
    if (!isActive || !sessionId) return;

    // ── Tab visibility ───────────────────────────────────────
    const onVisibilityChange = () => {
      if (document.hidden) {
        record('tab_switch', 'Tab became hidden');
      }
    };

    // ── Window blur ──────────────────────────────────────────
    const onBlur = () => {
      record('window_blur', 'Window lost focus');
    };

    // ── Copy ─────────────────────────────────────────────────
    const onCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      record('copy_attempt', 'Copy blocked');
    };

    // ── Paste ────────────────────────────────────────────────
    const onPaste = (e: ClipboardEvent) => {
      // Allow paste inside the code editor (Monaco handles it)
      const target = e.target as HTMLElement;
      if (target.closest('.monaco-editor')) return;
      e.preventDefault();
      record('paste_attempt', 'Paste blocked outside editor');
    };

    // ── Right-click ──────────────────────────────────────────
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      record('right_click', 'Context menu blocked');
    };

    // ── DevTools detection (resize heuristic) ────────────────
    const checkDevtools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      const isOpen = widthThreshold || heightThreshold;

      if (isOpen && !devtoolsOpenRef.current) {
        devtoolsOpenRef.current = true;
        record('devtools_open', `Detected: width diff ${window.outerWidth - window.innerWidth}, height diff ${window.outerHeight - window.innerHeight}`);
      } else if (!isOpen) {
        devtoolsOpenRef.current = false;
      }
    };

    // ── Screen resize ────────────────────────────────────────
    const onResize = () => {
      const widthDelta = Math.abs(window.innerWidth - lastWidthRef.current);
      const heightDelta = Math.abs(window.innerHeight - lastHeightRef.current);

      // Only record significant resizes (>200px, likely split-screen)
      if (widthDelta > 200 || heightDelta > 200) {
        record('screen_resize', `Δwidth: ${widthDelta}, Δheight: ${heightDelta}`);
      }

      lastWidthRef.current = window.innerWidth;
      lastHeightRef.current = window.innerHeight;

      // Also check devtools on resize
      checkDevtools();
    };

    // ── Keyboard shortcut blocking ───────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      // Block F12
      if (e.key === 'F12') {
        e.preventDefault();
        record('devtools_open', 'F12 key blocked');
        return;
      }
      // Block Ctrl+Shift+I / Cmd+Opt+I (DevTools)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
        e.preventDefault();
        record('devtools_open', 'Ctrl+Shift+I blocked');
        return;
      }
      // Block Ctrl+Shift+J (Console)
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
        e.preventDefault();
        record('devtools_open', 'Ctrl+Shift+J blocked');
        return;
      }
      // Block Ctrl+U (View Source)
      if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
        e.preventDefault();
        return;
      }
    };

    // ── Attach listeners ─────────────────────────────────────
    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('blur', onBlur);
    document.addEventListener('copy', onCopy);
    document.addEventListener('paste', onPaste);
    document.addEventListener('contextmenu', onContextMenu);
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeyDown);

    // Initial devtools check
    checkDevtools();

    // Periodic devtools check
    const devtoolsInterval = setInterval(checkDevtools, 3000);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('blur', onBlur);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('contextmenu', onContextMenu);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('keydown', onKeyDown);
      clearInterval(devtoolsInterval);
    };
  }, [isActive, sessionId, record]);

  return {
    score,
    totalEvents,
    isMonitoring: isActive && !!sessionId,
  };
}
