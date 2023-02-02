import Motorcycle from '../Domains/Motorcycle';
import IMotorcycle from '../Interfaces/IMotorcycle';
import MotorcycleODM from '../Models/MotorcycleODM';

class MotorcycleService {
  private createCarDomain(motorcycle: IMotorcycle) {
    return new Motorcycle(motorcycle);
  }

  public async registerMotorcycle(motorcycle: IMotorcycle) {
    const motorcycleODM = new MotorcycleODM();
    const newMotorcycle = await motorcycleODM.create({
      ...motorcycle,
      status: motorcycle.status || false,
    });
    if (!newMotorcycle) {
      throw new Error(
        JSON.stringify({
          status: 400,
          message: 'Some fields are missing',
        }),
      );
    }
    return this.createCarDomain(newMotorcycle);
  }
}

export default MotorcycleService;
