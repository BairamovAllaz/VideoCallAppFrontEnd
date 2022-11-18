import React from "react";
import {MediaConnection, Peer} from 'peerjs';

function App() {
  const [Id,setId] = React.useState<string | null>();
  const VideoRef = React.useRef<HTMLVideoElement | null>(null);
  const [currentPeer,setCurrentPeer] = React.useState<Peer>();
  
  React.useEffect(() => { 
    var peer = new Peer(); 
    peer.on("open",(data) => { 
      console.log("Id: " + data);
    })

    peer.on("call",async function(conn) { 
      try{ 
         let stream : MediaStream = await GetMediaStream();
         conn.answer(stream);
         ShowStream(conn);
      }catch(err) {
        console.log(err);
      } 
    })
    setCurrentPeer(peer);
  },[])

  async function Call(){ 
    try{ 
      let stream : MediaStream = await GetMediaStream();
      const call : MediaConnection | undefined = currentPeer?.call(Id as string,stream);
      ShowStream(call);
    }catch(err) { 
      console.log(err);
    }
  }

  async function GetMediaStream() : Promise<MediaStream> 
  { 
      let media : MediaStream = await navigator.mediaDevices.getUserMedia({video : true,audio : true});
      return media;
  }

  function ShowStream(mediaConnection : MediaConnection | undefined) : void
  { 
    if(mediaConnection == undefined) return;
    mediaConnection?.on("stream", (mediastream) => {
      if (VideoRef && VideoRef.current != null) {
        VideoRef.current.srcObject = mediastream;
        VideoRef.current.onloadedmetadata = function (e) {
          if (VideoRef.current != null) {
            VideoRef.current.play();
          }
        };
      }
    })
  }

  return (
    <div className="App">
      <input onChange={(e : React.ChangeEvent<HTMLInputElement>) => setId(e.target.value)}/>
      <button onClick={Call}>Call</button> 
      <div style = {{width : "100%",marginTop: "10px"}}>
        <div style={{ width: "300px", height: "300px" }}>
          <video ref={VideoRef} autoPlay width="300" height="300"/>
        </div>
      </div>
    </div>
  );
}

export default App;
