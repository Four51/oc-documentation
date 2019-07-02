import React from 'react';
import { Helmet } from 'react-helmet';
import Layout from '../components/Layout/Layout';
import RightMenu from '../components/Layout/RightMenu';
import '../styles/doc-template.css';
import { Button } from '@material-ui/core';
import { Link, graphql } from 'gatsby';
import { groupBy as _groupBy, forEach as _forEach, flatten as _flatten } from 'lodash';


const Template = ({ data }) => {
  const { markdownRemark: post } = data;
  // THIS SNIPPET IS REUSED IN Main.js CONSIDER MOVING TO A SERVICE
  const sectionsWithGuides = _groupBy(data.allMarkdownRemark.edges, 'node.frontmatter.section');
  let contentsArray = [];
  _forEach(sectionsWithGuides, (section, title) => contentsArray = [...contentsArray, {title: title, sections: section.map((s) => s.node)}]);

  const gitHubUrl = 'https://github.com/ordercloud-api/oc-documentation/tree/development/src/pages/docs';
  const flatContents = _flatten(contentsArray.map((c) => c.sections));
  const guideIndex = flatContents.findIndex((section) => section.frontmatter.path === post.frontmatter.path);

  const directionalButton = (direction) => {
    const newGuideIndex = direction === 'Previous' ? guideIndex - 1 : guideIndex + 1;
    return newGuideIndex > 0 && newGuideIndex < flatContents.length - 1 ? (
        <Button>
          <Link to={flatContents[newGuideIndex].frontmatter.path}>{direction} Guide</Link>
        </Button>
      ) : null
    
  }

  return (
    <Layout>
      <div className="documentation-container" style={{margin: '0 3rem', display: 'flex', flexDirection: 'row'}}>
        <Helmet title={`OrderCloud Documentation - ${post.frontmatter.title}`} />
        <div className="documentation-body" style={{ maxWidth: '70%'}}>
          <h1>{post.frontmatter.title}</h1>
          <div
            className="documentation-contents"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
          {directionalButton('Previous')}
          {directionalButton('Next')}
          <a href={`${gitHubUrl}${post.frontmatter.path}.md`} target="_blank" rel="noopener noreferrer">Contribute to this doc</a>
        </div>
        <div style={{ maxWidth: '30%'}}>
          <RightMenu tableOfContents={contentsArray} />
        </div>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query DocTemplateByPath($path: String!) {
    markdownRemark(
      frontmatter: { path: { eq: $path } }
    ) {
      html
      frontmatter {
        path
        title
      }
    }
    allMarkdownRemark(
      sort: { order: ASC, fields: [frontmatter___section] }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            section
            title
            path
          }
        }
      }
    }
  }
`

export default Template;