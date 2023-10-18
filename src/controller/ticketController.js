import TicketService from "../services/ticketService.js";
import TicketDTO from "../dao/dto/ticketDto.js";

class ticketController {
  constructor() {
    this.ticketService = new TicketService();
  }

  async createTicket(req) {
    try {
      const { error, value } = TicketDTO.validate(req.body);

      if (error) {
        logger.error('Invalid ticket data:', error.details);
        throw new Error("Invalid ticket data.");
      }

      const ticket = await this.ticketService.createTicket(value);

      return ticket;
    } catch (error) {
      logger.error('Error in creating the ticket:', error.message);
      throw error;
    }
  }
}

export default new ticketController();
