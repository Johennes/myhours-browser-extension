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
import ReactDOM from "react-dom";

import "./Options.scss";

const Options: React.FC = () => {
  return (
    <div className="Options">
      This add-on is <b>open source</b>. You may browse the source code or report issues and
      feature requests on <a href="https://github.com/Johennes/myhours-browser-extension">GitHub</a>.
      Keep in mind that this project is community-maintained and not affiliated
      with <a href="https://myhours.com/">My Hours</a> in any way. Use it at your own risk
      and don&apos;t expect professional support.
    </div>
  );
};

ReactDOM.render(<Options/>, document.getElementById("root"));
