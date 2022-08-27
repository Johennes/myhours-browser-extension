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

import React from "react";

import { formatDateWithWeekday, nextDay, previousDay } from "../utils/datetime";

import "./TimesheetHeader.scss";

interface IProps {
  date: Date
  onDateChanged: (newDate: Date) => void
};

export const TimesheetHeader: React.FC<IProps> = (props) => {
  const previous = previousDay(props.date);
  const next = nextDay(props.date);

  return (
    <div className="TimesheetHeader">
      <button onClick={e => props.onDateChanged(previous)}>
        &lt; {formatDateWithWeekday(previous)}
      </button>
      <span>{formatDateWithWeekday(props.date)}</span>
      <button onClick={e => props.onDateChanged(next)}>
        {formatDateWithWeekday(next)} &gt;
      </button>
    </div>
  );
};
