import { faker } from '@faker-js/faker/locale/it';

export const restaurant = {
  name: faker.company.name(),
  address: faker.address.streetAddress(),
  city: faker.address.city(),
  zipCode: faker.address.zipCode(),
  telephone: faker.phone.number(),
  website: faker.internet.url().replace('https://', '').replace('http://', ''),
  email: faker.internet.email(),
};

export const channels = {
  google: `maps.google.com/?cid=16762488484112003401`,
  thefork: `www.thefork.it/ristorante/pizza-social-lab-r580269`,
  tripadvisor: `www.tripadvisor.com/Restaurant_Review-g187785-d19701014-Reviews-Pizza_Social_Lab-Naples_Province_of_Naples_Campania.html`,
};

export const user = {
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
  email: faker.internet.email(),
};

export const userToEdit = {
  name: faker.name.firstName(),
  surname: faker.name.lastName(),
};

export const category = {
  name: faker.lorem.word(),
};

export const categoryToEdit = {
  name: faker.lorem.word(),
};

export const dish = {
  name: faker.lorem.word(),
  descrtiption: faker.lorem.sentence(),
  price: faker.number.int({ min: 10, max: 100 }),
};

export const dishToEdit = {
  name: faker.lorem.word(),
  descrtiption: faker.lorem.sentence(),
  price: faker.number.int({ min: 10, max: 100 }),
};
