"use client";

import * as React from "react";
import LoadingBar from "react-top-loading-bar";
import { CONFIG } from "@/lib/config";

const LoadingIndicator = React.forwardRef((props, ref) => {
  return <LoadingBar color={CONFIG.LOADING_BAR_COLOR} ref={ref} {...props} />;
});

LoadingIndicator.displayName = "LoadingIndicator";

export default LoadingIndicator;
