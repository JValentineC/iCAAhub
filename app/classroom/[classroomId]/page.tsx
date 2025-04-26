'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0';
import { Classroom } from '@/lib/types/classroom';
import LoadingIndicator from '@/components/general/LoadingIndicator';
import TeacherForm from '@/components/classroom/teacher/TeacherForm';
import StudentForm from '@/components/classroom/student/StudentForm';
import ErrorAlertBanner from '@/components/general/ErrorAlertBanner';

export default withPageAuthRequired(function ClassroomPage() {
  const { user, isLoading: isUserLoading } = useUser();

  const userAuth0Id = user?.sub || null;

  const { classroomId } = useParams();

  const [userId, setUserId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [classroom, setClassroom] = useState<Classroom | null>(null);
  const safeUserId = userId && Array.isArray(userId) ? Number(userId[0]) : Number(userId);
  const [error, setError] = useState('');

  const [openSection, setOpenSection] = useState<'teacher' | 'student' | null>(null);
  const [openTeacherView, setOpenTeacherView] = useState<boolean>(false);

  useEffect(() => {
    if (!userAuth0Id) return;

    const fetchLoggedInUser = async () => {
      try {
        const response = await fetch(`/api/users?auth0Id=${userAuth0Id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch userId');
        }
        const { data } = await response.json();
        // console.log('Fetched user data:', data);
        setUserId(data.user_id);
        setUserRole(data.role);
      } catch (err) {
        // console.error(err);
        setError('Error fetching user ID');
      }
    };
    fetchLoggedInUser();
  }, [userAuth0Id]);

  useEffect(() => {
    if (!userId || !userRole) return;
    const fetchUserClassrooms = async () => {
      try {
        setError('');
        const response = await fetch(`/api/classroom?classroomId=${classroomId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch classrooms');
        }
        const { data } = await response.json();
        setClassroom(data);
      } catch (err) {
        // console.error(err);
        setError('Error fetching classrooms');
      }
    };
    fetchUserClassrooms();
  }, [userId, classroomId]);

  if (isUserLoading || !classroom) return <LoadingIndicator />;

  return (
    <div className="p-6">
      {error && <ErrorAlertBanner message={error} />}

      <h1 className="text-3xl font-bold">{classroom.name}</h1>

      {(userRole === 'teacher' || userRole === 'teaching_assistant') && userId && (
        <TeacherForm classroomId={String(classroom.classroom_id)} classroomName={classroom.name} userId={safeUserId} />
      )}

      {userRole === 'student' && userId && (
        <StudentForm classroomId={String(classroom.classroom_id)} classroomName={classroom.name} userId={safeUserId} />
      )}

      {userRole === 'admin' && userId && (
        <div>
          {/* Teacher View */}
          <div className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input
              type="checkbox"
              name="teacher-form-accordion"
              checked={openSection === 'teacher'}
              onChange={() => setOpenSection(openSection === 'teacher' ? null : 'teacher')}
            />
            <div className="collapse-title font-semibold">Teacher View</div>
            <div className="collapse-content">
              <TeacherForm
                classroomId={String(classroom.classroom_id)}
                classroomName={classroom.name}
                userId={safeUserId}
              />
            </div>
          </div>

          <div className="divider"></div>

          {/* Student View */}
          <div className="collapse collapse-arrow bg-base-100 border border-base-300">
            <input
              type="checkbox"
              name="student-form-accordion"
              checked={openSection === 'student'}
              onChange={() => setOpenSection(openSection === 'student' ? null : 'student')}
            />
            <div className="collapse-title font-semibold">Student View</div>
            <div className="collapse-content">
              <StudentForm
                classroomId={String(classroom.classroom_id)}
                classroomName={classroom.name}
                userId={safeUserId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
