import { Box, Collapse, ListItemButton, ListItemText } from "@mui/material"
import useCollapse from "../hooks/useCollapse"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import Loading from "../../Loading"
import { EXAM_DETAIL_COLLAPSE_CARD_SX } from "../../card/ExaminationDetailCard/detailLayoutTokens"

const CustomCollapseListItemButton = ({ title, content, loading, isOpen, standalone = false }) => {
  const { open, handleSetOpen } = useCollapse(isOpen)

  return (
    <Box
      sx={{
        ...(standalone ? EXAM_DETAIL_COLLAPSE_CARD_SX : {}),
        ...(!standalone
          ? {
              borderBottom: 1,
              borderColor: "divider",
              "&:last-child": { borderBottom: 0 },
            }
          : {}),
      }}
    >
      <ListItemButton
        onClick={handleSetOpen}
        sx={{
          py: 1.5,
          px: 2,
          bgcolor: open ? "#f8faff" : "transparent",
          borderLeft: 3,
          borderColor: open ? "primary.main" : "transparent",
          transition: "background-color 0.2s, border-color 0.2s",
          "&:hover": { bgcolor: open ? "#f0f4ff" : "action.hover" },
        }}
      >
        <ListItemText
          primary={title || "Title"}
          primaryTypographyProps={{
            variant: "body2",
            fontWeight: 600,
            color: open ? "primary.dark" : "text.primary",
          }}
        />
        {open ? <ExpandLess color="primary" fontSize="small" /> : <ExpandMore color="action" fontSize="small" />}
      </ListItemButton>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {loading ? (
          <Box sx={{ py: 3, px: 2 }}>
            <Loading />
          </Box>
        ) : (
          <Box
            sx={{
              px: 2,
              py: 2,
              bgcolor: "grey.50",
              ...(standalone ? { borderTop: 1, borderColor: "divider" } : { borderTop: 1, borderColor: "divider" }),
            }}
          >
            {content || "Content"}
          </Box>
        )}
      </Collapse>
    </Box>
  )
}

export default CustomCollapseListItemButton
