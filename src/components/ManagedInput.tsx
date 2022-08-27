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

import React, { InputHTMLAttributes, useEffect, useState } from "react";

import "./ManagedInput.scss";

interface IProps {
  initialValue: string
  inputProps: Omit<InputHTMLAttributes<HTMLInputElement>, "className" | "type" | "value">
};

export const ManagedInput: React.FC<IProps> = (props) => {
  const [value, setValue] = useState(props.initialValue);

  useEffect(() => {
    setValue(props.initialValue);
  }, [props.initialValue]);

  return (
    <input
      {...props.inputProps}
      className="ManagedInput"
      type="text"
      value={value}
      onChange={e => { setValue(e.currentTarget.value); props.inputProps.onChange?.(e); }}/>
  );
};
