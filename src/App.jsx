import { useState, } from 'react'
import {data} from './data'

function App() {
  const [display, setDisplay] = useState(0)
  const [answer, setAnswer] = useState('')
  const {layout, numbers, operators, beforeNum, afterNum} = data; 
  let resetMemory;
  sessionStorage.getItem('memoryRS') ? resetMemory = sessionStorage.getItem('memoryRS') : resetMemory = false;

  const handleClick = (e) => {
    setDisplay((current) => {
      let newNum;
      let m = false;
      try{
        e.target.id ? newNum = e.target.id : newNum ;
      } catch{newNum=parseInt(e); m=true;}
      newNum === 'x²' ? newNum = '²' : newNum
      let result = 0;
      let lastChar;
      current[current.length - 1] === ' '? lastChar = current[current.length - 2] : lastChar = current[current.length - 1];
      if(display!=0){
        if(numbers.includes(parseInt(lastChar)) || numbers.includes(parseInt(JSON.stringify(current)[JSON.stringify(current).length -1]))){
          if(numbers.includes(parseInt(newNum)) || m===true || afterNum.includes(newNum)){
            result = current + newNum
          } else if(operators.includes(newNum)){
            result = current + ' ' + newNum;
          } else {
            result = current
          }
        } else if (operators.includes(lastChar)){
          numbers.includes(parseInt(newNum)) || m===true  || beforeNum.includes(newNum) ? result = current + ' ' + newNum : result = current;
        } else if (beforeNum.includes(lastChar)){
          numbers.includes(parseInt(newNum)) || m===true  ? result = current + newNum : result = current
        } else if (afterNum.includes(lastChar)){
          if(operators.includes(newNum)){
            result = current + ' ' + newNum;
          } else if(numbers.includes(parseInt(newNum)) || m===true  && lastChar === '.') {
            result = current + newNum;
          }else {
            result = current
          }
        }
        setAnswer(calculateEquation(result))
        return result;
      } else{
        return numbers.includes(parseInt(newNum)) || m===true  || beforeNum.includes(newNum) ? newNum : 0;
      }
    })
  }

  const calculate = (e) => {
    const special = e.target.id;
    if(special === '=') {
      setDisplay(calculateEquation(display))
      setAnswer('');
    } else if(special === 'C'){
      setDisplay(0)
      setAnswer()
    } else if(special === 'D'){
      let newEquation;
      try{
        if(display.length-1 != 0){
          display[display.length-1] != ' ' ? newEquation = display.slice(0, -1) : newEquation = display.slice(0, -2);
          setDisplay(newEquation)
          setAnswer(calculateEquation(newEquation));
        } else {
          setDisplay(0)
          setAnswer('');
        }
      }catch{
        setDisplay(0)
          setAnswer('');
      }
    } else if(special === 'M' && resetMemory === false){
      try{
        if(sessionStorage.getItem('memory')){
          handleClick(sessionStorage.getItem('memory'))
        } else { 
          if( parseInt(display) != 0 && typeof(JSON.parse(display)) === 'number'){
            sessionStorage.setItem('memory', display)
            let ans = answer;
            setAnswer('M Set to ' + display);
            setTimeout(() => {setAnswer(ans)}, 1500)
          }
        }
      } catch{}
    } else sessionStorage.removeItem('memoryRS');
  }

  let timer;
  const handleMouseDown = () => {
      timer = setTimeout(function() {
        if(sessionStorage.getItem('memory')) {
          sessionStorage.removeItem('memory');
          sessionStorage.setItem('memoryRS', true);
          let ans = answer;
          setAnswer('memory cleared');
          setTimeout(() => {setAnswer(ans)}, 1000);
        }
    }, 1000);
  };

  const calculateEquation = (display) => {
    let result;
    try{
      if(display.includes('²')){
        let newEq = display.replace('²', '**2')
        result = eval(newEq);
      } else {
        result = eval(display)
      }
      return result;
    } catch(e){
      return 0;
    }
  }

  return (
    <div className="container">
      <div id="calculator">
        <section className="display overflow-y-hidden overflow-x-auto w-100" style={{maxWidth: '100%'}}><h2 type="text">{display}</h2><h3>{answer}</h3></section>
        <section className="layout">
          {layout.map((num) => (
            <button id={num} key={num} {...num === 'x²' || num === '=' ? {className: 'number border-radius-bottom'} : {}} {...num === 'C' || num === 'D' || num === 'M' || num === '=' ? {onClick: calculate} : {onClick: handleClick}} {...num === 'M' ? {onMouseDown: handleMouseDown, onMouseUp: () => clearTimeout(timer)} : ''}>{num}</button>
          ))}
        </section>
      </div>
    </div>
  )
}

export default App
