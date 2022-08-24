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

import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

import { LoginForm, LoginFormState } from '../components/LoginForm';
import { Timesheet } from '../components/Timesheet';
import { Footer } from '../components/Footer';
import { getClient } from '../utils/globals';

import "./Popup.scss"

const Popup: React.FC = () => {
  const [loginFormState, setLoginFormState] = useState(LoginFormState.Initial);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    getClient().then(client => setIsLoggedIn(client.isLoggedIn));
  });

  const onLoginFormSubmit = async (email: string, password: string) => {
    setLoginFormState(LoginFormState.Loading);
    const client = await getClient();
    try {
      await client.logIn(email, password);
    } catch (e) {
      setLoginFormState(LoginFormState.Failed);
      return;
    }
    setIsLoggedIn(true);
  };

  const onLogOut = async () => {
    const client = await getClient();
    await client.logOut();
    setLoginFormState(LoginFormState.Initial);
    setIsLoggedIn(false);
  };

  return (
    <div className="Popup">
      {!isLoggedIn && <LoginForm state={loginFormState} onSubmit={onLoginFormSubmit}/>}
      {isLoggedIn && <Timesheet/>}
      {isLoggedIn && <div className="spacer"></div>}
      <Footer isLoggedIn={isLoggedIn} onLogOut={onLogOut}/>
    </div>
  );
};

ReactDOM.render(<Popup/>, document.getElementById('root'));
