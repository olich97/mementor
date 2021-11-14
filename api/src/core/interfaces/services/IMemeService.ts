import { CreateMemeInput } from './models/CreateMemeInput';
import { MemeOutput } from './models/MemeOutput';
import { UpdateMemeInput } from './models/UpdateMemeInput';

export interface IMemeService {
  list(skip: number, limit: number): Promise<MemeOutput[]>;
  create(input: CreateMemeInput): Promise<MemeOutput>;
  //update(id: string, input: UpdateMemeInput): Promise<void>;
  //publish(id: string): Promise<void>;
  searchByText(skip: number, limit: number, text: string): Promise<MemeOutput[]>;
}
