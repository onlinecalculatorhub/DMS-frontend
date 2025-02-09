// DMS Frontend (React + Tailwind CSS)

import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from 'framer-motion';

const CLIENT_ID = 'YOUR_AZURE_CLIENT_ID';
const REDIRECT_URI = 'https://your-vercel-app.vercel.app';
const AUTHORITY = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
const SCOPE = 'User.Read Files.ReadWrite';

export default function App() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    const accessToken = params.get('access_token');

    if (accessToken) {
      fetch('https://graph.microsoft.com/v1.0/me', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(data => setUser(data));

      fetch('https://graph.microsoft.com/v1.0/me/drive/root/children', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
        .then(res => res.json())
        .then(data => setFiles(data.value));
    }
  }, []);

  const handleLogin = () => {
    const authUrl = `${AUTHORITY}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scope=${SCOPE}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {!user ? (
        <div className="flex justify-center items-center h-screen">
          <Button onClick={handleLogin} className="px-6 py-3 text-white bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700">
            Login with Microsoft
          </Button>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center my-4">Welcome, {user.displayName}</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {files.map(file => (
              <motion.div 
                key={file.id} 
                whileHover={{ scale: 1.05 }} 
                className="rounded-xl bg-white shadow-md p-4">
                <Card>
                  <CardContent>
                    <p className="font-semibold">{file.name}</p>
                    <a 
                      href={file['@microsoft.graph.downloadUrl']} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
