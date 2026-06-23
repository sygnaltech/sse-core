/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

/**
 * LottieManager
 * A small, framework-agnostic wrapper around the Webflow-bundled lottie-web
 * runtime, for SSE projects.
 *
 * Webflow does NOT expose lottie-web globally (`window.lottie` is undefined) —
 * it lives behind Webflow's module loader (`Webflow.require('lottie')`) and
 * registers every Lottie element's animation instance. This class gives SSE
 * developers a clean, typed way to enumerate those animations, target a
 * specific one (by index, CSS selector, or container element), and drive
 * playback (forward, reverse, seek, speed, pause, stop) without touching
 * Webflow internals.
 *
 * Also attached to `window.lottieManager` for ad-hoc/runtime use.
 *
 * @example
 *   import { LottieManager } from "@sygnal/sse-core";
 *   await LottieManager.ready();              // wait for Webflow to register lotties
 *   LottieManager.playForward(0);             // first lottie on the page
 *   LottieManager.playReverse('#hero-lottie');// by selector / element
 *   LottieManager.get(0)?.setSpeed(2);        // grab the raw instance
 */

/**
 * Minimal shape of a lottie-web `AnimationItem`. lottie-web is a runtime
 * dependency provided by Webflow, not bundled here, so we type only what we use.
 */
export interface LottieAnimation {
  play(): void;
  stop(): void;
  pause(): void;
  setDirection(direction: 1 | -1): void;
  setSpeed(speed: number): void;
  goToAndStop(value: number, isFrame?: boolean): void;
  goToAndPlay(value: number, isFrame?: boolean): void;
  playSegments(segments: number[] | number[][], forceFlag?: boolean): void;
  totalFrames: number;
  currentFrame: number;
  isPaused: boolean;
  playDirection: number;
  /** The container element lottie-web rendered into (set by lottie-web). */
  wrapper?: Element;
}

interface LottieLib {
  getRegisteredAnimations?: () => LottieAnimation[];
  loadAnimation?: (config: Record<string, unknown>) => LottieAnimation;
}

/** A target: an animation instance, its container element, a CSS selector, or a 0-based index. */
export type LottieTarget = LottieAnimation | Element | string | number;

export class LottieManager {
  /** The Webflow-bundled lottie-web library, or null if Webflow/lottie isn't present yet. */
  static get library(): LottieLib | null {
    try {
      const wf = (window as unknown as { Webflow?: { require?: (m: string) => unknown } })
        .Webflow;
      const mod = wf?.require?.("lottie") as { lottie?: LottieLib } | undefined;
      return mod?.lottie ?? null;
    } catch {
      return null;
    }
  }

  /** Every Lottie animation currently registered on the page. */
  static all(): LottieAnimation[] {
    return this.library?.getRegisteredAnimations?.() ?? [];
  }

  /** Resolve a target to a single animation instance, or null if not found. */
  static get(target: LottieTarget): LottieAnimation | null {
    if (target == null) return null;
    if (typeof target === "number") return this.all()[target] ?? null;

    let el: Element | null = null;
    if (typeof target === "string") el = document.querySelector(target);
    else if (target instanceof Element) el = target;
    else return target; // already an animation instance

    if (!el) return null;
    return (
      this.all().find(
        (a) =>
          a.wrapper === el ||
          (a.wrapper != null && (el!.contains(a.wrapper) || a.wrapper.contains(el!)))
      ) ?? null
    );
  }

  /**
   * Resolve once Webflow has registered at least `min` animations — handles the
   * race where SSE runs before Webflow has initialised its Lottie elements.
   * Resolves with all animations (possibly fewer than `min` on timeout).
   */
  static ready(min = 1, timeoutMs = 5000): Promise<LottieAnimation[]> {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (): void => {
        const all = this.all();
        if (all.length >= min || performance.now() - start > timeoutMs) resolve(all);
        else requestAnimationFrame(tick);
      };
      tick();
    });
  }

  /**
   * Resolve once the Webflow lottie-web library is available. Webflow loads its
   * Lottie runtime only when the page contains at least one Lottie element, so
   * this is the right gate before driving Lotties (use instead of `ready()` when
   * the elements may be lazy and not yet registered). Resolves `null` on timeout.
   */
  static libraryReady(timeoutMs = 5000): Promise<LottieLib | null> {
    return new Promise((resolve) => {
      const start = performance.now();
      const tick = (): void => {
        const lib = this.library;
        if (lib || performance.now() - start > timeoutMs) resolve(lib);
        else requestAnimationFrame(tick);
      };
      tick();
    });
  }

  /**
   * Force-initialise a declared Webflow Lottie element that hasn't loaded yet.
   *
   * Webflow lazy-loads Lotties on scroll (`data-loading="lazy"`), so below-the-fold
   * elements aren't registered and can't be driven. This initialises one *now*
   * using Webflow's own lottie-web (`loadAnimation`), reading the element's
   * `data-*` attributes. Idempotent: returns the existing animation if already
   * registered (or already rendered by Webflow), and `null` if no element/lib.
   *
   * @param target a Lottie element, or a container holding one (e.g. a FAQ card).
   * @param opts  override the element's `data-autoplay` / `data-loop` (e.g. force
   *              autoplay off so an accordion icon stays on its first frame).
   */
  static ensure(
    target: LottieTarget,
    opts?: { autoplay?: boolean; loop?: boolean }
  ): LottieAnimation | null {
    const existing = this.get(target);
    if (existing) return existing;

    const lib = this.library;
    if (!lib || typeof lib.loadAnimation !== "function") return null;

    // Resolve the actual [data-animation-type="lottie"] element.
    let el: Element | null = null;
    if (typeof target === "string") el = document.querySelector(target);
    else if (target instanceof Element)
      el = target.matches('[data-animation-type="lottie"]')
        ? target
        : target.querySelector('[data-animation-type="lottie"]');
    if (!el) return null;

    // Webflow may have already rendered it (eager) — don't double-init.
    if (el.querySelector("svg")) return this.get(el);

    const path = el.getAttribute("data-src");
    if (!path) return null;

    const anim = lib.loadAnimation({
      container: el,
      renderer: el.getAttribute("data-renderer") || "svg",
      loop: opts?.loop ?? el.getAttribute("data-loop") === "1",
      autoplay: opts?.autoplay ?? el.getAttribute("data-autoplay") === "1",
      path,
    });

    // Webflow lazy-loads Lotties via an IntersectionObserver that calls
    // loadAnimation() again when the element scrolls into view — which would
    // stack a second SVG on top of the one we just created. Neutralise it by
    // stripping the attributes Webflow's deferred init reads.
    el.removeAttribute("data-src");
    el.removeAttribute("data-animation-type");

    return anim;
  }

  /** Play from the current frame toward the end. Returns false if the target wasn't found. */
  static playForward(target: LottieTarget): boolean {
    const a = this.get(target);
    if (!a) return false;
    a.setDirection(1);
    a.play();
    return true;
  }

  /** Play from the current frame back toward the start. */
  static playReverse(target: LottieTarget): boolean {
    const a = this.get(target);
    if (!a) return false;
    a.setDirection(-1);
    a.play();
    return true;
  }

  static pause(target: LottieTarget): boolean {
    const a = this.get(target);
    if (!a) return false;
    a.pause();
    return true;
  }

  static stop(target: LottieTarget): boolean {
    const a = this.get(target);
    if (!a) return false;
    a.stop();
    return true;
  }

  /** Jump to a frame; optionally start playing from there. */
  static seek(target: LottieTarget, frame: number, play = false): boolean {
    const a = this.get(target);
    if (!a) return false;
    if (play) a.goToAndPlay(frame, true);
    else a.goToAndStop(frame, true);
    return true;
  }

  static setSpeed(target: LottieTarget, speed: number): boolean {
    const a = this.get(target);
    if (!a) return false;
    a.setSpeed(speed);
    return true;
  }
}

// Expose for SSE developers and ad-hoc/runtime use.
if (typeof window !== "undefined") {
  (window as unknown as { lottieManager?: typeof LottieManager }).lottieManager =
    LottieManager;
}
