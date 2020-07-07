module.exports = ()=> { 
    navigator.mediaDevices.getUserMedia({audio: true})
         .then(stream => {
            const mediaRecorder = new MediaRecorder(stream)
            let voice = [] 
            let rec = false
            const io = require('socket.io-client')
            const socket = io.connect('https://voicy-speaker.herokuapp.com/',{reconnection: true})
            const control = document.querySelectorAll('.control_button')
            const info = document.querySelector('.info')
            const SPEAKER_INFO = 'Active: speaker-mode'
            const STREAM_INFO = 'Active: stream-mode'
            const DEFAULT_INFO = 'Chose a mode'

            socket.on('connect', socket =>{
                console.log('Connected')
               
            })
            
            socket.on('user', data =>{
                console.log(data);
            })
            
            socket.on('audioMessage', data =>{
                console.log(data);
            })

            for(let i = 0; i < control.length; i++){
                control[i].addEventListener('click', ()=>{
                    if(control[i].className === 'control_button enabled'){
                        control[i].className = 'control_button disabled'
                        info.innerHTML = DEFAULT_INFO
                        offRec(rec)
                    }
                    else{  
                        control.forEach(el=>{
                            el.className = 'control_button disabled'
                        })
                        control[i].className = 'control_button enabled'
                        switch(i){
                            case 0:
                                offRec(rec)
                                getAllVoices()
                                break
                            case 1:
                                info.innerHTML = SPEAKER_INFO
                                mediaRecorder.start()
                                rec = true
                                mediaRecorder.addEventListener('dataavailable', e =>{
                                    voice.push(e.data)
                                })
                                break
                            case 2:
                                offRec(rec)
                                info.innerHTML = STREAM_INFO
                                console.log(voice)
                                break
                        }
                    }
                })
            }
        
        function offRec(rc){
            if(rc === true){
                mediaRecorder.stop()
                socket.emit('audioMessage', voice[0])
                voice = []
                rec = false
            }
        }

        async function getAllVoices(){
            const info = document.querySelector('.info')
            info.innerHTML = ''
            const ul = document.createElement('ul')
            info.appendChild(ul)
            const response = await fetch('https://voicy-speaker.herokuapp.com/voices')
            const data = await response.json()
            console.log(data)
            for(let i = 0; i < data.length; i++){
                const li = document.createElement('li')
                const audioBlob = data[i].audioBlob
                li.innerHTML = `Voice: ${data[i].timeStamp.slice(0, -38)}`
                ul.appendChild(li)
                li.addEventListener('click', ()=>{
                    const audioUrl = URL.createObjectURL(audioBlob)
                    const audio = new Audio(audioUrl)
                    audio.play()
                })
            }
        }
    })

}

