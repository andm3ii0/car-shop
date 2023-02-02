import { expect } from 'chai';
import sinon from 'sinon';
import { Model } from 'mongoose';
import { ObjectId } from 'bson';
import ICar from '../../../src/Interfaces/ICar';
import CarService from '../../../src/Services/CarService';
import Car from '../../../src/Domains/Car';
import cars from '../Mocks/CarMock';
import CarToBeUpdated from '../../../src/Types/CarTypes';

describe('Testa as funções da camada Services para Car', function () {
  it('É possivel cadastrar um novo carro com SUCESSO', async function () {
    // Arrange
    const carInput: ICar = {
      model: 'Marea',
      year: 2002,
      color: 'Black',
      status: true,
      buyValue: 15.99,
      doorsQty: 4,
      seatsQty: 5,
    };
    const carOutput: Car = new Car({
      model: 'Marea',
      year: 2002,
      color: 'Black',
      status: true,
      buyValue: 15.99,
      doorsQty: 4,
      seatsQty: 5,
      id: '63319d80feb9f483ee823ac5',
    });
    sinon.stub(Model, 'create').resolves(carOutput);

    // Act
    const service = new CarService();
    const result = await service.registerCar(carInput);

    // Assert
    expect(result).to.be.deep.equal(carOutput);
    sinon.restore();
  });
  it('Deveria lançar uma exceção quando não é passado algum campo obrigatório', async function () {
    // Arrange
    const carInput1 = {
      model: 'Marea',
      year: 2002,
      color: 'Black',
      status: true,
      buyValue: 15.99,
      seatsQty: 5,
    };
    const carInput2 = {
      model: 'Marea',
      year: 2002,
      color: 'Black',
      status: true,
      buyValue: 15.99,
      seatsQty: 5,
    };

    sinon.stub(Model, 'create').resolves({});
    // Act
    const service = new CarService();
    try {
      await service.registerCar(carInput1 as ICar);
    } catch (error) {
      expect(JSON.parse((error as Error).message)).to.be.equal({
        status: 400,
        message: 'Some fields are missing',
      });
    }

    try {
      await service.registerCar(carInput2 as ICar);
    } catch (error) {
      expect(JSON.parse((error as Error).message)).to.be.equal({
        status: 400,
        message: 'Some fields are missing',
      });
    }
    sinon.restore();
  });
  it('Recupera um carro pelo id', async function () {
    const carOutput: Car = new Car(cars[0]);

    sinon.stub(Model, 'findOne').resolves(carOutput);

    const service = new CarService();
    const car = await service.getCarById('63c359e49375e3a47459a92d');

    expect(car).to.be.deep.equal(carOutput);
    sinon.reset();
  });
  it('Recupera Todos os carros', async function () {
    const carsOutput: Car[] = cars.map((car) => {
      const createCars = (carObj: ICar) => new Car(carObj);
      return createCars(car);
    });
    const carOutput1: Car = new Car(cars[0]);
    const carOutput2: Car = new Car(cars[2]);
    const carOutput3: Car = new Car(cars[4]);

    sinon.stub(Model, 'find').resolves(carsOutput);

    const service = new CarService();
    const carsResult = await service.getCars();

    expect(JSON.stringify(carsResult)).include(JSON.stringify(carOutput1));
    expect(JSON.stringify(carsResult)).include(JSON.stringify(carOutput2));
    expect(JSON.stringify(carsResult)).include(JSON.stringify(carOutput3));
    sinon.restore();
  });
  it('Deve lançar um erro caso o id não esteja no banco', async function () {
    sinon.stub(Model, 'findOne').resolves({});

    try {
      const service = new CarService();
      await service.getCarById('63c359e49375e3a47459a92e');
    } catch (error) {
      expect(JSON.parse((error as Error).message).message).to.be.equal(
        'Car not found',
      );
    }

    sinon.restore();
  });
  it('Deve lançar um erro caso o id seja inválido', async function () {
    sinon.stub(Model, 'findOne').resolves(new Error('error'));

    try {
      const service = new CarService();
      await service.getCarById('63c359e49375e3a47459a92');
    } catch (error) {
      expect(JSON.parse((error as Error).message).message).to.be.equal(
        'Invalid mongo id',
      );
    }
    sinon.restore();
  });
  it('Deve atualizar um carro com sucesso', async function () {
    sinon.restore();
    const carUpdate: CarToBeUpdated = {
      id: '63c359e49375e3a47459a92d',
      buyValue: 100,
      color: 'yellow',
    };

    const oldCar = new Car(cars[0]);

    const carOutput: Car = new Car({
      id: '63c359e49375e3a47459a92d',
      model: 'Uno da Escada',
      year: 1960,
      color: 'yellow',
      status: false,
      buyValue: 100,
      doorsQty: 2,
      seatsQty: 2,
    });

    sinon.stub(Model, 'findOne').resolves(oldCar);
    sinon.stub(Model, 'findById').resolves(carOutput);
    sinon.stub(Model, 'updateOne').resolves({
      acknowledged: true,
      modifiedCount: 1,
      upsertedId: new ObjectId('63c359e49375e3a47459a92d'),
      upsertedCount: 0,
      matchedCount: 1,
    });

    const service = new CarService();
    const carUpdated = await service.updateCar(carUpdate);

    expect(carUpdated).to.be.deep.equal(carOutput);
  });
});
