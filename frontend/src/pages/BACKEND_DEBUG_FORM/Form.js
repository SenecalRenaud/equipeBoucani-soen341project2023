import {useEffect, useState} from 'react';
import APIService from './APIService'
import CoreUICard from "../../components/CoreUICard";
import {type} from "@testing-library/user-event/dist/type";
const Form = (props) => {
    const [title, setTitle] = useState('')
    const [body, setBody] = useState('')


    const handleSubmit=  (event)=>{
      event.preventDefault()
        APIService.InsertArticle({title,body})
      .then((response) => props.postedArticle(response))
      .catch(error => console.log('error',error))
      setTitle('')
      setBody('')
        window.location.reload();

    }
    let [data,setData] = useState([{}]);
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
       <div>
                 <header className="Debug-header">
        <h1> Flask and React integration </h1>
            <h3>by Antoine Cantin. TEMPORARY PAGE to test requests,routes,etc.. and api feature
                {/* eslint-disable-next-line react/style-prop-object */}
                of the backend. <span style={{color: 'red'}}> DO NOT EDIT</span>.</h3>
        </header>
        <div style={{display: 'flex', justifyContent: 'center', flexDirection: 'column', alignContent: 'flex-start',alignItems: 'stretch'}}>
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
                                date={new Date(Date.parse(data.date[i])).toLocaleString()}
                    />



                ))
            )

            }
        </div>
        <h3> Post a new comment </h3>
           <form onSubmit = {handleSubmit} >

          <label >Title</label>
          <input
          type="text"
          placeholder ="Enter title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
          />

          <label >Body</label>
          <textarea
          placeholder ="Enter body"
          rows='6'
          value={body}
          onChange={(e)=>setBody(e.target.value)}
          required
          >
          </textarea>

          <input type="submit" value="Publish comment"/>

        </form>
       </div>
  )}

export default Form;
