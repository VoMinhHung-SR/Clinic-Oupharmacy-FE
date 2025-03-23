import { Outlet, useLocation } from "react-router"
import Footer from "./components/footer"
import Nav from "./components/nav"
import 'react-toastify/dist/ReactToastify.css';
import { Container } from "@mui/material";
import LimitExamPerDay from "../../pages/HomeComponents/LimitExamPerDay";

const Layout = () => {
    const location = useLocation();
    const isHomepage = location.pathname === '/';
  return (
    <>
        <Nav/>
        <main className="ou-min-h-[600px] ou-relative ou-z-0 ou-mt-[62px] ou-bg-[#ededed]
      
        ">
            {isHomepage ? (
            <Outlet />
            ) : (
            <Container className="ou-py-8">
                <Outlet />
            </Container>
            )}
        </main>
        {/* <LimitExamPerDay/> */}
        <Footer />
    </>
)
}


export default Layout   