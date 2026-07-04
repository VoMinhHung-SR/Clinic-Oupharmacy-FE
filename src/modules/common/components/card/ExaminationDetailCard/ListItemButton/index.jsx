import { Chip, Stack, Typography } from "@mui/material"

const ListItemButton = ({ title, arrayContent, callback, isLoading, selectedId }) => {
  return (
    <Stack spacing={1}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      {arrayContent.length !== 0 ? (
        <Stack direction="row" flexWrap="wrap" gap={1}>
          {arrayContent.map((obj) => {
            const isSelected = selectedId === obj.id
            return (
              <Chip
                key={obj.id}
                label={obj.id}
                size="small"
                clickable={!isLoading}
                disabled={isLoading}
                variant={isSelected ? "filled" : "outlined"}
                color={isSelected ? "primary" : "default"}
                onClick={() => callback(obj.id)}
                sx={{ fontWeight: 600 }}
              />
            )
          })}
        </Stack>
      ) : null}
    </Stack>
  )
}

export default ListItemButton
