// Copyright 2022 Johannes Marbach
//
// This file is part of myhours-browser-extension, hereafter referred
// to as the program.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

export function utcMidnight(date: Date): Date {
  return new Date(date.setUTCHours(0, 0, 0, 0));
}

export function formatDateWithWeekday(date: Date): string {
  const dateString = date.toISOString().substring(0, 10);
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()];
  return `${weekday} ${dateString}`;
}

export function previousDay(date: Date): Date {
  const result = new Date(date.valueOf());
  result.setDate(date.getDate() - 1);
  return result;
}

export function nextDay(date: Date): Date {
  const result = new Date(date.valueOf());
  result.setDate(date.getDate() + 1);
  return result;
}

export function isoDateString(date: Date): string {
  return date.toISOString().substring(0, 10);
}

export function formatDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  const seconds = totalSeconds - (hours * 3600) - (minutes * 60);

  if (seconds >= 30) {
    minutes += 1;
  }

  function format(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  return [format(hours), format(minutes)].join(":");
}

export function parseDuration(duration: string): number | null {
  if (!duration.trim().length) {
    return 0;
  }

  const components = duration.split(":").map(c => parseInt(c.trim()));
  if (components.length > 2 || components.includes(NaN)) {
    return null;
  }

  let seconds = components[0] * 3600;
  if (components.length > 1) {
    seconds += components[1] * 60;
  }

  return seconds;
}
