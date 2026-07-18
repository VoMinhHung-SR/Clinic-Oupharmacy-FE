import { Outlet, useLocation } from "react-router"
import Footer from "./components/footer"
import Nav from "./components/nav"
import "react-toastify/dist/ReactToastify.css"
import { Box, Container, ThemeProvider } from "@mui/material"
import { publicTheme } from "../../../theme/publicTheme"

const Layout = () => {
  const location = useLocation()
  const isHomepage = location.pathname === "/"

  return (
    <ThemeProvider theme={publicTheme}>
      <Nav />
      <Box
        component="main"
        sx={{
          minHeight: { xs: "calc(100vh - 56px)", sm: 600 },
          position: "relative",
          zIndex: 0,
          mt: { xs: "56px", md: "64px" },
          bgcolor: "background.paper",
        }}
      >
        {isHomepage ? (
          <Outlet />
        ) : (
          <Container
            maxWidth="lg"
            sx={{
              py: { xs: 2, sm: 3, md: 4 },
              px: { xs: 1.5, sm: 2, md: 3 },
            }}
          >
            <Outlet />
          </Container>
        )}
      </Box>
      <Footer />
    </ThemeProvider>
  )
}

export default Layout
