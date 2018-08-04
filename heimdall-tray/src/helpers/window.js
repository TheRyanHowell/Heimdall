'use strict';

import { app, BrowserWindow, screen } from "electron";
import jetpack from "fs-jetpack";

// Window helper handler
export default (name, options) => {
  // Setup properties
  const userDataDir = jetpack.cwd(app.getPath("userData"));
  const defaultSize = {
    width: options.width,
    height: options.height,
    autoHideMenuBar: true
  };
  let state = {};
  let win;

  // Restore the default window object properties
  const restore = () => {
    return Object.assign({}, defaultSize);
  };

  // Get the window position
  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1]
    };
  };

  // Check if window off screen
  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  // Rest window to default position
  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2
    });
  };

  // Check it's on the screen, if not reset
  const ensureVisibleOnSomeDisplay = windowState => {
    const visible = screen.getAllDisplays().some(display => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  // Setup window
  state = ensureVisibleOnSomeDisplay(restore());
  win = new BrowserWindow(Object.assign({}, options, state));
  return win;
};
