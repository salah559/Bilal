import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  collection, 
  getDocs, 
  doc, 
  addDoc,
  updateDoc,
  deleteDoc,
  query, 
  orderBy,
  serverTimestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  status: "unread" | "read";
  createdAt: any;
}

export function useMessages() {
  return useQuery({
    queryKey: ["/api/messages"],
    queryFn: async () => {
      const q = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc")
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ContactMessage[];
    },
  });
}

export function useCreateMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageData: Omit<ContactMessage, "id" | "createdAt" | "status">) => {
      const docRef = await addDoc(collection(db, "messages"), {
        ...messageData,
        status: "unread",
        createdAt: serverTimestamp(),
      });
      return docRef.id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });
}

export function useUpdateMessageStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: "unread" | "read" }) => {
      const docRef = doc(db, "messages", id);
      await updateDoc(docRef, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await deleteDoc(doc(db, "messages", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
  });
}
