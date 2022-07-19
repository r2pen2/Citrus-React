import "./breadcrumbs.scss";
import {Breadcrumbs as MUIBreadcrumbs, Link} from "@mui/material"

function mapPath(p) {
    const path = p.split("/");
    return path.map((link, idx) => {
        return (
            <Link underline='none' color="inherit" key={link}>
                <div className={(idx + 1 === path.length ? "current " : "") + (idx === 0 ? "first" : "")}>
                    {link}
                </div>
            </Link>
        )
    })
}

export default function Breadcrumbs({path}) {
  return (
    <div className="breadcrumbs">
        <MUIBreadcrumbs aria-label="breadcrumb">
            { mapPath(path) }
        </MUIBreadcrumbs>
    </div>
  )
}
