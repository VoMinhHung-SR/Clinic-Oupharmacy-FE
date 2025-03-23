import { Box, Button, Paper } from "@mui/material"
import MedicinesHome from "../../modules/pages/ProductComponents/MedicinesHome"

const ProductList = () => {
    return <Box><div className="ou-py-8"><MedicinesHome actionButton={<>
        <Button fullWidth className="!ou-p-3 !ou-bg-blue-600 !ou-text-white"> Them vao gio </Button>
    </>}/></div></Box>
}
export default ProductList