import { ThemeContext } from "../Context/ThemeContext";
import { useContext } from "react";

export const useThemeContext = () =>{
    const context  = useContext(ThemeContext)

    if(context===undefined){
        throw new Error("useThemeContext() must be used inside a ThemeProvider")
    }

    return context
}