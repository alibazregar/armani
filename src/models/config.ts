import mongoose, { Document, Schema } from 'mongoose';

export interface IConfig extends Document {
  key: string;
  value: number;
}

const configSchema = new Schema<IConfig>(
  {
    key: { type: String, required: true, unique: true },
    value: { type: Number, required: true },
  },
  { timestamps: true }
);

const Config = mongoose.model<IConfig>('Config', configSchema);
export async function getConfigValueByKey(key: string): Promise<number> {
    try {
      const configEntry = await Config.findOne({ key });
      if(!configEntry) {
        throw new Error("the config for" + key + " is not found")
      }
      return configEntry.value
    } catch (error: any) {
      throw new Error(`Error retrieving config value: ${error.message}`);
    }
  }
  
  export async function setConfigValueByKey(key: string, value: string): Promise<void> {
    try {
      // Update the existing entry if the key exists, otherwise create a new entry
      await Config.updateOne({ key }, { $set: { value } }, { upsert: true });
    } catch (error : any) {
      throw new Error(`Error setting config value: ${error.message}`);
    }
  }