import React from "react";
import styled from "styled-components";

export const CardTitle = styled.h1`
    font-size: 2em;
`;
export const CardGivenTitle = styled.h4`
    font-size: 1.25em;
`;
export const CardArticle = styled.div`
    border: 1px solid red;
    margin: 10px;
    width: 100%;
    align-self: stretch;
`;
export const CardText = styled.p`
`;
export const CardDate = styled.b`
`;
const CoreUICard = ({title,body,id,date}) => {
return (<>
    <CardArticle>

        <CardTitle>Comment post ID#{id}</CardTitle>

        <CardGivenTitle >{title}</CardGivenTitle>

        <CardText>

            {body}

        </CardText>

        <CardDate>Date posted: {date}</CardDate>

    </CardArticle>
    </>);};
export default CoreUICard;
