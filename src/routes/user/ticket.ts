import express, { Request, Response } from "express";
import User from "../../models/user";
import { Ticket } from "../../models/ticket";
import { isAdmin } from "../../middleware/checkLogin";
const ticketRouter = express.Router();

ticketRouter.post("/", async (req: Request, res: Response) => {
  try {
    //@ts-ignore
    const userId = req.user._id;
    const newTicket = new Ticket({
      user: userId,
      title: req.body.title,
      description: req.body.description,
    });
    await newTicket.save();
    res.status(201).json({ message: "Ticket added successfully" });
  } catch (error) {
    console.error("Error adding ticket:", error);
    res
      .status(500)
      .json({ error: "An error occurred while adding the ticket" });
  }
});
ticketRouter.get("/user/tickets", async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized" });
    }
    //@ts-ignore
    const userId = req?.user._id;
    const userTickets = await Ticket.find({ user: userId });
    res.status(200).json(userTickets);
  } catch (error) {
    console.error("Error fetching user tickets:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching user tickets" });
  }
});
ticketRouter.post("/tickets/:ticketId/respond",isAdmin ,async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.ticketId;
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    const { message } = req.body; ;
    ticket.response = {
      message: message,
      createdAt: new Date(),
    };
    await ticket.save();
    res.status(200).json({ message: "Response added successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error responding to ticket:", error);
    res
      .status(500)
      .json({ error: "An error occurred while responding to the ticket" });
  }
});
ticketRouter.get('/tickets',isAdmin, async (req: Request, res: Response) => {
  try {
    let query: any = {};
    if (req.query.userId) {
      query.user = req.query.userId;
    }
    if (req.query.hasResponse) {
      if (req.query.hasResponse === 'true') {
        query.response = { $exists: true };
      } else if (req.query.hasResponse === 'false') {
        query.response = { $exists: false };
      }
    }
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortByCreatedAt = req.query.sortByCreatedAt === 'true';
    let ticketsQuery = Ticket.find(query);
    if (sortByCreatedAt) {
      ticketsQuery = ticketsQuery.sort({ createdAt: sortOrder });
    }
    const tickets = await ticketsQuery.exec();
    res.status(200).json(tickets);
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).json({ error: 'An error occurred while fetching tickets' });
  }
});
ticketRouter.get('/tickets/:ticketId',isAdmin, async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.ticketId;

    // Find the ticket by ID
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Respond with the ticket
    res.status(200).json(ticket);
  } catch (error) {
    // Handle errors
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'An error occurred while fetching the ticket' });
  }
});
ticketRouter.get('/my-tickets/:ticketId',isAdmin, async (req: Request, res: Response) => {
  try {
    const ticketId = req.params.ticketId;

    // Find the ticket by ID
    const ticket = await Ticket.findOne({ticketId});

    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // Respond with the ticket
    res.status(200).json(ticket);
  } catch (error) {
    // Handle errors
    console.error('Error fetching ticket:', error);
    res.status(500).json({ error: 'An error occurred while fetching the ticket' });
  }
});
export default ticketRouter;
