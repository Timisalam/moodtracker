import { useEffect, useState } from "react";
import { useFirestore } from "../../hooks/useFireStore";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useThemeContext } from "../../hooks/useThemeContext";
import { useCollection } from "../../hooks/useCollection";
export default function ScreenTimeForm({ uid }) {
    const [amount, setAmount] = useState("");
    const [selectedEmojis, setSelectedEmojis] = useState({
        positive: null,
        sleep: null
    }); 
    const [hasSubmittedToday, setHasSubmittedToday] = useState(false);
    const [filledForm,setFilledForm] = useState(true);
    const { addDocument, response } = useFirestore("screentime")
    const { user } = useAuthContext()
    const { color } = useThemeContext()
    const { documents} = useCollection(
        'screentime',
        ["uid","==",user.uid],
        ["createdAt","desc"]
    )
    const positiveEmojis = [
        { id: 1, symbol: "😢", label: "Terrible" },
        { id: 2, symbol: "😟", label: "Bad" },
        { id: 3, symbol: "😐", label: "Okay" },
        { id: 4, symbol: "😊", label: "Good" },
        { id: 5, symbol: "😄", label: "Great" },
    ];
  
    
    //IMPROVE THIS FUNCTION
    const isValidDocument = () =>{
        const todaysDate = new Date();
        for(var i =0; i < documents.length;i++){
            if( new Date(documents[i].createdAt.seconds * 1000).toLocaleDateString() == todaysDate.toLocaleDateString()){
                    setHasSubmittedToday(true)
            }
        }
        if (Object.values(selectedEmojis).some(value => value == null)) {
            setFilledForm(false)
        }
    }
    const handlePositiveSelect = (emoji) => {
        setSelectedEmojis((prev) => ({
            ...prev,
            positive: prev.positive?.id === emoji.id ? null : emoji
        }));
    };
    
    const handleSleepSelect = (emoji) => {
        setSelectedEmojis((prev) => ({
            ...prev,
            sleep: prev.sleep?.id === emoji.id ? null : emoji
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        isValidDocument();
        if(/*!hasSubmittedToday &&*/ filledForm){
            addDocument({
                amount,
                positiveActivation:selectedEmojis.positive.id,
                sleepQuality: selectedEmojis.sleep.id, 
                uid,
            });
        }
        setAmount('');
        setSelectedEmojis([]);
    };

    const resetForm = () =>{
        setSelectedEmojis({
            positive: null,
            negative: null,
            sleep: null
        }); 
    };
    useEffect(() => {
        if (response.success) {
            setAmount("");
            resetForm();
        }
    }, [response.success]);

    return (
        <>
            <form style={{background:color}} onSubmit={handleSubmit}>
            <h5>What was your screentime for today (hours)?</h5>

                <label>
                    <span>Screentime: </span>
                    <input
                        type="number"
                        required
                        onChange={(e) => setAmount(e.target.value)}
                        value={amount}
                    />
                </label>
                <br></br>
                <h5>Throughout the day, how much have you felt positive, active or enthuastic?</h5>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
                    {positiveEmojis.map((emoji) => (
                        <button
                            key={emoji.id}
                            type="button"
                            onClick={() => handlePositiveSelect(emoji)}
                                style={{
                                fontSize: "2rem",   
                                padding: "0.5rem",
                                border: selectedEmojis.positive?.id === emoji.id ? "2px solid blue" : "1px solid gray",
                                borderRadius: "50%",
                                background: selectedEmojis.positive?.id === emoji.id ? "#e0f7fa" : "#fff",
                                cursor: "pointer",
                            }}
                            aria-label={emoji.label}
                        >
                            {emoji.symbol}
                        </button>
                    ))}
                </div>
                <br></br>
                <h5>How did you sleep last night ?</h5>
                <div style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "1rem 0" }}>
                    {positiveEmojis.map((emoji) => (
                        <button
                            key={emoji.id}
                            type="button"
                            onClick={() => handleSleepSelect(emoji)}
                                style={{
                                fontSize: "2rem",   
                                padding: "0.5rem",
                                border: selectedEmojis.sleep?.id === emoji.id ? "2px solid blue" : "1px solid gray",
                                borderRadius: "50%",
                                background: selectedEmojis.sleep?.id === emoji.id ? "#e0f7fa" : "#fff",
                                cursor: "pointer",
                            }}
                            aria-label={emoji.label}
                        >
                            {emoji.symbol}
                        </button>
                    ))}
                </div>
                <br></br>
                <button type="submit">Submit daily check-in</button>
                <br></br>
                {!filledForm && <p>Please select an emoji to indicate how your day went. </p>}
                <br></br>
                {hasSubmittedToday && <p>You have already submitted your daily check-in please come back again tomorrow. </p>}
            </form>
        </>
    );
}
