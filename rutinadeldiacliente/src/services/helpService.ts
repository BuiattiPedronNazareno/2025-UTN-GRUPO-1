import api from "./api"; 

export async function sendHelp(infanteId: number, routineId?: number) {
  
  return api.post("/telegram/send-help-detailed", { 
    infanteId,
    routineId: routineId || 0,
  });
  
}