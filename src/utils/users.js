const users = []

//addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room })=>{
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(!username || !room){
        return {
            error: 'Username and Room are required!'
        }
    }

    //Check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //Validate username
    if(existingUser || username === 'admin-prahlad'){
        return {
            error: 'This Username is already in use. Try different one!'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id)=>{
    const index = users.findIndex((user)=> user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = (id)=>{
    const user = users.find((user)=> user.id === id)

    if(!user){
        return undefined
    }
    return user
}

const getUsersInRoom = ( room )=>{
    room = room.trim().toLowerCase()
    const usersInTheRoom = users.filter((user)=> user.room === room)
    return usersInTheRoom
}


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}