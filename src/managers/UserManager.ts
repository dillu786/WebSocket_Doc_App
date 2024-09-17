import { WebSocket } from "ws";
export interface Patient{
    name:string,
    patientSocket:WebSocket
}
export interface Doctor{
    name:string;
    doctorSocket:WebSocket;
    isOnline:boolean;
    isOnCall:boolean;
}
export class DoctorManager{
   private doctors:Doctor[];
    constructor(){
       this.doctors= [];
    }

    addDoctor(doctor:Doctor){
       this.doctors.push(doctor);
    }
    getDoctor(name:string){
       return this.doctors.find(a=>a.name===name);
    }
    updateDoctor(doctor:Doctor){
        let index=this.doctors.findIndex(a=>a.name===doctor.name);
        this.doctors.splice(1,1);
        this.doctors.push(doctor);
    }
    getAllDoctors(){
        return this.doctors;
    }
}

export class PatientManager{
  private  users:Patient[];
    constructor(){
     this.users=[];
    }
    addPatient(patient:Patient){
        this.users.push(patient);
    }
    getPaient(name:string){
        return this.users.find(a=>a.name==name);
    }

}