import Car from '../Domains/Car';
import ICar from '../Interfaces/ICar';
import CarODM from '../Models/CarODM';
import CarToBeUpdated from '../Types/CarTypes';

class CarService {
  private createCarDomain(car: ICar | null) {
    if (car) {
      return new Car(car);
    }
    return null;
  }

  public async registerCar(car: ICar) {
    const carODM = new CarODM();
    try {
      const newCar = await carODM.create({
        ...car,
        status: car.status || false,
      });
      if (!newCar) {
        throw new Error(
          JSON.stringify({
            status: 400,
            message: 'Some fields are missing',
          }),
        );
      }
      return this.createCarDomain(newCar);
    } catch (error) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: 'Some fields are missing',
        }),
      );
    }
  }

  public async getCars() {
    const carODM = new CarODM();
    const cars = await carODM.getVehicle();

    return cars.map((car) => this.createCarDomain(car));
  }

  public async getCarById(id: string) {
    const carODM = new CarODM();
    let newCar: ICar | null;
    try {
      newCar = await carODM.getVehicleById(id);
    } catch (error) {
      throw new Error(
        JSON.stringify({ status: 422, message: 'Invalid mongo id' }),
      );
    }
    if (newCar) {
      return this.createCarDomain(newCar);
    }
    throw new Error(
      JSON.stringify({
        status: 404,
        message: 'Car not found',
      }),
    );
  }

  public async updateCar(car: CarToBeUpdated) {
    const carODM = new CarODM();
    const oldCar = await this.getCarById(car.id);

    if (oldCar) {
      const carUpdate = {
        model: oldCar.getModel(),
        year: oldCar.getYear(),
        color: oldCar.getColor(),
        status: oldCar.getStatus(),
        buyValue: oldCar.getBuyValue(),
        doorsQty: oldCar.getDoorsQty(),
        seatsQty: oldCar.getSeatsQty(),
        ...car,
      };

      await carODM.updateVehicle(carUpdate.id, carUpdate);
      const newCar = (await carODM.getById(car.id)) as unknown as ICar;
      return this.createCarDomain(newCar);
    }
  }
}

export default CarService;
