import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface GlobalSettings {
  phone: string;
  email: string;
  hours: string;
  address: string;
  mapIframeUrl: string;
  facebookUrl: string;
}

const SETTINGS_DOC_ID = "global";

const defaultSettings: GlobalSettings = {
  phone: "+213 555 123 456",
  email: "contact@bilel.com",
  hours: "Sam - Jeu: 8h - 18h",
  address: "123 Rue de l'Industrie, Alger",
  mapIframeUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.669866838384!2d3.0560!3d36.7525!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2f76785055b%3A0x2863584852089!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2sus!4v1645564852154!5m2!1sen!2sus",
  facebookUrl: "https://facebook.com",
};

export function useSettings() {
  return useQuery({
    queryKey: ["/api/settings/global"],
    queryFn: async () => {
      const docRef = doc(db, "settings", SETTINGS_DOC_ID);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data() as GlobalSettings;
      }
      return defaultSettings;
    },
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (newSettings: GlobalSettings) => {
      const docRef = doc(db, "settings", SETTINGS_DOC_ID);
      await setDoc(docRef, newSettings, { merge: true });
      return newSettings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/settings/global"] });
    },
  });
}
