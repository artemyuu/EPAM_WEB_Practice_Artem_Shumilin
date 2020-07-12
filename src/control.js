export const startApp = () =>{
    function main(){
        const AVAILABLE_MODS = {
            Default: 'Chose a mode', 
            SpeakerMode: 'Speaker-mode',
            StreamMode: 'Stream-mode'
        }
        const info = document.querySelector('.info')
        const control = document.querySelectorAll('.disabled')
    
        const io = require('socket.io-client')
        const socket = io.connect('https://voicy-speaker.herokuapp.com/',{reconnection: true})
        let streamMode = false
    
        socket.on('audioMessage', playStreamMsg)
    
        for(let i = 0; i < control.length; i++){    
                control[i].addEventListener('click', (e)=>{
                    if(control[i].className === 'control_button enabled'){
                        control[i].className = 'control_button disabled'
                        info.innerHTML = AVAILABLE_MODS.Default
                        streamMode = false
                    }
                    else{  
                        control.forEach(el=>{
                                el.className = 'control_button disabled'
                        })
                        control[i].className = 'control_button enabled'
                        switch(i){
                            case 0:
                                getAllVoices()
                                break
                            case 1:
                                initMicrophone(socket)
                                info.innerHTML = `Active:${AVAILABLE_MODS.SpeakerMode}`
                                break
                            case 2:
                                info.innerHTML = `Active:${AVAILABLE_MODS.StreamMode}`
                                streamMode = true
                        }
                    }
                })
            }
        
        function playStreamMsg(){
            if(streamMode){
                const audioBlob = new Blob(data)
                const audioUrl = URL.createObjectURL(audioBlob)
                const audio = new Audio(audioUrl)
                audio.play()
             }
        }
    
        async function initMicrophone(socket){
            streamMode = false
            try{
                const stream = await navigator.mediaDevices.getUserMedia({audio: true})
                const pause = document.querySelector('.pause')
                    const mediaRecorder = new MediaRecorder(stream)
                    let voice = []
                    mediaRecorder.start()
                    pause.classList.remove('hidden')
                    pause.classList.add('show')
                    mediaRecorder.addEventListener('dataavailable', e =>{
                        voice.push(e.data)
                    })
                    pause.addEventListener('click', ()=>{
                        mediaRecorder.stop()
                        pause.classList.remove('show')
                        pause.classList.add('hidden')
                    })
        
                    mediaRecorder.addEventListener('stop', ()=>{
                        let buf = []
                        buf.push(voice[0])
                        socket.emit('audioMessage', buf)
                    })
            }
            catch{
                const info = document.querySelector('.info')
                info.innerHTML = 'Allow access to the microphone'
            }
        }
        
        async function getAllVoices(){
            streamMode = false
            const info = document.querySelector('.info')
            info.innerHTML = ''
            const ul = document.createElement('ul')
            info.appendChild(ul)
            const response = await fetch('https://voicy-speaker.herokuapp.com/voices')
            const data = await response.json()
            console.log(data);
            for(let i = 0; i < data.length; i++){
                createLiItem(data[i])
            }
        }
        
        function createLiItem(data){
            const ul = document.querySelector('ul')
            const li = document.createElement('li')
            if((Array.isArray(data.audioBlob))){
                if((data.audioBlob.length != 0 && data.audioBlob[0] != null)){
                    const audioBlob = new Blob([new Uint8Array(data.audioBlob[0].data).buffer])
                    li.innerHTML = `Voice: ${data.timeStamp.slice(0, -38)}`
                    ul.appendChild(li)
                    li.addEventListener('click', addAudioOnLiItem(audioBlob))
                }
            }
        }  
        
        function addAudioOnLiItem(audioBlob){
            return function () {
                    const audioUrl = URL.createObjectURL(audioBlob)
                    const audio = new Audio(audioUrl)
                    audio.play()
                }
        }
    }
    
    window.onload = main
}
