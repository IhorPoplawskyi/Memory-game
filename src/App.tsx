import React, { useState, useRef, useEffect } from 'react';
import './App.css';
import list from './data/guessItemsList';

interface IClicked {
  name: string
  img: string
  id: number
}

const App: React.FC = () => {
  const [clicked, setClicked] = useState<IClicked[]>([]);
  const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[]>([]);
  const myRefs = useRef<HTMLButtonElement[]>([]);
  console.log(clicked)
  const clickHandler = (clickedItem: IClicked, index: number) => {
    setClicked(prev => [...prev, clickedItem])
    myRefs.current[index].disabled = true;
    let timeout = setTimeout(() => {
      myRefs.current[index].disabled = false;
      setClicked([]);
    }, 1500)
    setTimers(prev => [...prev, timeout])
  }
  useEffect(() => {
    if (clicked.length === 2 && clicked[0].id !== clicked[1].id && clicked[0].name === clicked[1].name) {
      setClicked([]);
      timers.map(el => clearTimeout(el))
    } else if (clicked.length === 2 && clicked[0].id === clicked[1].id) {
      setClicked([]);
    } else if (clicked.length === 2 && clicked[0].id !== clicked[1].id && clicked[0].name !== clicked[1].name) {
      setClicked([]);
    }
  }, [clicked])

  return (
    <div className='container'>
      <div className='App'>
        {list.map((el, index) => {
          return (
            <button key={el.id} ref={(el) => (myRefs.current[index] = el as HTMLButtonElement)}
              onClick={() => clickHandler(el, index)} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-card-front"></div>
                <div className="flip-card-back">
                  <img src={el.img} alt="img" />
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}

export default App;
