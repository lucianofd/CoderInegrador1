import ticketModel  from "../models/ticket.model.js";

class TicketService {
  async createTicket(data) {
    console.log("Datos del ticket antes de crear:", data);

    if (
      !data.code ||
      !data.purchase_datetime ||
      !data.amount ||
      !data.purchaser
    ) {
      console.error("Datos incompletos:", data);
      throw new Error("No se puede crear ticket.");
    }

    const ticket = new ticketModel(data);
    await ticket.save();
    console.log("Ticket creado:", ticket);
    return ticket;
  }
}

export default TicketService;