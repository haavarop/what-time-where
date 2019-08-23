import React from "react";
import "../styles/TimeItem.css";
import moment from "moment-timezone"

const TimeItem = props => {
  const {color, utc_format, places, tz_name1st, name} = props;
  
  const calculateLocalDate = (local_utc) => {    
    return moment().tz(local_utc).format("HH:mm:ss")
  }

  return (
    <div style={{backgroundColor: color}} className="item-container">
      <h2 className="text">{tz_name1st ? tz_name1st : places}</h2>
      <h4 className="text">{tz_name1st ? calculateLocalDate(tz_name1st) : name}</h4>
    </div>
  );
};

export default TimeItem;
