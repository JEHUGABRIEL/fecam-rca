import { format, parseISO, startOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

export function formatLongDate(iso: string): string {
  return format(parseISO(iso), 'EEEE d MMMM yyyy', { locale: fr });
}

export function formatShortDate(iso: string): string {
  return format(parseISO(iso), 'd MMM yyyy', { locale: fr });
}

export function formatDay(iso: string): string {
  return format(parseISO(iso), 'dd');
}

export function formatMonthShort(iso: string): string {
  return format(parseISO(iso), 'MMM', { locale: fr }).replace('.', '');
}

export function formatDateRange(start: string, end?: string): string {
  if (!end) return formatLongDate(start);
  return `Du ${format(parseISO(start), 'd', { locale: fr })} au ${format(parseISO(end), 'd MMMM yyyy', { locale: fr })}`;
}

export function isPastDate(iso: string): boolean {
  return parseISO(iso) < startOfDay(new Date());
}

export function groupByMonth<T extends {date: string;}>(items: T[]): {key: string;label: string;items: T[];}[] {
  const groups: {key: string;label: string;items: T[];}[] = [];
  items.forEach((item) => {
    const key = item.date.slice(0, 7);
    let group = groups.find((g) => g.key === key);
    if (!group) {
      group = { key, label: format(parseISO(item.date), 'MMMM yyyy', { locale: fr }), items: [] };
      groups.push(group);
    }
    group.items.push(item);
  });
  return groups;
}