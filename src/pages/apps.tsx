import useAuth from '@/contexts/auth';

export default function Teste() {
  const { isAuthenticated } = useAuth();
  return <div>{`Authorized: ${isAuthenticated}`}</div>;
}
