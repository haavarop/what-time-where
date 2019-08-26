import React from "react";
import "../styles/TimeItem.css";
import moment from "moment-timezone"

const TimeItem = props => {
  const {color, utc_format, places, tz_name1st, name} = props;
  

  const calculateLocalDate = () => {
    if(moment.tz.zone(tz_name1st)) {
      return moment.tz(tz_name1st).format("HH:mm:ss")
    }
    // Calculate time manually if no valid zone is selected 
    return moment.tz("Europe/London")
            .subtract(-parseInt(name), 'hours')
            .format("HH:mm:ss");
  }

  return (
    <div style={{backgroundColor: color}} className="item-container">
      <h4 className="text">{tz_name1st ? tz_name1st.replace("_", " ") : places} (UTC+{name})</h4>
      <h2 className="text">{calculateLocalDate()}</h2>
    </div>
  );
};

export default TimeItem;
