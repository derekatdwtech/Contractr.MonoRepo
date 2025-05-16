import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useFetch } from "../hooks/useFetch";
import { config } from "../config";

const UserOrgContext = createContext();

export const useUserOrg = () => useContext(UserOrgContext);

export const UserOrgProvider = ({ children }) => {
  const { user, isLoading: authLoading, loginWithRedirect } = useAuth0();
  const auth0User = user;
  const { get, post } = useFetch();
  const [userProfile, setUserProfile] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserOrgData = async () => {
    setLoading(true);
    try {
      // 1. Refresh user profile
      const userRes = await get(`${config.API_URL}/User`, null, true);
      if (userRes.ok) {
        const profile = await userRes.json();
        setUserProfile(profile);
      }

      // 2. Refresh organization
      const orgRes = await get(`${config.API_URL}/Organization/owner`, null, true);
      if (orgRes.ok) {
        setOrganization(await orgRes.json());
      } else if (orgRes.status === 404) {
        setOrganization(null);
      }
    } catch (e) {
      console.error('Error refreshing user/org data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const setup = async () => {
      if (authLoading) return;
      if (!user) {
        await loginWithRedirect();
        return;
      }
      // 1. Ensure user exists in DB
      let profile = null;
      try {
        const res = await get(`${config.API_URL}/User`, null, true);
        if (res.ok) {
          profile = await res.json();
        } else {
          // Create user
          const createRes = await post(`${config.API_URL}/User`, {
            email: user.email,
            id: user.sub,
            is_active: true,
          }, true);
          profile = await createRes.json();
        }
        setUserProfile(profile);
      } catch (e) {
        setLoading(false);
        return;
      }

      // 2. Ensure organization exists
      try {
        const res = await get(`${config.API_URL}/Organization/owner`, null, true);
        if (res.ok) {
          setOrganization(await res.json());
        } else if (res.status === 404) {
          setOrganization(null); // Or trigger org setup flow
        }
      } catch (e) {
        setOrganization(null);
      }
      setLoading(false);
    };
    setup();
  }, [authLoading, user]);

  return (
    <UserOrgContext.Provider value={{ 
      userProfile, 
      auth0User, 
      organization, 
      loading,
      refreshUserOrgData 
    }}>
      {children}
    </UserOrgContext.Provider>
  );
};