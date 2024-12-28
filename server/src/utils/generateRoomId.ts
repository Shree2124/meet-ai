export const generateRoomId = ()=>{
    const characters: String = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let roomId:String = ''
    for (let i = 0; i < 10; i++) { // Adjust the length as needed
    const randomIndex = Math.floor(Math.random() * characters.length);
    roomId += characters[randomIndex];
  }
  return roomId;
}