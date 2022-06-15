import "./boringpage.scss"
import { Typography, Stack } from '@mui/material'

function renderPageData(data) {

  function renderSectionData(sec) {
    
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

export default function BoringPage({ data }) {
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
