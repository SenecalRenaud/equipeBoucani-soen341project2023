import React from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrashCan,faPen } from '@fortawesome/free-solid-svg-icons'
export const CardTitle = styled.h1`
    font-size: 2em;
`;
export const CardGivenTitle = styled.h4`
    font-size: 1.25em;
`;
export const CardArticle = styled.div`
    border: 1px solid darkblue;
    margin: 10px;
    width: 100%;
    align-self: stretch;
`;
export const CardText = styled.p`
`;
export const CardDate = styled.b`
`;
export const CardDeleteButton = styled.button`
    float: right;
    margin-right: 3.5em;
    font-size: 2ch;
    background: none;
    
    
`;
export const CardEditButton = styled.button`
    float: right;
    margin-right: 3.5em;
    font-size: 2ch;
    background: none;
    color: green;
    
`;
const CoreUICard = ({title,body,id,date}) => {
return (<>
    <CardArticle>



        <CardTitle>Comment post ID#{id} </CardTitle>
        <CardDeleteButton><FontAwesomeIcon icon={faTrashCan}/></CardDeleteButton>
        <CardEditButton><FontAwesomeIcon icon={faPen}/></CardEditButton>

        <CardGivenTitle >{title}</CardGivenTitle>

        <CardText>

            {body}

        </CardText>

        <CardDate>Date posted: {date}

        </CardDate>

    </CardArticle>
    </>);};
export default CoreUICard;
