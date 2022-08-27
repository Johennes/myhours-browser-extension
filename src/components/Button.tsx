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

import "./Button.scss";

export enum ButtonType {
  Default,
  Destructive,
  Submit
}

interface IProps {
  type: ButtonType
  title: string
  disabled?: boolean
  onClick?: (event: React.MouseEvent) => void
};

export const Button: React.FC<IProps> = (props) => {
  if (props.type === ButtonType.Default || props.type === ButtonType.Destructive) {
    return (
      <div className="Button">
        <button
          className={`Button_common ${props.type === ButtonType.Default ? "Button_default" : "Button_destructive"}`}
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {props.title}
        </button>
      </div>
    );
  }

  return (
    <div className="Button">
      <input
        className="Button_common Button_submit"
        type="submit"
        value={props.title}
        disabled={props.disabled}
        onClick={props.onClick}/>
    </div>
  );
};
