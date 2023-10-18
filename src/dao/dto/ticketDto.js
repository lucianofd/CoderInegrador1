import Joi from 'joi'; 

// Define DTO for creating a ticket
const TicketDTO = Joi.object({
  code: Joi.string().required(),
  purchase_datetime: Joi.date().iso().required(),
  amount: Joi.number().positive().required(),
  purchaser: Joi.string().required(),
});

export default TicketDTO;
