import { initializeApp } from "firebase/app";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  updateDoc,
  where,
  limit,
  addDoc,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Session } from "../types";
import { firebaseConfig } from "./config";

initializeApp(firebaseConfig);
const firestore = getFirestore();

export const COLLECTION = "sessions";

const getActiveSession = async (uid: string) => {
  const activeSessionQuery = query(
    collection(firestore, "sessions"),
    where("userId", "==", uid),
    where("finished", "==", false)
  );
  const activeSessionSnapshot = await getDocs(activeSessionQuery);

  if (activeSessionSnapshot.docs.length === 1) {
    return activeSessionSnapshot.docs[0].data();
  }

  if (activeSessionSnapshot.docs.length >= 1) {
    console.error("ERROR: More than one active session registered");
  }

  return null;
};

const getActiveSessionDocRef = async (uid: string) => {
  const activeSessionQuery = query(
    collection(firestore, COLLECTION),
    where("uid", "==", uid),
    where("finished", "==", false)
  );
  const activeSessionSnapshot = await getDocs(activeSessionQuery);

  if (activeSessionSnapshot.docs.length === 1)
    return activeSessionSnapshot.docs[0].ref;

  return null;
};

const newSession = async (uid: string) => {
  const dateNow = new Date();

  const session: Session = {
    endTime: dateNow,
    finished: false,
    startTime: dateNow,
    uid: uid,
  };

  await addDoc(collection(firestore, COLLECTION), session);
  return session;
};

const updateActiveSession = async (
  session: Session,
  uid: string,
  callback: any
) => {
  const docRef = await getActiveSessionDocRef(uid);

  if (docRef !== null) {
    try {
      await updateDoc(docRef, {
        finished: session.finished,
        endTime: session.endTime,
        startTime: session.startTime,
      });
      callback(session);
    } catch (e) {
      console.error("Error updating doc: ", e);
    }
  }
};

const getLastSessions = async (uid: string, noDays: number = 10) => {
  const sessions: any = [];

  const snapshot = await getDocs(
    query(
      collection(firestore, COLLECTION),
      where("uid", "==", uid),
      where("finished", "==", true),
      orderBy("startTime", "desc"),
      limit(noDays)
    )
  );

  snapshot.docs.forEach((d) => {
    const st = d.data().startTime.toDate();
    const startDate = `${st.getDate()}.${
      st.getMonth() + 1
    }.${st.getFullYear()}`;

    const startDateTime: Date = d.data().startTime.toDate();
    const endDateTime: Date = d.data().endTime.toDate();

    sessions.push({
      date: startDate,
      id: d.id,
      startTime: startDateTime,
      endTime: endDateTime,
      finished: d.data().finished,
      ...d.data(),
    });
  });

  return sessions;
};

const deleteSession = async (id: string) => {
  await deleteDoc(doc(firestore, COLLECTION, id));
};

const editSession = async (
  startTime: Date,
  endTime: Date,
  sessionId: string
) => {
  const ref = doc(firestore, "sessions", sessionId);

  try {
    await updateDoc(ref, {
      startTime: startTime,
      endTime: endTime,
    });
  } catch (e) {
    console.error("Error updating doc: ", e);
  }
};

const firebaseService = {
  deleteSession,
  getLastSessions,
  updateActiveSession,
  newSession,
  getActiveSessionDocRef,
  getActiveSession,
  editSession,
};

export default firebaseService;
