/* eslint-disable import/prefer-default-export, react/prop-types */

import React from "react";
import TopLayout from "./TopLayout";
import "prismjs/themes/prism-okaidia.css";

export const wrapRootElement = ({ element }) => {
  return <TopLayout>{element}</TopLayout>;
};
