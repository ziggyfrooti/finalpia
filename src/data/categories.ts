/**
 * Category definitions for weekdays and weekends
 */

export interface Category {
  id: string;
  label: string;
  emoji: string;
  description: string;
}

/**
 * Weekday categories (Monday-Friday)
 * School-focused moments
 */
export const WEEKDAY_CATEGORIES: Category[] = [
  {
    id: 'lunch',
    label: 'Lunch',
    emoji: '🍽️',
    description: 'Lunchtime at school',
  },
  {
    id: 'recess',
    label: 'Recess',
    emoji: '👥',
    description: 'Playtime and socializing',
  },
  {
    id: 'classroom',
    label: 'Classroom',
    emoji: '📚',
    description: 'Learning and activities in class',
  },
  {
    id: 'specials',
    label: 'Specials',
    emoji: '🎨',
    description: 'Art, music, PE, and special classes',
  },
  {
    id: 'going-home',
    label: 'Going Home',
    emoji: '🏠',
    description: 'The ride or walk home from school',
  },
];

/**
 * Weekend categories (Saturday-Sunday)
 * Family and leisure-focused moments
 */
export const WEEKEND_CATEGORIES: Category[] = [
  {
    id: 'family-time',
    label: 'Family Time',
    emoji: '👨‍👩‍👧',
    description: 'Time spent with family',
  },
  {
    id: 'activities',
    label: 'Activities & Hobbies',
    emoji: '🎮',
    description: 'Fun activities and personal hobbies',
  },
  {
    id: 'outdoor',
    label: 'Outdoor Time',
    emoji: '🏃',
    description: 'Playing outside and exploring',
  },
  {
    id: 'friends',
    label: 'Friends & Playdates',
    emoji: '👫',
    description: 'Spending time with friends',
  },
  {
    id: 'sports-classes',
    label: 'Sports & Classes',
    emoji: '⚽',
    description: 'Soccer, swim, basketball, dance, karate, language classes',
  },
  {
    id: 'quiet-time',
    label: 'Quiet Time',
    emoji: '🛏️',
    description: 'Relaxing and resting',
  },
];

/**
 * Get categories based on whether it's a weekend
 */
export function getCategories(isWeekend: boolean): Category[] {
  return isWeekend ? WEEKEND_CATEGORIES : WEEKDAY_CATEGORIES;
}

/**
 * Get category by ID from all categories
 */
export function getCategoryById(id: string): Category | undefined {
  const allCategories = [...WEEKDAY_CATEGORIES, ...WEEKEND_CATEGORIES];
  return allCategories.find(cat => cat.id === id);
}

/**
 * Get category emoji by ID
 */
export function getCategoryEmoji(id: string): string {
  const category = getCategoryById(id);
  return category?.emoji || '📝';
}

/**
 * Get category label by ID
 */
export function getCategoryLabel(id: string): string {
  const category = getCategoryById(id);
  return category?.label || id;
}
