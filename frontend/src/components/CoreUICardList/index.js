import React from "react";
import CoreUICard from "../CoreUICard";

const CoreUICardList = ({ data }) => {
  return (
    <>
      {typeof data.id === "undefined" ? (
        <p>Loading... (Dont forget to launch the API/backend server !)</p>
      ) : (
        data.id.map((id, i) => (
          <CoreUICard
            key={i}
            title={data.title[i]}
            body={data.body[i]}
            id={id}
            date={new Date(Date.parse(data.date[i])).toLocaleString()}
            editDate={new Date(Date.parse(data.editDate[i])).toLocaleString()}
          />
        ))
      )}
    </>
  );
};

export default CoreUICardList;
