import React,{useState} from 'react';
import Client from '../Components/Client';
import Editor from "../Components/Editor";


const EditorPage = () => {
    const [clients,setClients] = useState([
    {socketId:1,username:"Rakesh K"},
    {socketId:2,username:"john Doe"},
]);
  return (
    <div className='mainWrap'>
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img
                className='logoImage'
                src='/code-sync.png'
                alt='logo'
            />
          </div>
          <h3>Connected</h3>
          <div className='clientList'>
            {clients.map((client)=>(
              <Client 
              key={client.socketId} 
              username={client.username}
               />
            ))}
          </div>
        </div>
        <button className='btn copyBtn'>Copy ROOM ID</button>
        <button className='btn leaveBtn'>Leave</button>
      </div>
      <div className='editorwrap'>
        <Editor/>
      </div>
    </div>
  )
}

export default EditorPage;