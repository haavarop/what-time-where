import React from "react";
import "../styles/TimeItem.css";
import moment from "moment-timezone"

const TimeItem = props => {
  const {color, utc_format, places, tz_name1st, name} = props;
  
  const calculateLocalDate = (local_utc) => {    
    const t = moment().tz(local_utc)
    return t ? t.format("HH:mm:ss") : local_utc;
  }

  return (
    <div style={{backgroundColor: color}} className="item-container">
      <h2 className="text">{tz_name1st}</h2>
      <h4 className="text">{calculateLocalDate(tz_name1st)}</h4>
    </div>
  );
};

export default TimeItem;
