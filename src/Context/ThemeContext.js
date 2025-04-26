import { createContext, useReducer } from "react";

export const ThemeContext = createContext()


export const themeReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_COLOR':
            return { ...state, color: action.payload }
        default:
            return state
    }
}


export const ThemeContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(themeReducer, { color: '#4FC3F7'})


    const changeColour = (color) => {
        dispatch({ type: 'CHANGE_COLOR', payload: color })
    }


    return (
        <ThemeContext.Provider value={{ ...state, changeColour}}>
            {children}
        </ThemeContext.Provider>
    )
}