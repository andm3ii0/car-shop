import ICar from '../Interfaces/ICar';

class Car {
  protected id: string | undefined;
  protected model: string;
  protected year: number;
  protected color: string;
  protected status: boolean;
  protected buyValue: number;
  private doorsQty: number;
  private seatsQty: number;

  constructor(car: ICar) {
    this.id = car.id;
    this.model = car.model;
    this.year = car.year;
    this.color = car.color;
    this.status = car.status || false;
    this.buyValue = car.buyValue;
    this.doorsQty = car.doorsQty;
    this.seatsQty = car.seatsQty;
  }

  public getId(): string | undefined {
    return this.id;
  }

  public getModel(): string {
    return this.model;
  }
  public getYear(): number {
    return this.year;
  }
  public getColor(): string {
    return this.color;
  }
  public getStatus(): boolean {
    return this.status;
  }
  public getBuyValue(): number {
    return this.buyValue;
  }
  public getDoorsQty(): number {
    return this.doorsQty;
  }
  public getSeatsQty(): number {
    return this.seatsQty;
  }
}

export default Car;
