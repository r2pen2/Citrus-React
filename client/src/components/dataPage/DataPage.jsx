// Style imports
import "./datapage.scss"

// Library Imports
import { Typography, Stack } from '@mui/material'

/**
 * Renders HTML elements based on page data
 * @param {Object} data data as JSON
 * @returns {Component} HTML representing data
 */
function renderPageData(data) {

  /**
   * Renders HTML elements based on a data section
   * @param {Object} sec current data section
   * @returns {Component} HTML for current section
   */
  function renderSectionData(sec) {
    
    /**
     * Gets the href from a section item (if it exists)
     * @param {Object} item current section item
     * @returns {String} href attached to item
     */
    function getHref(item) {
      return item.href ? item.href : ("#" + item.title)
    }

    return (
      sec.items.map((item, itemIndex) =>
      <div className="section-item" key={itemIndex}>
        <Typography variant="h6" component="a" href={getHref(item)}>{item.title}</Typography>
        <Typography variant="subtitle2">{item.subtitle}</Typography>
      </div>
    ))
  }

  return (
    data.sections.map((sec, secIndex) => 
        <div className="data-section" key={secIndex}>
        <Typography variant="h4" gutterBottom={true}>{sec.sectionTitle}</Typography>
        { renderSectionData(sec) }
      </div>
    )
  )
}

export default function DataPage({ data }) {
  console.log(data)
  return (
    <div className="boring-page">
      <Typography variant="h2" marginTop="50px" gutterBottom={true}>{data.pageTitle}</Typography>
      <Stack>
        { renderPageData(data) }
      </Stack>
    </div>
  )
}
