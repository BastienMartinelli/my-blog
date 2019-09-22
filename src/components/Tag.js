import React from "react";
import makeStyles from "@material-ui/styles/makeStyles";
import Chip from "@material-ui/core/Chip";

import AdapterLink from "./AdapaterLink";
import ReactIcon from "./icon/ReactIcon";
import JSIcon from "./icon/JSIcon";

const tagsIcons = {
  react: <ReactIcon />,
  javascript: <JSIcon />
};

const useStyles = makeStyles({
  tag: {
    marginRight: 4
  }
});

function Tag({ label, to, count = null, ...otherProps }) {
  const classes = useStyles();

  const title = label + (count !== null ? ` (${count})` : "");
  const key = label && label.toLowerCase();

  return (
    <Chip
      icon={tagsIcons[key]}
      className={classes.tag}
      onClick={() => {}}
      label={title}
      component={AdapterLink}
      to={to}
      {...otherProps}
    />
  );
}

export default Tag;
