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

import fetch from "cross-fetch";

import { IMyHoursStorage } from "./storage/IMyHoursStorage";
import { MyHoursTask } from "./structures/MyHoursTask";
import { MyHoursProject } from "./structures/MyHoursProject";
import { MyHoursLog } from "./structures/MyHoursLog";
import { MyHoursTokens } from "./structures/MyHoursTokens";
import { isoDateString } from "../utils/datetime";

const MY_HOURS_API_BASE_URL = "https://api2.myhours.com/api";

export class MyHoursClient {
  private storage: IMyHoursStorage;

  constructor(storage: IMyHoursStorage) {
    this.storage = storage;
  }

  private get headers(): HeadersInit {
    const headers: HeadersInit = {
      "api-version": "1.0",
      "Content-Type": "application/json"
    };

    if (this.storage.accessToken) {
      headers.Authorization = `Bearer ${this.storage.accessToken}`;
    }

    return headers;
  }

  async logIn(email: string, password: string): Promise<MyHoursTokens> {
    const body = {
      email,
      password,
      grantType: "password",
      clientId: "api"
    };

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/tokens/login`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body)
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    const tokens = await response.json() as MyHoursTokens;

    this.storage.email = email;
    this.storage.accessToken = tokens.accessToken;
    this.storage.refreshToken = tokens.refreshToken;
    this.storage.expiresAt = Date.now() + tokens.expiresIn * 1000;

    await this.storage.save();

    return tokens;
  }

  get isLoggedIn(): boolean {
    return !!this.storage.accessToken;
  }

  async refreshTokens(): Promise<MyHoursTokens> {
    if (!this.storage.refreshToken) {
      throw Error("Cannot refresh access token without a refresh token");
    }

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/tokens/refresh`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ refreshToken: this.storage.refreshToken, grantType: "refresh_token" })
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    const tokens = await response.json() as MyHoursTokens;

    this.storage.accessToken = tokens.accessToken;
    this.storage.refreshToken = tokens.refreshToken;
    this.storage.expiresAt = Date.now() + tokens.expiresIn * 1000;

    await this.storage.save();

    return tokens;
  }

  async logOut() {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/tokens/logout`, {
      method: "POST",
      headers: this.headers
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    delete this.storage.accessToken;
    delete this.storage.refreshToken;
    delete this.storage.expiresAt;

    await this.storage.save();
  }

  private async ensureTokens() {
    if (!this.storage.accessToken || !this.storage.refreshToken || !this.storage.expiresAt) {
      throw Error("Cannot ensure tokens without existing tokens");
    }

    if (Date.now() < this.storage.expiresAt) {
      return;
    }

    await this.refreshTokens();
  }

  async getLogs(date: Date): Promise<MyHoursLog[]> {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/logs?date=${isoDateString(date)}&startIndex=0&step=1000`, {
      method: "GET",
      headers: this.headers
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    return await response.json() as MyHoursLog[];
  }

  async createLog(log: MyHoursLog): Promise<MyHoursLog> {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/logs/insertlog`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ billable: false, ...log }) // TODO: Support billing
    });

    if (response.status !== 201) {
      throw new Error(await this.extractErrorMessage(response));
    }

    return await response.json() as MyHoursLog;
  }

  async editLog(log: MyHoursLog): Promise<MyHoursLog> {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/logs?id=${log.id}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(log)
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    return await response.json() as MyHoursLog;
  }

  async deleteLog(logId: number): Promise<void> {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/Logs/${logId}`, {
      method: "DELETE",
      headers: this.headers
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }
  }

  async getProjects(): Promise<MyHoursProject[]> {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/Projects`, {
      method: "GET",
      headers: this.headers
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    return await response.json() as MyHoursProject[];
  }

  async getTasks(projectId: number): Promise<MyHoursTask[]> {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/Projects/${projectId}/tasklist`, {
      method: "GET",
      headers: this.headers
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    const json = await response.json();

    return json.length > 0 ? (json[0].incompletedTasks as MyHoursTask[]) ?? [] : [];
  }

  async createTask(task: MyHoursTask, projectId: number): Promise<MyHoursTask> {
    await this.ensureTokens();

    const response = await fetch(`${MY_HOURS_API_BASE_URL}/projects/${projectId}/task`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify({ listName: "Task list", billable: false, ...task }) // TODO: Support billing
    });

    if (response.status !== 200) {
      throw new Error(await this.extractErrorMessage(response));
    }

    return await response.json() as MyHoursTask;
  }

  private async extractErrorMessage(response: Response): Promise<string> {
    let result = `Request failed with HTTP ${response.status}`;
    let json;

    try {
      json = await response.json();
    } catch (_) {
      return result;
    }

    if (!json.message) {
      return result;
    }

    const validationErrors = json.validationErrors as string[];
    const details = (validationErrors.length > 0) ? `${json.message} (${validationErrors.join(", ")})` : json.message;
    result = `${result} - ${details}`;

    return result;
  }
}
