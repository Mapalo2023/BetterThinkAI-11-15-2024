import React from 'react';
import { useAuthStore } from '../../store/authStore';
import { Users, Shield, ShieldOff, Trash2 } from 'lucide-react';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import toast from 'react-hot-toast';

interface UserData {
  id: string;
  email: string;
  isAdmin: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export default function UserManagement() {
  const { user: currentUser, userRole, appointAdmin, removeAdmin } = useAuthStore();
  const [users, setUsers] = React.useState<UserData[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const usersRef = collection(db, 'users');
      const rolesRef = collection(db, 'userRoles');
      
      const [usersSnap, rolesSnap] = await Promise.all([
        getDocs(query(usersRef)),
        getDocs(query(rolesRef))
      ]);

      const rolesMap = new Map(
        rolesSnap.docs.map(doc => [doc.id, doc.data()])
      );

      const userData = usersSnap.docs.map(doc => {
        const data = doc.data();
        const role = rolesMap.get(doc.id);
        return {
          id: doc.id,
          email: data.email,
          isAdmin: role?.isAdmin || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          lastLogin: data.lastLogin?.toDate()
        };
      });

      setUsers(userData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleAdmin = async (userId: string, isCurrentlyAdmin: boolean) => {
    try {
      if (isCurrentlyAdmin) {
        await removeAdmin(userId);
      } else {
        await appointAdmin(userId);
      }
      await fetchUsers();
      toast.success(`Admin status ${isCurrentlyAdmin ? 'removed' : 'granted'}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'users', userId));
      await deleteDoc(doc(db, 'userRoles', userId));
      await fetchUsers();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  if (!userRole?.isAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">Admin Access Required</h3>
        <p className="text-gray-500 mt-2">
          You need administrator privileges to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <Users className="w-7 h-7 text-blue-500" />
          User Management
        </h2>
        <p className="text-gray-500 mt-1">
          Manage user accounts and permissions
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="font-medium">All Users</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Last Login</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((userData) => (
                  <tr key={userData.id}>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {userData.email}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        userData.isAdmin 
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {userData.isAdmin ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {userData.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {userData.lastLogin?.toLocaleDateString() || 'Never'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {userData.id !== currentUser?.uid && (
                        <>
                          <button
                            onClick={() => handleToggleAdmin(userData.id, userData.isAdmin)}
                            className="p-1 text-gray-400 hover:text-blue-600"
                            title={userData.isAdmin ? 'Remove admin' : 'Make admin'}
                          >
                            {userData.isAdmin ? (
                              <ShieldOff className="w-5 h-5" />
                            ) : (
                              <Shield className="w-5 h-5" />
                            )}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userData.id)}
                            className="p-1 text-gray-400 hover:text-red-600"
                            title="Delete user"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}