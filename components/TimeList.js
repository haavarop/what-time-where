import React, {useState, useEffect} from "react"
import "../styles/TimeList.css"
import TimeItem from "./TimeItem"

const TimeList = (props) => {
  const [date, setDate] = useState(0)
  const { timezones } = props;
  
  useEffect(() => {
    const timerID = setInterval( () => tick(), 1000 );
  
    return function cleanup() {
        clearInterval(timerID);
      };
   });
  
  const tick = () => { 
    setDate(new Date());
  }

  return(
      <div className="timezones">
        {timezones.map(zone => {
          return <TimeItem {...zone}/>
        })}
      </div>
    );
}

export default TimeList;