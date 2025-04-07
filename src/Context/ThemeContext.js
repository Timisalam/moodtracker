import { createContext, useReducer } from "react";

export const ThemeContext = createContext()


//takes in current state and an action to determine next state
export const themeReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE_COLOR':
            return { ...state, color: action.payload }
        default:
            return state
    }
}


export const ThemeContextProvider = ({ children }) => {
    //initial state 
    const [state, dispatch] = useReducer(themeReducer, { color: '#4FC3F7'})


    //dispatches action
    const changeColour = (color) => {
        dispatch({ type: 'CHANGE_COLOR', payload: color })
    }


    return (
        <ThemeContext.Provider value={{ ...state, changeColour}}>
            {children}
        </ThemeContext.Provider>
    )
}