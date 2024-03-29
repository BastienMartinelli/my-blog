import React from "react";
import Layout from "../../components/Layout";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import makeStyles from "@material-ui/styles/makeStyles";

import PageLayout from "../../components/PageLayout";

const useStyles = makeStyles(theme => ({
  title: {
    marginBottom: 24
  }
}));

function ThanksPage() {
  const classes = useStyles();

  return (
    <Layout pageName="thanks">
      <Container maxWidth="md">
        <PageLayout>
          <Typography
            component="h1"
            variant="h3"
            align="center"
            className={classes.title}
          >
            Merci !
          </Typography>
          <Typography color="textSecondary" variant="h5" align="center">
            Votre message a été envoyé avec succès :)
          </Typography>
        </PageLayout>
      </Container>
    </Layout>
  );
}

export default ThanksPage;
