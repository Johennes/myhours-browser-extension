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

import React, { useEffect, useState } from "react";

import { MyHoursTask } from "../api/structures/MyHoursTask";
import { MyHoursProject } from "../api/structures/MyHoursProject";
import { MyHoursLog } from "../api/structures/MyHoursLog";
import { getClient } from "../utils/globals";
import { isoDateString, utcMidnight } from "../utils/datetime";
import { ErrorLabel } from "./ErrorLabel";
import { Loader } from "./Loader";
import { TimesheetHeader } from "./TimesheetHeader";
import { TimesheetTable } from "./TimesheetTable";

import "./Timesheet.scss";

interface IProps {};

export const Timesheet: React.FC<IProps> = (props) => {
  const [date, setDate] = useState(utcMidnight(new Date()));
  const [logs, setLogs] = useState<MyHoursLog[]>([{ date: isoDateString(date) } as MyHoursLog]);
  const [needsReload, setNeedsReload] = useState(true);
  const [isReloading, setIsReloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    if (!needsReload) {
      return;
    }

    setIsReloading(true);

    const dateToLoad = date;
    let newLogs: MyHoursLog[];

    try {
      const client = await getClient();
      newLogs = await client.getLogs(dateToLoad);
    } catch (e) {
      setError(`Failed to load logs: ${e}`);
      return;
    }

    if (dateToLoad === date) {
      setLogs([...newLogs, logs[logs.length - 1]]);
      setNeedsReload(false);
    }

    setIsReloading(false);
  };

  useEffect(() => {
    reload();
  }, [needsReload]);

  const onDateChanged = (newDate: Date) => {
    setDate(newDate);
    setLogs([{ date: isoDateString(newDate) } as MyHoursLog]);
    setNeedsReload(true);
    setError(null);
  };

  const updateLog = (idx: number, project?: MyHoursProject, task?: MyHoursTask, duration?: number) => {
    const log = { ...(logs[idx]) };

    if (project !== undefined) {
      if (log.projectId !== project.id) {
        delete log.taskId;
        delete log.taskName;
      }

      log.projectId = project?.id;
      log.projectName = project?.name;
      log.clientName = project?.clientName;
    }

    if (task !== undefined) {
      log.taskId = task?.id;
      log.taskName = task?.name;
    }

    if (duration !== undefined) {
      log.duration = duration;
    }

    return log;
  };

  const onChangeLog = async (idx: number, project?: MyHoursProject, task?: MyHoursTask, duration?: number) => {
    const currentProjectId = logs[idx].projectId;

    if (currentProjectId && (task != null) && !task.id) {
      let newTask: MyHoursTask;

      try {
        const client = await getClient();
        newTask = await client.createTask(task, currentProjectId);
      } catch (e) {
        setError(`Failed to create task: ${e}`);
        return;
      }

      task.id = newTask.id;
    }

    const log = updateLog(idx, project, task, duration);
    const newLogs = [...(logs.slice(0, idx)), log, ...(logs.slice(idx + 1, logs.length))];

    const needsInsert = !log.id && log.projectId && log.duration;
    const needsUpdate = !!log.id;

    if (needsInsert) {
      newLogs.push({ date: isoDateString(date) } as MyHoursLog);
    }

    setLogs(newLogs);

    if (needsInsert) {
      try {
        const client = await getClient();
        await client.createLog(log);
      } catch (e) {
        setError(`Failed to add log: ${e}`);
        return;
      }

      setNeedsReload(true);
    }

    if (needsUpdate) {
      try {
        const client = await getClient();
        await client.editLog(log);
      } catch (e) {
        setError(`Failed to edit log: ${e}`);
        return;
      }

      setNeedsReload(true);
    }
  };

  const onDeleteLog = async (idx: number) => {
    const id = logs[idx].id;
    if (!id) {
      return;
    }

    try {
      const client = await getClient();
      await client.deleteLog(id);
    } catch (e) {
      setError(`Failed to delete log: ${e}`);
      return;
    }

    setNeedsReload(true);
  };

  return (
    <div className="Timesheet">
      <TimesheetHeader date={date} onDateChanged={onDateChanged}/>
      {isReloading && <Loader/>}
      {!isReloading && !error && <TimesheetTable
        className="table"
        logs={logs}
        onChangeLogProject={async (idx, project) => await onChangeLog(idx, project, undefined, undefined)}
        onChangeLogTask={async (idx, task) => await onChangeLog(idx, undefined, task, undefined)}
        onChangeLogDuration={async (idx, duration) => await onChangeLog(idx, undefined, undefined, duration)}
        onDeleteLog={onDeleteLog}/>}
      {!isReloading && error && <ErrorLabel message={error}/>}
    </div>
  );
};
