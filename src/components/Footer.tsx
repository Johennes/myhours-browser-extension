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
import * as browser from 'webextension-polyfill';

import "./Footer.scss";

interface IProps {
  isLoggedIn: boolean;
  onLogOut: () => void;
};

export const Footer: React.FC<IProps> = (props) => {
  const onOpenOptions = (event: React.MouseEvent) => {
    browser.runtime.openOptionsPage();
    window.close();
  };

  return (
    <div className="Footer">
      <button className="Footer_button" onClick={onOpenOptions}>Options</button>
      {props.isLoggedIn && <button className="Footer_button Footer_button_negative" onClick={props.onLogOut}>Log out</button>}
    </div>
  );
};
