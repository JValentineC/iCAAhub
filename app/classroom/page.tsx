'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Classroom } from '@/lib/types/classroom';
import LoadingIndicator from '@/components/general/LoadingIndicator';
import ErrorAlertBanner from '@/components/general/ErrorAlertBanner';

export default withPageAuthRequired(function ClassroomsPage() {
  const { user, isLoading: isUserLoading } = useUser();

  const userAuth0Id = user?.sub || null;

  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [classrooms, setClassrooms] = useState<Classroom[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userAuth0Id) return;
    console.log(`userAuth0Id: ${userAuth0Id}`);
    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch(`/api/users?auth0Id=${userAuth0Id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch userId');
        }
        const { data } = await response.json();
        console.log('Fetched user data:', data);
        setUserId(data.user_id);
        setUserRole(data.role);
      } catch (err) {
        console.error(err);
        setError('Error fetching user ID');
      }
    };

    fetchLoggedInUser();
  }, [userAuth0Id]);

  useEffect(() => {
    if (!userId || !userRole) return;
    const fetchUserClassrooms = async () => {
      setError('');
      try {
        const response = await fetch(`/api/user_classroom?userId=${userId}&userRole=${userRole}`);
        if (!response.ok) {
          throw new Error('Failed to fetch classrooms');
        }
        const { data } = await response.json();
        setClassrooms(data || ([] as Classroom[]));
      } catch (err) {
        // console.error(err);
        setError('Error fetching classrooms');
      }
    };
    fetchUserClassrooms();
  }, [userId, userRole]);

  if (isUserLoading || !classrooms) return <LoadingIndicator />;

  return (
    <div>
      {error && <ErrorAlertBanner message={error} />}

      {classrooms.length === 0 ? (
        <p>No classrooms found.</p>
      ) : (
        <div className="p-6">
          <h1 className="text-3xl font-bold">Your Classrooms</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classrooms.map(classroom => (
              <Link
                key={classroom.classroom_id}
                href={`/classrooms/${classroom.classroom_id}?role=${userRole}?class=${encodeURIComponent(classroom.name)}`}
                className="no-underline"
              >
                <div className="card card-side bg-base-300 shadow-2xl w-96 border-gray-100">
                  <div className="card-body">
                    <div className="card-actions justify-end">
                      <button>Button</button>
                    </div>
                    <h1 className="card-title text-blue-500">{classroom.name}</h1>
                    <p className="font-light">{classroom.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
