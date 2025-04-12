export interface Profile {
  id: string;
  name: string;
  description?: string;
  instructions: Instruction[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Instruction {
  text: string;
}
