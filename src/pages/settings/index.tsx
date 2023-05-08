import { NextPage } from 'next';
import useAuth from '@/contexts/auth';

const Settings: NextPage = () => {
  const { user } = useAuth();
  console.log(user);

  return <div>Settings</div>;
};

export default Settings;
