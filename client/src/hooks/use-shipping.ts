import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export type ShippingRates = Record<string, number>; // Wilaya Name -> Price in Cents

const SETTINGS_DOC_PATH = "settings/shipping";

export function useShippingRates() {
  return useQuery({
    queryKey: ["shipping-rates"],
    queryFn: async () => {
      const docRef = doc(db, SETTINGS_DOC_PATH);
      const snap = await getDoc(docRef);
      if (!snap.exists()) {
        return {} as ShippingRates;
      }
      return snap.data() as ShippingRates;
    },
  });
}

export function useUpdateShippingRates() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (rates: ShippingRates) => {
      const docRef = doc(db, SETTINGS_DOC_PATH);
      await setDoc(docRef, rates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shipping-rates"] });
    },
  });
}
