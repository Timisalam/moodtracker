import './ThemeSelector.css'
import { useThemeContext } from '../hooks/useThemeContext';
const themeColors = ['#4FC3F7', '#800080	','#FF6B6B']


export default function ThemeSelector() {
    const {changeColour} = useThemeContext()
    
    return (
        <div className='theme-selector'>
            <div className='theme-buttons'>
            {themeColors.map(color => (
                <div 
                key= {color}
                onClick={() => changeColour(color)}
                style={{background:color}}
                />     
            ))}
            </div>
        </div>
    );
}
