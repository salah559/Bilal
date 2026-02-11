import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  addDoc, 
  query, 
  where, 
  limit 
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  isFeatured: boolean;
  specifications: Record<string, any>;
  profession?: string;
}

export function useFirebaseProducts(filters?: { category?: string; profession?: string; featured?: boolean; search?: string }) {
  return useQuery({
    queryKey: ["firebase-products", filters],
    queryFn: async () => {
      const productsRef = collection(db, "products");
      let q = query(productsRef);

      if (filters?.category) {
        q = query(q, where("category", "==", filters.category));
      }
      if (filters?.profession) {
        q = query(q, where("profession", "==", filters.profession));
      }
      if (filters?.featured) {
        q = query(q, where("isFeatured", "==", true));
      }

      const querySnapshot = await getDocs(q);
      const products = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];

      if (filters?.search) {
        const searchLower = filters.search.toLowerCase();
        return products.filter(p => 
          p.name.toLowerCase().includes(searchLower) || 
          p.description.toLowerCase().includes(searchLower)
        );
      }

      return products;
    },
  });
}

export function useFirebaseCategories() {
  return useQuery({
    queryKey: ["firebase-categories"],
    queryFn: async () => {
      const categoriesRef = collection(db, "categories");
      const querySnapshot = await getDocs(categoriesRef);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    },
  });
}
