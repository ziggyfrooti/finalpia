/**
 * Date utilities for timezone-aware date handling
 * Uses parent's timezone for consistent daily reset
 */

/**
 * Get today's date string in YYYY-MM-DD format for a given timezone
 * @param timezone - IANA timezone string (e.g., "America/New_York")
 * @returns Date string like "2026-01-27"
 */
export function getTodayDateString(timezone: string): string {
  const now = new Date();

  // Format date in the given timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  // en-CA locale gives us YYYY-MM-DD format
  return formatter.format(now);
}

/**
 * Get day of week for current date in given timezone
 * @param timezone - IANA timezone string
 * @returns Day name like "Monday", "Tuesday", etc.
 */
export function getDayOfWeek(timezone: string): string {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
  });

  return formatter.format(now);
}

/**
 * Check if current day is a weekend in given timezone
 * @param timezone - IANA timezone string
 * @returns true if Saturday or Sunday
 */
export function isWeekend(timezone: string): boolean {
  // TEMPORARY: Force weekend mode for testing weekend cards
  return true;

  // Production code (uncomment when done testing):
  // const dayOfWeek = getDayOfWeek(timezone);
  // return dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday';
}

/**
 * Check if two date strings represent the same day
 * @param date1 - Date string in YYYY-MM-DD format
 * @param date2 - Date string in YYYY-MM-DD format
 * @returns true if same day
 */
export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

/**
 * Get friendly date display (e.g., "Monday, January 27")
 * @param dateString - Date string in YYYY-MM-DD format
 * @param timezone - IANA timezone string
 * @returns Friendly date like "Monday, January 27"
 */
export function getFriendlyDate(dateString: string, timezone: string): string {
  const date = new Date(dateString + 'T00:00:00');

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return formatter.format(date);
}

/**
 * Get time-appropriate greeting
 * @param timezone - IANA timezone string
 * @returns "morning", "afternoon", or "evening"
 */
export function getTimeOfDay(timezone: string): 'morning' | 'afternoon' | 'evening' {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    hour: 'numeric',
    hour12: false,
  });

  const hour = parseInt(formatter.format(now));

  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

/**
 * Default timezone if parent hasn't set one
 */
export const DEFAULT_TIMEZONE = 'America/New_York';
