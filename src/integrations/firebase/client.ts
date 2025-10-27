import type{ FirestoreDataConverter } from "firebase/firestore";
import type { Poll } from "./types";

export const pollConverter: FirestoreDataConverter<Poll> = {
  toFirestore(poll: Poll) {
    return poll;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options)!;
    return { id: snapshot.id, ...data } as Poll;
  },
};
