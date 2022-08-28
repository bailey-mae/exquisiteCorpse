import './index.css';
import Canvas from './Components/Canvas';
import Logo from './Assets/Logo.png';
import pen from './Assets/pen.svg';

function App() {

  return (
    <div className="App">
          <img className="Logo" src={Logo} alt="logo"/>
      <div className='canvasAlignment'>
          <Canvas className="Canvas" width={700} height={500}/>
      </div>
        <div>
        </div>
        <pen/>

      <div className='controlPanel'>
          {/*<pen src={pen}></pen>*/}
          {/*<pen/>*/}
          <button className="pen" src={pen} alt="pen"/>
          {/*<button className="colorPicker" data-clr="#fff"></button>*/}
          {/*<button className="colorPicker" data-clr="#EF626C"></button>*/}
          {/*<button className="colorPicker" data-clr="#24d102"></button>*/}
          {/*<button className="colorPicker" data-clr="#000"></button>*/}
          {/*<button className="colorPicker" data-clr="#fdec03"></button>*/}
      </div>
        <div id="currentSegment"></div>
    </div>
  );
}

export default App;
