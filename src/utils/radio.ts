import { RadioShow } from '../types/content';

export function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function getShowsForDay(shows: RadioShow[], day: number): RadioShow[] {
  return shows.filter((s) => s.days.includes(day)).sort((a, b) => toMinutes(a.start) - toMinutes(b.start));
}

export function isShowLive(show: RadioShow, date: Date): boolean {
  const mins = date.getHours() * 60 + date.getMinutes();
  return show.days.includes(date.getDay()) && toMinutes(show.start) <= mins && mins < toMinutes(show.end);
}

export function getCurrentShow(shows: RadioShow[], date: Date): RadioShow | undefined {
  return shows.find((s) => isShowLive(s, date));
}

export function getNextShow(shows: RadioShow[], date: Date): RadioShow | undefined {
  const mins = date.getHours() * 60 + date.getMinutes();
  const today = getShowsForDay(shows, date.getDay());
  const next = today.find((s) => toMinutes(s.start) > mins);
  if (next) return next;
  return getShowsForDay(shows, (date.getDay() + 1) % 7)[0];
}

export function formatShowTime(time: string): string {
  return time === '24:00' ? '00h00' : time.replace(':', 'h');
}