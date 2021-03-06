// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for details.

import * as vscode from "vscode";
import path = require("path");
import {ConfigurationReader} from "../common/configurationReader";
import {Packager} from "../common/packager";

export class SettingsHelper {

    /**
     * Path to the workspace settings file
     */
    public static get settingsJsonPath(): string {
        return path.join(vscode.workspace.rootPath, ".vscode", "settings.json");
    }

    /**
     * Enable javascript intellisense via typescript.
     */
    public static notifyUserToAddTSDKInSettingsJson(path: string): void {
        vscode.window.showInformationMessage(`Please make sure you have \"typescript.tsdk\": \"${path}\" in .vscode/settings.json and restart VSCode afterwards.`);
    }

    /**
     * Removes javascript intellisense via typescript.
     */
    public static notifyUserToRemoveTSDKFromSettingsJson(path: string): void {
        vscode.window.showInformationMessage(`Please remove \"typescript.tsdk\": \"${path}\" from .vscode/settings.json and restart VSCode afterwards.`);
    }

    /**
     * Get the path of the Typescript TSDK as it is in the workspace configuration
     */
    public static getTypeScriptTsdk(): string {
        const workspaceConfiguration = vscode.workspace.getConfiguration();
        if (workspaceConfiguration.has("typescript.tsdk")) {
            const tsdk = workspaceConfiguration.get("typescript.tsdk");
            if (tsdk) {
                return ConfigurationReader.readString(tsdk);
            }
        }
        return null;
    }

    /**
     * We get the packager port configured by the user
     */
    public static getPackagerPort(): number {
        const workspaceConfiguration = vscode.workspace.getConfiguration();
        if (workspaceConfiguration.has("react-native.packager.port")) {
            return ConfigurationReader.readInt(workspaceConfiguration.get("react-native.packager.port"));
        }
        return Packager.DEFAULT_PORT;
    }
}
