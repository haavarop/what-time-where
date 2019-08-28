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
        {timezones.length > 0 ? 
          (timezones.map(zone =>  <TimeItem {...zone} key={zone.id}/>)) 
          : 
          (<h3 className="text">Click on a part of the map to see the time there</h3>)
        }
      </div>
    );
}

export default TimeList;