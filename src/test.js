const io = require('socket.io-client')
const socket = io.connect('https://voicy-speaker.herokuapp.com/',{reconnection: true})
let streamMode = false

socket.on('audioMessage', data =>{
    if(streamMode === true){
        const audioBlob = new Blob(data)
        const audioUrl = URL.createObjectURL(audioBlob)
        const audio = new Audio(audioUrl)
        audio.play()
    }
})

function main(){
    const mods = ['Chose a mode', 'Speaker-mode', 'Stream-mode']
    const info = document.querySelector('.info')
    const control = document.querySelectorAll('.disabled')

    for(let i = 0; i < control.length; i++){    
            control[i].addEventListener('click', (e)=>{
                if(control[i].className === 'control_button enabled'){
                    control[i].className = 'control_button disabled'
                    info.innerHTML = mods[0]
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
                            microphone()
                            info.innerHTML = `Active:${mods[1]}`
                            break
                        case 2:
                            info.innerHTML = `Active:${mods[2]}`
                            streamMode = true
                    }
                }
            })
        }
    }


function microphone(){
    streamMode = false
    navigator.mediaDevices.getUserMedia({audio: true})
        .then(stream => {
            const pause = document.querySelector('.pause')
            const mediaRecorder = new MediaRecorder(stream)
            let voice = []
            mediaRecorder.start()
            pause.style.display = 'block'
            mediaRecorder.addEventListener('dataavailable', e =>{
                voice.push(e.data)
            })
            pause.addEventListener('click', ()=>{
                mediaRecorder.stop()
                pause.style.display = 'none'
            })

            mediaRecorder.addEventListener('stop', ()=>{
                let buf = []
                buf.push(voice[0])
                socket.emit('audioMessage', buf)
            })
        }).catch(()=>{
            const info = document.querySelector('.info')
            info.innerHTML = 'Allow access to the microphone'
        })
}

async function getAllVoices(){
    streamMode = false
    const info = document.querySelector('.info')
    info.innerHTML = ''
    const ul = document.createElement('ul')
    info.appendChild(ul)
    const response = await fetch('https://voicy-speaker.herokuapp.com/voices')
    const data = await response.json()
    for(let i = 0; i < data.length; i++){
        const li = document.createElement('li')
        if((Array.isArray(data[i].audioBlob) === true)){
            if((data[i].audioBlob.length != 0 && data[i].audioBlob[0] != null)){
                const audioBlob = new Blob([new Uint8Array(data[i].audioBlob[0].data).buffer])
                li.innerHTML = `Voice: ${data[i].timeStamp.slice(0, -38)}`
                li.className = 'li-item'
                ul.appendChild(li)
                li.addEventListener('click', e =>{
                        const audioUrl = URL.createObjectURL(audioBlob)
                        const audio = new Audio(audioUrl)
                        audio.play()
                })
                // ul.addEventListener('click', e => {
                //     if(e.target.classList.contains('li-item')){
                //         const audioUrl = URL.createObjectURL(audioBlob)
                //         const audio = new Audio(audioUrl)
                //         audio.play()
                //     }
                // })
            }
        }
    }
}

window.onload = main()