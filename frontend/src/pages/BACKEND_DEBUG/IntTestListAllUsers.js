import React,{useState,useEffect} from "react";
import './IntTestListAllUsers.css';
import CoreUICard from "../../components/CoreUICard";


function AntoineIntegrationTestListAllUsers() {
    const POLLING_DATABASE_UPDATE_INTERVAL = 5
    const [data,setData] = useState([{}]);
    useEffect(() => {
        fetch("/get?mapAsFields=true").then(
            response => response.json()
        ).then(
            data => {
                setData(data);
                console.log(data);
            }
        )
    },[])
    return (
    <div className="Debug">
        <header className="Debug-header">
        <h1> Flask and React integration </h1>
            <h3>by Antoine Cantin. TEMPORARY PAGE to test requests,routes,etc.. and api feature
                {/* eslint-disable-next-line react/style-prop-object */}
                of the backend. <span style={{color: 'red'}}> DO NOT EDIT</span>.</h3>
        </header>
        <div>
            <hr  style={{
    color: '#000000',
    backgroundColor: '#000000',
    height: 5.5,
    borderColor : '#000000'
}}/>

            {(typeof data.id === 'undefined') ? (
                <p>Loading... (Dont forget to launch the API/backend server !)</p>

            ) : (
                data.id.map((id,i) => (
                    <CoreUICard key={i}
                        title={data.title[i]}
                        body={data.body[i]}
                                id={id}
                                date={data.date[i]}
                    />



                ))
            )

            }
        </div>
    </div>
    );
    }

export default AntoineIntegrationTestListAllUsers;

/*
useState:
react hook used inside functionnal components
const [state,setState] = useState(0)


useEffect:
react hook, used for side effects in functionnal components
    useEffect(()=>{
        if([1,5,9,15].includes(counter)){
            console.log("ZUMBANI!" + counter);
        }

    }, [counter])
 */