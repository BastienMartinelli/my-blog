import React from "react";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../components/Layout";
import PageLayout from "../components/PageLayout";
import { Typography, Button } from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import makeStyles from "@material-ui/styles/makeStyles";

import AdapterLink from "../components/AdapaterLink";

const useStyles = makeStyles({
  list: {
    marginTop: 20,
    marginBottom: 20
  }
});

function TagRoute(props) {
  const classes = useStyles();
  const posts = props.data.allMarkdownRemark.edges;
  const tag = props.pageContext.tag;
  const title = props.data.site.siteMetadata.title;
  const totalCount = props.data.allMarkdownRemark.totalCount;
  const tagHeader = `${totalCount} post${
    totalCount === 1 ? "" : "s"
  } avec le tag “${tag}”`;

  return (
    <Layout>
      <Helmet title={`${tag} | ${title}`} />
      <PageLayout title="Tags">
        <Typography component="h1" variant="h4">
          {tagHeader}
        </Typography>
        <List component="nav" className={classes.list}>
          {posts.map(post => (
            <ListItem button component={AdapterLink} to={post.node.fields.slug}>
              <ListItemText
                primary={post.node.frontmatter.title}
                secondary={post.node.frontmatter.date}
              />
            </ListItem>
          ))}
        </List>
        <Button
          variant="outlined"
          color="primary"
          component={AdapterLink}
          to="/tags/"
        >
          Voir tous les tags
        </Button>
      </PageLayout>
    </Layout>
  );
}

export default TagRoute;

export const tagPageQuery = graphql`
  query TagPage($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 1000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM DD, YYYY")
          }
        }
      }
    }
  }
`;
