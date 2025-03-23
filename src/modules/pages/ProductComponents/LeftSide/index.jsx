import { Box } from "@mui/material"


const ProductHomeLeft = ({cates}) => {
    
    if(!cates)
        return <div>danh muc khong ton tai</div>

    return (cates && cates.map(c => 
        <>
            <Box>
                <div key={`c-${c.id}`} className="ou-border-[1.5px] ou-border-black ou-border-solid ou-rounded-lg ou-p-3 ou-my-3 
                hover:ou-text-white hover:ou-font-semibold hover:ou-border-blue-700 hover:ou-cursor-pointer hover:ou-bg-blue-700">
                    {c.name}
                </div>
            </Box>
        </>
        
    ))
    
}

export default ProductHomeLeft