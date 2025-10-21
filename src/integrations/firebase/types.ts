export interface User {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
}

export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: PollOption[];
  createdBy: string;
  createdAt: Date;
  expiresAt?: Date;
  isPublic: boolean;
  allowMultiple: boolean;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
}

export interface Vote {
  id: string;
  pollId: string;
  userId: string;
  optionIds: string[];
  votedAt: Date;
}