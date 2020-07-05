module.exports = ()=> { 
    const control = document.querySelectorAll('.control_button')
    const info = document.querySelector('.info')
    const SPEAKERINFO = 'Active: speaker-mode'
    const ALLVOICEINFO = 'Active: all voices-mode'
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
                        info.innerHTML = ALLVOICEINFO
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
