'use client';

import { useRouter } from "next/navigation";
import UserForm from "@components/UserForm";

export default function Home() {
  const router = useRouter();
  
  const redirectToDashboard = () => router.push('/dashboard');
  
  return <UserForm onSubmit={redirectToDashboard} />;
}
