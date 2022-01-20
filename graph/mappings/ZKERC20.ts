import {
  CreateNote,
  DestroyNote,
} from '../types/templates/ZKERC20/ZKERC20';
import {
  Note,
  User,
} from '../types/schema';

export function createNote(event: CreateNote): void {
  let noteId = event.params.noteHash.toHex();
  let metadata = event.params.metadata;
  let ownerAddress = event.params.owner;
  let ownerId = ownerAddress.toHex();
  let note = new Note(noteId);
  note.ownerAddress = ownerAddress;
  note.currencyAddress = event.address;
  note.metadata = metadata;
  note.status = 'CREATED';
  note.time = event.block.timestamp;
  note.save();

 
  let user = User.load(ownerId);
  if (user == null) {
    user = new User(ownerId);
    user.address = ownerAddress;
  }
  let prevBalance = user.balance;
  user.balance = prevBalance.concat([noteId]);
  user.save();
}

export function destroyNote(event: DestroyNote): void {
  let noteId = event.params.noteHash.toHex();
  let note = Note.load(noteId);
  note.status = 'DESTROYED';
  note.save();
}
