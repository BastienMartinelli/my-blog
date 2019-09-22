import React from "react";
import { kebabCase } from "lodash";
import Helmet from "react-helmet";
import { graphql } from "gatsby";
import Layout from "../../components/Layout";
import PageLayout from "../../components/PageLayout";
import { Typography } from "@material-ui/core";
import makeStyles from "@material-ui/styles/makeStyles";

import Tag from "../../components/Tag";

const useStyles = makeStyles({
  title: {
    marginBottom: 16
  }
});

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title }
    }
  }
}) => {
  const classes = useStyles();

  return (
    <Layout pageName="tags">
      <Helmet title={`Tags | ${title}`} />
      <PageLayout title="Tags">
        <Typography className={classes.title} component="h1" variant="h4">
          Tous les tags
        </Typography>
        {group.map(tag => (
          <Tag
            key={tag.fieldValue}
            label={tag.fieldValue}
            count={tag.totalCount}
            to={`/tags/${kebabCase(tag.fieldValue)}/`}
          />
        ))}
      </PageLayout>
    </Layout>
  );
};

export default TagsPage;

export const tagPageQuery = graphql`
  query TagsQuery {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 1000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`;
