import { RoomManager } from "./managers/RoomManager";
import { Doctor, DoctorManager,PatientManager } from "./managers/UserManager";
import {WebSocket,WebSocketServer} from "ws";

const doctorObj=new DoctorManager();
const patientObj=new PatientManager();
const roomOBj=new RoomManager();
const wss =new WebSocketServer({port:8080});
let doctorsOnCall:[Pick<Doctor,"name">];
let doctosOnline=doctorObj.getAllDoctors();

wss.on("connection",(ws:WebSocket)=>{
    ws.on("message",(data:any)=>{
        const message=JSON.parse(data);
        if(message.type==="doctor"){
            let doctor=doctorObj.getDoctor(message.name);
            if(doctor)return;
            doctorObj.addDoctor({doctorSocket:ws,name:message.name,isOnline:true,isOnCall:false});
        }
        if(message.type==="patient"){
            let patient= patientObj.getPaient(message.name)
            if(patient)return;
            patientObj.addPatient({patientSocket:ws,name:message.name})
            ws.send(JSON.stringify({doctosOnline}))
            
        }
        else if(message.type==="createOffer"){
            let patient=patientObj.getPaient(message.name);
            let doctor=doctorObj.getDoctor(message.doctorName);
            if(patient && doctor && ws==patient.patientSocket && !doctor.isOnCall){
              const roomId= roomOBj.createRoom(patient,doctor);
              doctor.doctorSocket.send(JSON.stringify({type:"createOffer",roomId:roomId}))
            }
            if(patient && doctor && ws==doctor.doctorSocket){
                const roomId= roomOBj.createRoom(patient,doctor);
                patient.patientSocket.send(JSON.stringify({type:"createOffer",roomId:roomId}))
              }
        }
        else if(message.type==="createAnswer"){
                let room=  roomOBj.getRommById(message.roomId);
                if(room?.doctor.doctorSocket===ws){
                    room.patient.patientSocket.send(JSON.stringify({type:"createAnswer",roomId:message.roomId}))
                }
                else if(room?.patient.patientSocket===ws){
                    room.doctor.doctorSocket.send(JSON.stringify({type:"createAnswer",roomId:message.roomId}))
                }
           }
        else if(message.type==="iceCandidate"){
            let room=  roomOBj.getRommById(message.roomId);
            if(room?.doctor.doctorSocket===ws){
                
                room.patient.patientSocket.send(JSON.stringify({type:"iceCandidate",candidate:message.candidate,roomId:message.roomId}))
                let doctor=room.doctor;
                doctor.isOnline=true;
                doctorObj.updateDoctor(doctor);
                doctorsOnCall.push({name:doctor.name});
            }
            else if(room?.patient.patientSocket===ws){
                room.doctor.doctorSocket.send(JSON.stringify({type:"iceCandidate",candidate:message.candidate,roomId:message.roomId}))
            }
        }   

    })
});

