import { APP_ID } from '../../config/wdio.shared.conf.js';

/**
 * Locator strategy, in order of preference:
 *  1. resource-id  → stable, set by developers, not affected by copy/translation changes
 *  2. accessibility id (content-desc) → also used by screen readers
 *  3. UiSelector text → only for dynamic list items where nothing else is unique
 */
export const id = (resourceId: string): string => `id:${APP_ID}:id/${resourceId}`;
export const accessibilityId = (desc: string): string => `~${desc}`;
export const byText = (text: string): string => `android=new UiSelector().text("${text}")`;

/** Scrolls the first scrollable container until the element with this resource-id is visible. */
export const scrollToId = (resourceId: string): string =>
  `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().resourceId("${APP_ID}:id/${resourceId}"))`;

/** Scrolls until an element with this exact text is visible. */
export const scrollToText = (text: string): string =>
  `android=new UiScrollable(new UiSelector().scrollable(true)).scrollIntoView(new UiSelector().text("${text}"))`;
