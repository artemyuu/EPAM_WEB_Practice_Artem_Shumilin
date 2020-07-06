module.exports = ()=> { 
    const control = document.querySelectorAll('.control_button')
    const info = document.querySelector('.info')
    const SPEAKERINFO = 'Active: speaker-mode'
    const STREAMINFO = 'Active: stream-mode'
    const DEFAULTINFO = 'Chose a mode'

    
    for(let i = 0; i < control.length; i++){
        control[i].addEventListener('click', ()=>{
            if(control[i].className === 'control_button enabled'){
                control[i].className = 'control_button disabled'
                info.innerHTML = DEFAULTINFO
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
                        info.innerHTML = SPEAKERINFO
                        break
                    case 2:
                        info.innerHTML = STREAMINFO
                        break
                }
            }
        })
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