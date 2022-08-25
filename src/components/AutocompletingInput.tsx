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

import React, { createRef, InputHTMLAttributes, useEffect, useState } from 'react';

import { ErrorLabel } from './Error';
import { ManagedInput } from './ManagedInput';

import "./AutocompletingInput.scss";

export type Completion = {
  id: number;
  title: string;
  completion: any; // TODO: Use generics to avoid type cast
}

interface IProps {
  initialValue: string;
  fetchCompletions: () => Promise<Completion[]>;
  complete: (completion: Completion) => void;
  inputProps: Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type" | "value">;
};

export const AutocompletingInput: React.FC<IProps> = (props) => {
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [filtered, setFiltered] = useState<Completion[]>([]);
  const [error, setError] = useState<string | null>(null);

  const showError = !!error;
  const showCompletions = filtered.length > 0;
  const showPopup = showError || showCompletions;

  const ref = createRef<HTMLDivElement>();

  const resetCompletions = () => {
    setCompletions([]);
    setFiltered([]);
    setError(null);
  };

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        resetCompletions();
      }
    }
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  });

  const onFocus = async (event: React.FocusEvent<HTMLInputElement>) => {
    try {
      const completions = await props.fetchCompletions();
      setCompletions(completions);
      setFiltered(completions);
    } catch (e) {
      setError(`Failed to fetch completions: ${e}`);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const words = event.currentTarget.value.split(/\s+/).filter(word => word.length > 0).map(word => word.toLowerCase());

    setFiltered(completions.filter(completion => {
      const lowercased = completion.title.toLowerCase();

      for (const word of words) {
        if (lowercased.indexOf(word) < 0) {
          return false;
        }
      }

      return true;
    }));
  };

  const onClick = (event: React.MouseEvent, completion: Completion) => {
    resetCompletions();
    props.complete(completion);
  };

  return (
    <div className="AutocompletingInput" ref={ref}>
      <ManagedInput
        initialValue={props.initialValue}
        inputProps={{
          ...props.inputProps,
          onFocus: onFocus,
          onChange: onChange
        }}/>
      {showPopup && <div className="AutocompletingInput_popup_container">
        <div className="AutocompletingInput_popup">
          {showCompletions && filtered.map((completion) =>
            <div
              className="AutocompletingInput_completion"
              key={completion.id}
              onClick={e => onClick(e, completion)}
            >
              {completion.title}
            </div>)}
          {showError && <ErrorLabel message={error}/>}
        </div>
      </div>}
    </div>
  );
};
