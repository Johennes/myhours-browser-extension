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

import { MyHoursTime } from "api/structures/MyHoursTime";
import { MyHoursTag } from "./MyHoursTag";

export interface MyHoursLog {
  clientName?: string
  date?: string
  duration?: number
  id?: number
  note?: string
  projectId?: number
  projectName?: string
  running?: boolean
  tags?: MyHoursTag[]
  taskId?: number
  taskName?: string
  times?: MyHoursTime[]
}
