import React from "react";
import { Helmet } from "react-helmet";
import { withPrefix } from "gatsby";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/styles";
import { makeStyles } from "@material-ui/core/styles";

import theme from "../theme";
import Footer from "./Footer";
import Navbar from "./Navbar";
import useSiteMetadata from "./SiteMetadata";
import { background } from "../utils/background";
import wave from "../img/wave.svg";

const useStyles = makeStyles(theme => ({
  root: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column"
  },
  content: {
    marginTop: -280,
    flex: "1 0 auto"
  },
  heroContent: {
    backgroundPosition: "center",
    backgroundColor: theme.palette.primary.main,
    background,
    paddingTop: 60,
    padding: theme.spacing(8, 0, 6),
    height: 400,
    animation: "$slide 8s linear infinite"
  },
  "@keyframes slide": {
    from: { backgroundPositionY: 0 },
    to: { backgroundPositionY: -350 }
  },
  wave: {
    backgroundImage: `url(${wave})`,
    backgroundPosition: "center bottom",
    height: 204,
    marginTop: -200,
    backgroundRepeat: "repeat-x"
  }
}));

const TemplateWrapper = ({ children }) => {
  const { title, description } = useSiteMetadata();
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Helmet>
        <html lang="en" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,500,700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={`${withPrefix("/")}img/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          href={`${withPrefix("/")}img/favicon-32x32.png`}
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href={`${withPrefix("/")}img/favicon-16x16.png`}
          sizes="16x16"
        />
        <link
          rel="mask-icon"
          href={`${withPrefix("/")}img/safari-pinned-tab.svg`}
          color="#ff4400"
        />
        <meta property="og:type" content="business.business" />
        <meta property="og:title" content={title} />
        <meta property="og:url" content="/" />
        <meta
          property="og:image"
          content={`${withPrefix("/")}img/og-image.jpg`}
        />
      </Helmet>
      <Navbar />
      <div className={classes.root}>
        <div className={classes.heroContent} />
        <div className={classes.wave} />
        <div className={classes.content}>{children}</div>
        <Footer />
      </div>
    </ThemeProvider>
  );
};

export default TemplateWrapper;
