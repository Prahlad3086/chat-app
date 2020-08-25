const socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $message = document.querySelector('#msg')
const $send = document.querySelector('#send') 
const $sendLocation = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = ()=>{
    //New message element
    const $newMessage = $messages.lastElementChild

    //height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    //visible height
    const visibleHeight = $messages.offsetHeight

    //height of messages container
    const containerHeight = $messages.scrollHeight

    //How far have I scrolled
    const scrollOffset = $messages.scrollTop + visibleHeight

    if(containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message', (message)=>{
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a')
    })  //html of messahe-template
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('locationMessage', (location)=>{
    console.log(location)
    const html = Mustache.render(locationMessageTemplate, {
        username: location.username,
        url: location.url,
        createdAt: moment(location.createdAt).format('hh:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({ room, users })=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit', (e)=>{
    e.preventDefault()
    //disable the send-meassage button
    $send.setAttribute('disabled', 'disabled')

    const message = $message.value
    socket.emit('sendMessage', message, (error)=>{
        //Acknowledgement Callback section
        //enabling the send button
        
        $send.removeAttribute('disabled')
        $message.value = ''
        $message.focus()

        if(error){
            return console.log(error)
        }

        console.log('Message Delivered!')
    })
})

$sendLocation.addEventListener('click', ()=>{
    if(!navigator.geolocation){
        return alert('GeoLocation is not Supported by your browser.')
    }
    //disabling the send-location button
    $sendLocation.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', { latitude: position.coords.latitude, longitude: position.coords.longitude}, ()=>{
            //Acknowledgement Callback section
            //Enabling the send-Location button
            $sendLocation.removeAttribute('disabled')

            console.log('Location Shared!')
        })
    })
})

socket.emit('join', { username, room }, (error)=>{
    if(error){
        alert(error)
        location.href = '/' 
    }
})