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

import React, { createRef, InputHTMLAttributes, useEffect, useState } from "react";

import { ErrorLabel } from "./ErrorLabel";
import { ManagedInput } from "./ManagedInput";
import { combineClassNames } from "../utils/misc";

import "./AutocompletingInput.scss";

export interface Completion {
  id: number
  title: string
  completion: any // TODO: Use generics to avoid type cast
};

interface IProps {
  initialValue: string
  fetchCompletions: () => Promise<Completion[]>
  complete: (completion: Completion | string) => void
  createOnEnter: boolean
  inputProps: Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type" | "value">
};

export const AutocompletingInput: React.FC<IProps> = (props) => {
  const [isEmpty, setIsEmpty] = useState(!props.initialValue.length);
  const [showPopup, setShowPopup] = useState(false);
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [filtered, setFiltered] = useState<Completion[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);

  const showError = !!error;
  const showCompletions = filtered.length > 0;
  const showNoneFoundNote = !isEmpty && !showError && !showCompletions;

  const ref = createRef<HTMLDivElement>();

  const resetCompletions = () => {
    setCompletions([]);
    setFiltered([]);
    setError(null);
    setShowPopup(false);
    setSelectedIdx(-1);
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

  const filterCompletions = (completions: Completion[], input: string) => {
    const value = input.trim();

    if (!value.length) {
      return completions;
    }

    const words = value.split(/\s+/).filter(word => word.length > 0).map(word => word.toLowerCase());

    return completions.filter(completion => {
      const lowercased = completion.title.toLowerCase();

      for (const word of words) {
        if (!lowercased.includes(word)) {
          return false;
        }
      }

      return true;
    });
  };

  const onFocus = async (event: React.FocusEvent<HTMLInputElement>) => {
    try {
      const completions = await props.fetchCompletions();
      setCompletions(completions);
      const filtered = filterCompletions(completions, event.target.value);
      setFiltered(filtered);
      setShowPopup(filtered.length > 0 || !isEmpty);
    } catch (e) {
      setError(`Failed to fetch completions: ${e}`);
      setShowPopup(true);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsEmpty(!event.target.value.length);
    const filtered = filterCompletions(completions, event.target.value);
    setFiltered(filtered);
    setShowPopup(filtered.length > 0 || !isEmpty);
    setSelectedIdx(-1);
  };

  const complete = (completion: Completion | string) => {
    props.complete(completion);
    setShowPopup(false);
    setSelectedIdx(-1);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      if (selectedIdx < 0) {
        if (!isEmpty) {
          complete(event.currentTarget.value.trim());
        }
      } else {
        complete(filtered[selectedIdx]);
      }
      return;
    }

    if (event.key === "ArrowUp") {
      if (selectedIdx >= 0) {
        setSelectedIdx(selectedIdx - 1);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      if (selectedIdx < filtered.length - 1) {
        setSelectedIdx(selectedIdx + 1);
      }
      return;
    }
  };

  return (
    <div className="AutocompletingInput" ref={ref}>
      <ManagedInput
        initialValue={props.initialValue}
        inputProps={{
          ...props.inputProps,
          onFocus,
          onChange,
          onKeyDown
        }}/>
      {showPopup && <div className="AutocompletingInput_popup_container">
        <div className="AutocompletingInput_popup">
          {showCompletions && filtered.map((completion, idx) =>
            <div
              ref={e => { if (idx === selectedIdx) { e?.scrollIntoView({ behavior: "smooth", block: "nearest" }); } }}
              className={combineClassNames("AutocompletingInput_item", "AutocompletingInput_completion", idx === selectedIdx ? "AutocompletingInput_item_selected" : null)}
              key={completion.id}
              onMouseEnter={_ => setSelectedIdx(idx)}
              onClick={_ => complete(completion)}
            >
              {completion.title}
            </div>)}
          {showNoneFoundNote && <div className="AutocompletingInput_item">None found. {props.createOnEnter && <span>Press <b>Enter</b> to create.</span>}</div>}
          {showError && <ErrorLabel className="AutocompletingInput_item" message={error}/>}
        </div>
      </div>}
    </div>
  );
};
