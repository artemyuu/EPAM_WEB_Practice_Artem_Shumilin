import './styles/style.scss'

const control = document.querySelectorAll('.control_button')
const info = document.querySelector('.info')

for(let i = 0; i < control.length; i++){
    control[i].addEventListener('click', ()=>{
        if(control[i].className === 'control_button enabled'){
            control[i].className = 'control_button disabled'
            info.innerHTML = 'Chose a mode'
        }
        else{  
            control.forEach(el=>{
                el.className = 'control_button disabled'
            })
            control[i].className = 'control_button enabled'
            switch(i){
                case 0:
                    info.innerHTML = 'Active: all voices-mode'
                    break
                case 1:
                    info.innerHTML = 'Active: speaker-mode'
                    break
                case 2:
                    info.innerHTML = 'Active: stream-mode'
                    break
            }
        }
    })
}
