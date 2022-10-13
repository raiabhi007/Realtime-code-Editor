import React from 'react'

const Home = () => {
  return (
    <div className="homePageWrapper">
      <div className="formWrapper">
        <img
         className='homePageLogo'
         src='/code-sync.png' 
         alt='code-sync-logo'/>
        <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
        <div className='inputGroup'>
          <input
             type="text"
             className="inputBox"
             placeholder="ROOMID"
          />
          <input
             type="text"
             className="inputBox"
             placeholder='USERNAME'
          />
          <button className='btn joinBtn'>Join</button>
          <span className='createInfo'>
            If you don't have an invite then create &nbsp;
            <a href="" className='createNewBtn'>
              new Room
            </a>
          </span>
        </div>
      </div>
      <footer>
        <h4 >By &nbsp; 
          <a href='https://github.com/raiabhi007' target="blank">
            Abhishek Rai
          </a>
        </h4>
      </footer>
    </div>
  )
}

export default Home;