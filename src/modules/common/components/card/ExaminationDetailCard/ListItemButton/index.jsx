import { Button } from "@mui/material"
import clsx from "clsx"

const ListItemButton = ({title, arrayContent, callback, isLoading}) => {
    return (
        <div>{title}: 
            {arrayContent.length !== 0 ? 
                arrayContent.map(obj => <>
                    <Button className={clsx("!ou-ml-2 ",{
                  '!ou-bg-green-800 !ou-text-white': !isLoading,
                  "!ou-bg-gray-500 !ou-text-black ou-opacity-70": isLoading} )}
                        disabled={isLoading}
                        onClick={()=> {callback(obj.id)}}>{obj.id}
                    </Button>
                </>
                )
            : <></>}
        </div>
    
    )
}
export default ListItemButton