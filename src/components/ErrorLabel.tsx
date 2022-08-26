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

import { combineClassNames } from "../utils/misc";

import "./ErrorLabel.scss";

interface IProps {
  className?: string;
  message: string;
};

export const ErrorLabel: React.FC<IProps> = (props) => {
  return (
    <div className={combineClassNames("ErrorLabel", props.className)}>{props.message}</div>
  );
};
