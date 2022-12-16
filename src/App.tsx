import React, { useState, useEffect } from 'react';
import './App.css';
import list from './data/guessItemsList';

interface IClicked {
  name: string
  img: string
  id: number
}

const App: React.FC = () => {
  const [state, setState] = useState(list);
  const [clicked, setClicked] = useState<IClicked[]>([]);
  const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[]>([]);

  const clickHandler = (clickedItem: IClicked) => {
    setClicked(prev => [...prev, clickedItem])
    setState(prev => [...prev.map((el) => {
      if (el.id === clickedItem.id) {
        el.disabled = true;
      }
      return el;
    })])
    let timeout = setTimeout(() => {
      setState(prev => [...prev.map((el) => {
        if (el.id === clickedItem.id) {
          el.disabled = false;
        }
        return el;
      })])
      setClicked([])
    }, 1000)
    setTimers(prev => [...prev, timeout])
  }
  useEffect(() => {
    if (clicked.length === 2 && clicked[0].id !== clicked[1].id && clicked[0].name === clicked[1].name) {
      setClicked([]);
      setState(prevState => prevState.map(el => {
        if (el.id === clicked[0].id || el.id === clicked[1].id) {
          el.disabled = true;
        }
        return el; 
      }))
      clearTimeout(timers.at(-1))
      clearTimeout(timers.at(-2))
    } else if (clicked.length === 2 && clicked[0].id !== clicked[1].id && clicked[0].name !== clicked[1].name) {
      setClicked(prevState => prevState.splice(0,1))
    } else if (clicked.length === 2 && clicked[0].id === clicked[1].id) {
      setClicked(prevState => prevState.splice(0, 1));
    }
  }, [clicked])

  return (
    <div className='container'>
      <div className='App'>
        {state.map((el) => {
          return (
            <button disabled={el.disabled} onClick={() => clickHandler(el)} className="flip-card" key={el.id} >
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
