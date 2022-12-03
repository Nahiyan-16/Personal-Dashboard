document.body.style.visibility = 'hidden'
setTimeout(()=>{
    document.body.style.visibility = 'visible'
},1350)

fetch("https://api.unsplash.com/photos/random?query=nature&client_id=P1Qo9LPylsLT9IsyEINd-LFdSTeENYO4x9olDXp7zfM")
    .then(res => res.json())
    .then(data => {
        document.body.style.backgroundImage = `url(${data.urls.raw})`
		document.getElementById("author").textContent = `By: ${data.user.name}`
    })
    .catch(err => {
        document.body.style.backgroundImage = `url(https://images.unsplash.com/photo-1560008511-11c63416e52d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyMTEwMjl8MHwxfHJhbmRvbXx8fHx8fHx8fDE2MjI4NDIxMTc&ixlib=rb-1.2.1&q=80&w=1080
)`
		document.getElementById("author").textContent = `By: Dodi Achmad`
    })

function getCurrentTime() {
    const date = new Date()
    document.getElementById("time").textContent = date.toLocaleTimeString("en-us", {timeStyle: "short"})
}

setInterval(getCurrentTime, 1000)

navigator.geolocation.getCurrentPosition(position => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${position.coords.latitude}&lon=${position.coords.longitude}&units=imperial&appid=b830e75d72318fd97b6d704b35cdd4ff`)
        .then(res => {
            if (!res.ok) {
                throw Error("Weather data not available")
            }
            return res.json()
        })
        .then(data => {
            const iconUrl = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
            document.getElementById("weather").innerHTML = `
                <img src=${iconUrl} />
                <p class="weather-temp">${Math.round(data.main.temp)}º</p>
                <p class="weather-city">${data.name}</p>
            `
        })
        .catch(err => console.error(err))
});

const addLinkContainer = document.getElementsByClassName('addLink')[0]
const addLinkBtn = document.getElementById('addLinkBtn')
const addFormBtn = document.getElementById('addFormBtn')
const allLinksContainer = document.getElementById('allLinks')
const removeLinkBtn = document.getElementById('removeLinkBtn')
const removeLinkEl = document.getElementsByClassName('removeLink')

if(!localStorage.getItem('linksCapacity')){
    localStorage.setItem('linksCapacity', 0)
}
let capacity = localStorage.getItem('linksCapacity')

const toggleAddContainer = ()=>{
    addLinkContainer.classList.toggle('displayNone')
}

toggleAddContainer()

addLinkBtn.addEventListener('click', toggleAddContainer)


addFormBtn.addEventListener('click', ()=>{
    let Title = document.getElementById('formTitle')
    let URL = document.getElementById('formURL')

    if(Title.value && URL.value && capacity < 18){
        capacity++
        localStorage.setItem('linksCapacity', capacity)
        let links = [[Title.value, URL.value]]
        if(localStorage.myLinks){
            const storedLinks = JSON.parse(localStorage.myLinks)
            storedLinks.push([Title.value, URL.value])
            localStorage.myLinks = JSON.stringify(storedLinks)
        }
        else{
            localStorage.myLinks = JSON.stringify(links)
        }
        renderLinks()
    } 
    Title.value = ''
    URL.value = ''
    toggleAddContainer()
})

function renderLinks(){
    if(localStorage.myLinks){
        const storedLinks = JSON.parse(localStorage.myLinks)
        let html = ''
        storedLinks.forEach(e => {
            html += `
                <div class="links">
                    <button type='button' class="removeLink displayNone">−</button>
                    <a href='https://${e[1]}'>${e[0]}</a>
                </div>
            `
        })
        allLinksContainer.innerHTML = html
    }
}

document.body.addEventListener('click', e=>{
    if(e.target)if(e.target.nextSibling)if(e.target.nextSibling.nextSibling)if(e.target.nextSibling.nextSibling.firstChild){
        deleteLink(e.target.nextSibling.nextSibling.firstChild.textContent)
    }
    
})

function deleteLink(e){
    if(localStorage.getItem('linksCapacity')){
        let storedLinks = JSON.parse(localStorage.myLinks)
        let ary = []
        storedLinks.forEach(element=>{
            if(element[0] !== e){
                ary.push(element)
            }
            else{
                capacity--
                localStorage.setItem('linksCapacity', capacity)
            }
        })
        localStorage.myLinks = JSON.stringify(ary)
        renderLinks()
    }
}

removeLinkBtn.addEventListener('click', ()=>{
    document.querySelectorAll(".removeLink").forEach(e=>{
        e.classList.toggle('displayNone')
    })
})

document.getElementById('getShowName').addEventListener('keypress', e => {
    if(e.key === 'Enter'){
        localStorage.setItem('name', document.getElementById('getShowName').value)
        renderName()
    }
})

function renderName(){
    if(localStorage.getItem('name')){
        let name = localStorage.getItem('name')
        fetch('https://www.greetingsapi.com/random')
        .then(res=>res.json())
        .then(data=>{
            document.getElementById('showName').innerHTML = `
            <h2>${data.greeting}, ${name}</h2>
            <p>(${data.language})</p>
            `
        })

    }
}

renderName()
renderLinks()


