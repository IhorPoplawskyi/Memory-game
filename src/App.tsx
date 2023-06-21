import React, { useState, useEffect } from 'react';
import questionMark from './questionMark.png'
import './App.css';
import list from './data/guessItemsList';

interface IClicked {
  name: string
  img: string
  id: number
  disabled: boolean
}

const App: React.FC = () => {
  const [state, setState] = useState<IClicked[]>(list);
  const [clicked, setClicked] = useState<IClicked[]>([]);
  const [timers, setTimers] = useState<ReturnType<typeof setTimeout>[]>([]);
  const [miliseconds, setMiliseconds] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [live, setLive] = useState<boolean>(false);
  const [clicks, setClicks] = useState<number>(0);
  const [showWin, setShowWin] = useState<boolean>(false);

  const clickHandler = (clickedItem: IClicked) => {
    if (!live) {
      setLive(true)
    }
    setClicks(counter => counter + 1)
    setClicked(prev => [...prev, clickedItem])
    setState(prev => [...prev.map((el) => {
      if (el.id === clickedItem.id) {
        el.disabled = true;
      }
      return el;
    })])
    let timeout = setTimeout(() => {
      setState(prev => [...prev!.map((el) => {
        if (el.id === clickedItem.id) {
          el.disabled = false;
        }
        return el;
      })])
      setClicked([])
    }, 1500)
    setTimers(prev => [...prev, timeout])
  }
  useEffect(() => {
    if (clicked.length === 2 && clicked[0].id !== clicked[1].id && clicked[0].name === clicked[1].name) {
      setClicked([]);
      setState(prevState => prevState!.map(el => {
        if (el.id === clicked[0].id || el.id === clicked[1].id) {
          el.disabled = true;
        }
        return el;
      }))
      clearTimeout(timers.at(-1))
      clearTimeout(timers.at(-2))
    } else if (clicked.length === 2 && clicked[0].id !== clicked[1].id && clicked[0].name !== clicked[1].name) {
      setClicked(prevState => prevState.splice(0, 1))
    } else if (clicked.length === 2 && clicked[0].id === clicked[1].id) {
      setClicked(prevState => prevState.splice(0, 1));
    }
  }, [clicked])

  useEffect(() => {
    if (state.every(el => el.disabled === true)) {
      setLive(false);
      setTimeout(() => setShowWin(true), 700)
    }
  }, [state])

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> = setInterval(() => { });
    if (live) {
      interval = setInterval(() => {
        setMiliseconds(time => time + 1)
        if (miliseconds === 60) {
          setSeconds(seconds => seconds + 1)
          setMiliseconds(0)
        }
        if (seconds === 60) {
          setSeconds(0)
          setMinutes(minutes => minutes + 1)
        }
      }, 10)
    }
    if (!live) {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [live, miliseconds])

  return (
    <div className='container'>
      <div className='infoBlock'>
        {showWin && <div className='congrats'>
          <button onClick={() => setShowWin(false)} className='closeResBtn'>close</button>
          You win!
          <div className='congratsDiv'>Time:
            {minutes < 10 ? <div>{`0${minutes}:`}</div> : <div>{`${minutes}:`}</div>}
            {seconds < 10 ? <div>{`0${seconds}:`}</div> : <div>{`${seconds}:`}</div>}
            {miliseconds < 10 ? <div>{`0${miliseconds}`}</div> : <div>{`${miliseconds}`}</div>}
          </div>
          <div>
            Clicks: {clicks}
          </div>
          <img className='uncle' alt='uncle' src='../icons/molitva.gif'/>
        </div>
        }
        <div className='timeBlock'>Time:
          {minutes < 10 ? <div>{`0${minutes}:`}</div> : <div>{`${minutes}:`}</div>}
          {seconds < 10 ? <div>{`0${seconds}:`}</div> : <div>{`${seconds}:`}</div>}
          {miliseconds < 10 ? <div>{`0${miliseconds}`}</div> : <div>{`${miliseconds}`}</div>}
        </div>
        <div>Clicks: {clicks}</div>
      </div>
      <div className='App'>
        {state.map((el) => {
          return (
            <button disabled={el.disabled} onClick={() => clickHandler(el)} className="flip-card" key={el.id} >
              <div className="flip-card-inner">
                <div className="flip-card-front">
                  <img src={questionMark} alt="img" />
                </div>
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
