import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AUTH_SETTINGS_ID = "auth";

export function useAdminAuth() {
  return useQuery({
    queryKey: ["adminAuthSettings"],
    queryFn: async () => {
      const docRef = doc(db, "settings", AUTH_SETTINGS_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as { password?: string };
      }
      return { password: "SHARKSKY" }; // Default password
    },
  });
}

export function useUpdateAdminPassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (password: string) => {
      const docRef = doc(db, "settings", AUTH_SETTINGS_ID);
      await setDoc(docRef, { password }, { merge: true });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminAuthSettings"] });
    },
  });
}
