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

import React from 'react';

import { MyHoursTask } from "../api/structures/MyHoursTask";
import { MyHoursProject } from "../api/structures/MyHoursProject";
import { MyHoursLog } from "../api/structures/MyHoursLog";
import { formatDuration, parseDuration } from '../utils/datetime';
import { getClient } from '../utils/globals';
import { combineClassNames } from '../utils/misc';
import { AutocompletingInput, Completion } from './AutocompletingInput';
import { ManagedInput } from './ManagedInput';

import "./TimesheetTable.scss";

interface IProps {
  className?: string;
  logs: MyHoursLog[];
  onChangeLogProject: (idx: number, project: MyHoursProject) => void;
  onChangeLogTask: (idx: number, task: MyHoursTask) => void;
  onChangeLogDuration: (idx: number, duration: number) => void;
  onDeleteLog: (idx: number) => void;
};

export const TimesheetTable: React.FC<IProps> = (props) => {
  const projectInputs = props.logs.map(log => log.projectName ?? "");
  const taskInputs = props.logs.map(log => log.taskName ?? "");
  const durationInputs = props.logs.map(log => log.duration ? formatDuration(log.duration) : "");

  const totalDuration = props.logs.reduce((acc, next) => acc + (next.duration ?? 0), 0);

  const fetchProjects = async () => {
    const client = await getClient();
    return (await client.getProjects()).map(project => {
      return { id: project.id, title: project.name, completion: project } as Completion;
    });
  };

  const fetchTasks = async (projectId?: number) => {
    if (!projectId) {
      return [];
    }
    const client = await getClient();
    return (await client.getTasks(projectId)).map(task => {
      return { id: task.id, title: task.name, completion: task } as Completion;
    });
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (event.key !== "Enter") {
      return;
    }

    const duration = parseDuration(event.currentTarget.value);

    if (duration != null) {
      props.onChangeLogDuration(idx, duration);
    }
  };

  return (
    <table className={combineClassNames("TimesheetTable", props.className)} cellPadding={0} cellSpacing={0}>
      <thead>
        <tr>
          <th>Project</th>
          <th>Task</th>
          <th>{formatDuration(totalDuration)}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.logs.map((log, idx) => <tr key={log.id ?? "new"}>
          <td>
            <AutocompletingInput
              initialValue={projectInputs[idx]}
              fetchCompletions={fetchProjects}
              complete={completion => props.onChangeLogProject(idx, completion.completion as MyHoursProject)}
              inputProps={{
                placeholder: "Select project..."
              }}/>
          </td>
          <td>
            <AutocompletingInput
              initialValue={taskInputs[idx]}
              fetchCompletions={() => { return fetchTasks(props.logs[idx].projectId) }}
              complete={completion => props.onChangeLogTask(idx, completion.completion as MyHoursTask)}
              inputProps={{
                placeholder: "Select task...",
                disabled: !log.projectId
              }}/>
          </td>
          <td>
            <ManagedInput
              initialValue={durationInputs[idx]}
              inputProps={{
                placeholder: "hh:mm",
                disabled: !log.projectId,
                onKeyDown: e => onKeyDown(e, idx)
              }}/>
          </td>
          <td>
            <button
              disabled={!log.id}
              onClick={_ => props.onDeleteLog(idx)}
            >
              del
            </button>
          </td>
        </tr>)}
      </tbody>
    </table>
  );
};
