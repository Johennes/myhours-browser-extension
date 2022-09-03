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

import { MyHoursLog } from "api/structures/MyHoursLog";

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

export function formatDuration(...logs: MyHoursLog[]): string | null {
  if (logs.length === 1 && logs[0].duration == null && (!logs[0].times || logs[0].times?.length == 0)) {
    return null;
  }

  const now = new Date();
  let totalSeconds = 0;

  for (const log of logs) {
    if (!log.running && log.duration != null) {
      totalSeconds += log.duration;
      continue;
    }

    if (log.times) {
      for (const time of log.times) {
        if (time.duration) {
          totalSeconds += time.duration;
        } else if (time.running && time.startTime) {
          const start = new Date(time.startTime);
          if (start) {
            totalSeconds += (now.getTime() - start.getTime()) / 1000;
          }
          continue;
        }
      }
    }
  }

  return formatDurationFromSeconds(totalSeconds);
}

function formatDurationFromSeconds(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
  const seconds = Math.floor(totalSeconds - (hours * 3600) - (minutes * 60));

  const format = (value: number) => value < 10 ? `0${value}` : `${value}`;

  return [format(hours), format(minutes), format(seconds)].join(":");
}

export function parseDuration(duration: string): number | null {
  if (!duration.trim().length) {
    return 0;
  }

  const components = duration.split(":").map(c => parseInt(c.trim()));
  if (components.length > 3 || components.includes(NaN)) {
    return null;
  }

  let seconds = components[0] * 3600;
  if (components.length > 1) {
    seconds += components[1] * 60;
  }
  if (components.length > 2) {
    seconds += components[2];
  }

  return seconds;
}
