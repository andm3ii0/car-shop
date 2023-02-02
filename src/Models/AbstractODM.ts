import { UpdateResult } from 'mongodb';
import { Model, Schema, model, models } from 'mongoose';

abstract class MotorcycleODM<T> {
  private schema: Schema;
  private model: Model<T>;

  constructor(schema: Schema, modelName: string) {
    this.schema = schema;
    this.model = models[modelName] || model(modelName, this.schema);
  }

  public async create(vehicle: T): Promise<T> {
    return this.model.create(vehicle);
  }

  public async getVehicle(): Promise<T[]> {
    return this.model.find();
  }

  public async getVehicleById(id: string): Promise<T | null> {
    return this.model.findOne({ _id: id });
  }

  public async getById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  public async updateVehicle(id: string, vehicle: Partial<T>): Promise<UpdateResult> {
    return this.model.updateOne({ id }, vehicle);
  }
}

export default MotorcycleODM;
