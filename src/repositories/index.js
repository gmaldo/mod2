//import User from '../dao/classes/user.dao.js';
import { initializePersistence, UserDao, ProductDao, CartDao, TicketDao} from '../dao/factory.js'
import ProductRepository from './product.repository.js';
import UserRepository from './user.repository.js';
import CartRepository from './cart.repository.js';
import TicketRepository from './ticket.repository.js';
import ContactRepository from './contact.repository.js';

await initializePersistence();

export const userService  = new UserRepository(UserDao);
export const productService = new ProductRepository(ProductDao)
export const cartService = new CartRepository(CartDao)
export const ticketService = new TicketRepository(TicketDao)
export const contactService = new ContactRepository(UserDao)