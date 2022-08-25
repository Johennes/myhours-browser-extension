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

import React, { useState } from 'react';

import { Button, ButtonType } from './Button';
import { ErrorLabel } from './ErrorLabel';
import { Loader } from './Loader';

import "./LoginForm.scss";

export enum LoginFormState {
  Initial,
  Loading,
  Failed
}

interface IProps {
  email?: string;
  state: LoginFormState;
  onSubmit: (email: string, password: string) => void
};

export const LoginForm: React.FC<IProps> = (props) => {
  const [email, setEmail] = useState(props.email ?? "");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.MouseEvent) => {
    props.onSubmit(email, password);
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="LoginForm">
      <form>
        <input
          placeholder="Email"
          type="text"
          value={email}
          disabled={props.state === LoginFormState.Loading}
          onChange={e => setEmail(e.target.value)}/>
        <input
          placeholder="Password"
          type="password"
          value={password}
          disabled={props.state === LoginFormState.Loading}
          onChange={e => setPassword(e.target.value)}/>
        <Button
          type={ButtonType.Submit}
          title="Log in"
          disabled={props.state === LoginFormState.Loading}
          onClick={onSubmit}/>
        <div className="LoginForm_status_container">
          {props.state === LoginFormState.Loading && <Loader/>}
          {props.state === LoginFormState.Failed && <ErrorLabel message="Login failed"/>}
        </div>
      </form>
    </div>
  );
};
