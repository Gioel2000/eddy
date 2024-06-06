import { randomNumber, randomString } from './functions';

export const restaurant = {
  name: `Ristorante ${randomString(5)}`,
  address: randomString(10),
  city: randomString(8),
  zipCode: randomNumber(5),
  telephone: randomNumber(11),
  website: `www.${randomString(10)}.com`,
  email: `${randomString(10)}@email.com`,
};

export const channels = {
  google: `maps.google.com/?cid=16762488484112003401`,
  thefork: `www.thefork.it/ristorante/pizza-social-lab-r580269`,
  tripadvisor: `www.tripadvisor.com/Restaurant_Review-g187785-d19701014-Reviews-Pizza_Social_Lab-Naples_Province_of_Naples_Campania.html`,
};

export const user = {
  name: randomString(5),
  surname: randomString(5),
  email: `${randomString(5)}@gmail.com`,
};

export const userToEdit = {
  name: randomString(5),
  surname: randomString(5),
};
