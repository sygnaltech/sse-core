/* SPDX-License-Identifier: MIT
 * Copyright (C) 2024 Sygnal Technology Group
 */

import { IModule } from './routeDispatcher';

/**
 * Component constructor that takes an HTMLElement
 */
export type ComponentConstructor = new (element: HTMLElement) => IModule;

/**
 * Page constructor (no arguments)
 */
export type PageConstructor = new () => IModule;

/**
 * Component registry map - maps component names to their constructors
 */
export type ComponentRegistry = {
  [componentName: string]: ComponentConstructor;
};

/**
 * Page registry map - maps routes to page constructors
 */
export type PageRegistry = {
  [route: string]: PageConstructor;
};
