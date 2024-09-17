
import {Doctor,Patient} from "./UserManager"
let GLOBAL_ROOM_ID=0;
export interface Room{
patient:Patient;
doctor:Doctor;
}
export class RoomManager{
    private rooms:Map<string,Room>;
    constructor(){
        this.rooms= new Map<string,Room>();
    }
     
   
    createRoom(patient:Patient,doctor:Doctor){
        let roomId= this.generateRoomId().toString();
       this.rooms.set(roomId ,{patient,doctor});
       return roomId;
    }

   private generateRoomId(){
       return GLOBAL_ROOM_ID++;
    }
    getRommById(roomId:string){
       return this.rooms.get(roomId)
    }

}