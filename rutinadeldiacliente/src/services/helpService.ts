import api from "./api"; 

export async function sendHelp(userId: number, routineId?: number, infanteId?: number) {
  
  return api.post("/telegram/send-help-detailed", { 
    userId,
    routineId: routineId || null,
    infanteId
  });
  
}