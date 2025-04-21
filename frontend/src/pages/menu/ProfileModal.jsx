import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
const ProfileModal = () => {
  const { userData } = useAuth();
  useEffect(() => {
    console.log(userData);
  }, [userData]);
  return (
    <div className="fixed bottom-20 right-5 bg-white shadow-xl p-4 rounded-xl w-80 z-40">
      <h2 className="text-lg font-bold mb-2">Profile</h2>
      <p>mọe cái này là hiện thông tin bản thân , có ô cập nhật thông tin !</p>
    </div>
  );
};

export default ProfileModal;
